"use client";

import { useState, useEffect, Fragment } from "react";
import { MessageSquare, Paperclip, ChevronDown, ChevronUp, Check, X, Bell, Lock, Loader2 } from "lucide-react";
import { Toast, type ToastType } from "@/components/ui/toast";
import { useSearch } from "@/lib/search-context";
import { EmptyState } from "@/components/empty-state";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const AVATAR_COLORS = [
  "from-forest to-teal",
  "from-[#c0392b] to-[#e74c3c]",
  "from-gold to-[#f39c12]",
  "from-teal to-[#2a9d8f]",
  "from-[#636e72] to-[#b2bec3]",
];

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function isGradingAvailable(task: any): boolean {
  // Can only grade if task is closed or deadline passed
  if (!task) return false;
  if (task.status === "selesai") return true;
  return new Date(task.deadline).getTime() < Date.now();
}

export default function DosenRekapPage() {
  const topbarQ = useSearch();
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [notifModal, setNotifModal] = useState(false);
  const [notifSelected, setNotifSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch all tasks for the dosen
  const { data: tasksData, isLoading: isLoadingTasks } = useSWR('/api/tugas', fetcher);
  const allTasks = tasksData?.tasks || [];

  // Automatically select the first task if not selected
  useEffect(() => {
    if (allTasks.length > 0 && !activeTask) {
        // Cek localStorage first (kalau baru pindah halaman)
        const preselected = localStorage.getItem("dosen_rekap_active_task");
        if (preselected && allTasks.find((t: any) => t.id === preselected)) {
            setActiveTask(preselected);
            localStorage.removeItem("dosen_rekap_active_task");
        } else {
            setActiveTask(allTasks[0].id);
        }
    }
  }, [allTasks, activeTask]);

  // 2. Fetch active task details
  const { data: activeTaskData, mutate: mutateTask } = useSWR(activeTask ? `/api/tugas/${activeTask}` : null, fetcher);
  const task = activeTaskData?.task;

  // 3. Pre-fill grades from DB
  useEffect(() => {
    if (task && task.submissions) {
        const initialGrades: Record<string, string> = {};
        task.submissions.forEach((s: any) => {
            if (s.nilai !== null && s.nilai !== undefined) {
                initialGrades[s.id] = String(s.nilai);
            }
        });
        setGrades(initialGrades);
    }
  }, [task]);

  const flash = (msg: string, type: ToastType = "success") => { setToast({ message: msg, type }); };

  useEffect(() => {
    if (!notifModal) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setNotifModal(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [notifModal]);

  const gradingOk = task ? isGradingAvailable(task) : false;
  
  // Aggregate students
  const enrolledStudents = task?.mataKuliah?.enrollments?.map((e: any) => e.mahasiswa) || [];
  const submissions = task?.submissions || [];
  
  const total = enrolledStudents.length;
  const submitted = submissions.length;
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;

  // Build rows matching the enrolled students
  const rows = enrolledStudents.map((mhs: any, i: number) => {
      const sub = submissions.find((s: any) => s.idMahasiswa === mhs.id);
      return {
          id: sub?.id || `pending-${mhs.id}`,
          isSubmitted: !!sub,
          name: mhs.user?.username || mhs.id, // we might not have the full name, username works
          nim: mhs.nim,
          time: sub ? formatDate(sub.updatedAt) : null,
          file: sub?.fileName || null,
          status: sub ? "sudah" : "belum",
          avatarIdx: i % AVATAR_COLORS.length,
          note: sub?.note,
          submissionId: sub?.id
      };
  });

  const displayRows = topbarQ
    ? rows.filter((r: any) => r.name.toLowerCase().includes(topbarQ.toLowerCase()) || r.nim.includes(topbarQ))
    : rows;
  
  const belumKumpul = rows.filter((r: any) => r.status === "belum");

  function toggleComments(key: string) {
    setExpandedComments(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSaveGrades() {
    if (!task) return;
    setIsSaving(true);
    
    let successCount = 0;
    
    for (const row of rows) {
        if (!row.isSubmitted) continue; // cannot grade non-submissions
        const val = grades[row.id];
        if (val !== undefined && val !== "") {
            try {
                await fetch(`/api/submission/${row.submissionId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nilai: parseInt(val, 10) })
                });
                successCount++;
            } catch (err) {
                console.error("Failed to save grade for", row.name);
            }
        }
    }
    
    setIsSaving(false);
    mutateTask(); // Refresh task to get new grades
    flash(`Berhasil menyimpan ${successCount} nilai!`);
  }

  function handleExportCSV() {
    if (!task) return;
    const header = ["Nama", "NIM", "Waktu Kumpul", "File", "Status", "Nilai"];
    const csvRows = rows.map((r: any) => [
      r.name, r.nim,
      r.time ?? "Belum Kumpul",
      r.file ?? "-",
      r.status === "sudah" ? "Sudah Kumpul" : "Belum Kumpul",
      grades[r.id] ?? "-",
    ]);
    const csv = [header, ...csvRows].map(r => r.map((v: string) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap_${task.judul.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    flash("File CSV berhasil diunduh!");
  }

  const gradeValues = Object.values(grades).map(v => parseFloat(v)).filter(v => !isNaN(v));
  const gradeBuckets = {
    A: gradeValues.filter(v => v >= 85).length,
    B: gradeValues.filter(v => v >= 70 && v < 85).length,
    C: gradeValues.filter(v => v >= 55 && v < 70).length,
    D: gradeValues.filter(v => v >= 40 && v < 55).length,
    E: gradeValues.filter(v => v < 40).length,
  } as const;
  const maxBucket = Math.max(...Object.values(gradeBuckets), 1);

  function openNotifModal() {
    setNotifSelected(belumKumpul.map((r: any) => r.id));
    setNotifModal(true);
  }

  async function handleSendNotif() {
    // We would trigger a broadcast endpoint here.
    // For now, it just shows a success toast
    setNotifModal(false);
    flash(`Notifikasi terkirim ke ${notifSelected.length} mahasiswa!`);
  }

  if (isLoadingTasks) return <div className="p-8 text-center text-muted flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat data...</div>;

  return (
    <div className="flex flex-col gap-6">

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[24px] text-ink">Rekap Pengumpulan Tugas</div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📊 Ekspor Excel
          </button>
          <button onClick={openNotifModal} className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5">
            <Bell size={14} /> Kirim Notifikasi
          </button>
        </div>
      </div>

      {/* Task selector */}
      <div className="flex gap-2 flex-wrap">
        {allTasks.map((t: any) => {
          const isSelesai = t.status === "selesai" || new Date(t.deadline).getTime() < Date.now();
          const gradable  = isSelesai;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTask(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all border-[1.5px] flex items-center gap-1.5 ${
                activeTask === t.id
                  ? "bg-forest text-white border-forest"
                  : "bg-paper text-muted border-border hover:border-forest hover:text-forest"
              }`}
            >
              {t.judul}
              {isSelesai && (
                gradable
                  ? <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" title="Penilaian tersedia" />
                  : <Lock size={10} className="shrink-0 opacity-60" aria-label="Penilaian terkunci" />
              )}
            </button>
          );
        })}
      </div>

      {task && (
        <div className="bg-paper border-[1.5px] border-border rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-ink text-[14px]">📥 {task.judul} — {task.mataKuliah.namaMk}</div>
              <div className="text-[12px] text-muted mt-0.5">Deadline: {formatDate(task.deadline)} · {total} Mahasiswa</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-cream-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-forest to-teal rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-[12px] text-ink-2">{submitted}/{total}</span>
              </div>
              <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${pct >= 80 ? "bg-forest/10 text-forest" : "bg-gold/15 text-gold"}`}>
                {pct}% terkumpul
              </span>
            </div>
          </div>

          {/* Lock / grading status banner */}
          {!gradingOk && (
            <div className="px-5 py-3 bg-gold/10 border-b border-border flex items-center gap-2.5 text-[13px]">
              <Lock size={14} className="text-gold shrink-0" />
              <span className="text-gold font-semibold">Tugas Belum Ditutup</span>
              <span className="text-muted">— penilaian dapat dilakukan setelah deadline lewat</span>
            </div>
          )}

          {/* Tabel */}
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Mahasiswa", "NIM", "Waktu Kumpul", "File", "Status", "Nilai", "Komentar"].map(h => (
                  <th key={h} className="text-left py-2.5 px-5 text-[11px] font-semibold text-muted uppercase tracking-[0.06em] bg-cream border-b-[1.5px] border-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-muted">Belum ada mahasiswa terdaftar</td></tr>
              ) : displayRows.map((row: any) => {
                const commentKey     = `${task.id}-${row.id}`;
                const isExpanded     = expandedComments[commentKey];
                
                // Simple comment mock for now since we haven't integrated deep comment relations
                const allRowComments: any[] = []; 

                return (
                  <Fragment key={row.id}>
                    <tr className={`border-b border-border/50 last:border-0 hover:bg-forest/[0.03] transition-colors ${row.status === "belum" ? "bg-rose/[0.025]" : ""}`}>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[row.avatarIdx]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                            {initials(row.name)}
                          </div>
                          <span className="font-medium text-ink">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 font-mono text-[12px] text-muted">{row.nim}</td>
                      <td className={`py-3 px-5 text-[12px] ${row.time ? "text-muted" : "text-rose font-semibold"}`}>
                        {row.time ?? "Belum Kumpul"}
                      </td>
                      <td className="py-3 px-5">
                        {row.file
                          ? <span className="text-[12px] text-forest cursor-pointer hover:underline">📎 {row.file}</span>
                          : <span className="text-[12px] text-muted">—</span>
                        }
                      </td>
                      <td className="py-3 px-5">
                        {row.status === "sudah"
                          ? <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-teal/10 text-teal">Sudah Kumpul</span>
                          : <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-rose/10 text-rose">Belum Kumpul</span>
                        }
                      </td>
                      <td className="py-3 px-5">
                        {row.status === "sudah" ? (
                          gradingOk ? (
                            <input
                              type="text"
                              value={grades[row.id] ?? ""}
                              onChange={e => setGrades(g => ({ ...g, [row.id]: e.target.value }))}
                              placeholder="—"
                              className="w-[52px] px-2 py-1 border-[1.5px] border-border rounded-md font-mono text-[13px] text-center bg-paper text-ink outline-none focus:border-forest transition-colors"
                            />
                          ) : (
                            <span className="flex items-center gap-1 text-muted/50" title="Penilaian belum tersedia">
                              <Lock size={13} />
                            </span>
                          )
                        ) : (
                          <span className="text-[12px] text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        {allRowComments.length > 0 ? (
                          <button
                            onClick={() => toggleComments(commentKey)}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-forest hover:text-forest-2 transition-colors"
                          >
                            <MessageSquare size={13} />
                            <span>{allRowComments.length}</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        ) : (
                          <span className="text-[12px] text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Footer Card */}
          <div className="px-5 py-4 border-t border-border bg-cream/30 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal" />
                <span className="text-[11px] text-muted font-medium">Sudah: <span className="text-ink">{submitted}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose" />
                <span className="text-[11px] text-muted font-medium">Belum: <span className="text-ink">{total - submitted}</span></span>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              {Object.keys(grades).length > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-muted mr-3">
                  <span className="text-forest font-semibold">{gradeValues.length}</span> / {submitted} dinilai
                </div>
              )}
              {isSaving && <Loader2 className="animate-spin text-forest" size={18} />}
              <button
                onClick={handleSaveGrades}
                disabled={!gradingOk || isSaving}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                  gradingOk
                    ? "bg-forest text-white hover:bg-forest-2"
                    : "bg-border text-muted cursor-not-allowed"
                }`}
              >
                <Check size={14} /> Simpan Penilaian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics / Charts - grade distribution */}
      {task && gradeValues.length > 0 && (
        <div className="bg-paper border-[1.5px] border-border rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] p-5">
          <h3 className="text-[14px] font-semibold text-ink mb-5">📈 Distribusi Nilai Sementara</h3>
          <div className="flex items-end gap-2 h-[120px]">
            {Object.entries(gradeBuckets).map(([label, count]) => {
              const h = (count / maxBucket) * 100;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="font-mono text-[12px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-forest to-teal opacity-80 group-hover:opacity-100 transition-all min-h-[4px]"
                    style={{ height: `${h}%` }}
                  />
                  <span className="font-semibold text-ink text-[13px]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Notif Peringatan */}
      {notifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-paper border-[1.5px] border-border rounded-2xl shadow-xl w-[400px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-cream/30">
              <h3 className="font-semibold text-[14px] text-ink flex items-center gap-1.5">
                <Bell size={15} className="text-gold" />
                Kirim Peringatan
              </h3>
              <button onClick={() => setNotifModal(false)} className="text-muted hover:text-rose p-1">
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="text-[13px] text-ink-2 mb-4">
                Peringatan akan dikirimkan ke <strong className="text-ink">{notifSelected.length} mahasiswa</strong> yang belum mengumpulkan tugas ini.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setNotifModal(false)}
                  className="flex-1 py-2 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-ink-2 hover:bg-cream"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendNotif}
                  className="flex-1 py-2 rounded-lg bg-forest text-white text-[13px] font-semibold hover:bg-forest-2"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
