"use client";

import { useState, useEffect, Fragment } from "react";
import { MessageSquare, Paperclip, ChevronDown, ChevronUp, Check, X, Bell, Lock } from "lucide-react";
import { createSeedData } from "@/data/sim-data";
import { getAllTaskData, seedDummyComments, type TaskEntry } from "@/lib/taskStore";
import { useSearch } from "@/lib/search-context";

const data = createSeedData().dosen;

type DosenTask = typeof data.tasks[0] & { closed?: boolean; closedAt?: string; note?: string; createdAt?: string };

const AVATAR_COLORS = [
  "from-forest to-teal",
  "from-[#c0392b] to-[#e74c3c]",
  "from-gold to-[#f39c12]",
  "from-teal to-[#2a9d8f]",
  "from-[#636e72] to-[#b2bec3]",
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function isGradingAvailable(task: DosenTask): boolean {
  return task.closed === true || task.status === "selesai";
}

export default function DosenRekapPage() {
  const topbarQ = useSearch();
  const [grades, setGrades]             = useState<Record<string, string>>({});
  const [allTasks, setAllTasks]         = useState<DosenTask[]>(data.tasks as DosenTask[]);
  const [activeTask, setActiveTask]     = useState<string | null>(data.tasks[0]?.id ?? null);
  const [studentStore, setStudentStore] = useState<Record<string, unknown>>({});
  const [expandedComments, setExpandedComments]     = useState<Record<string, boolean>>({});
  const [toast, setToast]               = useState("");
  const [notifModal, setNotifModal]     = useState(false);
  const [notifSelected, setNotifSelected]           = useState<string[]>([]);
  const [dismissedComments, setDismissedComments]   = useState<string[]>([]);
  const [dismissedSubmissions, setDismissedSubmissions] = useState<string[]>([]);

  useEffect(() => {
    seedDummyComments();
    setStudentStore(getAllTaskData());
    const savedC = localStorage.getItem("dosen_dismissed_comments");
    if (savedC) setDismissedComments(JSON.parse(savedC));
    const savedS = localStorage.getItem("dosen_dismissed_submissions");
    if (savedS) setDismissedSubmissions(JSON.parse(savedS));
    // Muat tugas baru yang dibuat dosen
    const newTasks: DosenTask[] = JSON.parse(localStorage.getItem("dosen_new_tasks") || "[]");
    const overrides: Record<string, { closed?: boolean; closedAt?: string }> =
      JSON.parse(localStorage.getItem("dosen_task_overrides") || "{}");
    const seedTasks = (data.tasks as DosenTask[]).map(t =>
      overrides[t.id] ? { ...t, ...overrides[t.id] } : t
    );
    setAllTasks([...newTasks, ...seedTasks]);
    // Cek jika dinavigasi dari halaman Manajemen Tugas dengan task tertentu
    const preselected = localStorage.getItem("dosen_rekap_active_task");
    if (preselected) {
      setActiveTask(preselected);
      localStorage.removeItem("dosen_rekap_active_task");
    }
  }, []);

  // Muat nilai tersimpan saat task aktif berubah
  useEffect(() => {
    if (!activeTask) return;
    const saved = localStorage.getItem(`dosen_grades_${activeTask}`);
    setGrades(saved ? JSON.parse(saved) : {});
  }, [activeTask]);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  function dismissComment(id: string) {
    setDismissedComments(prev => {
      const next = [...prev, id];
      localStorage.setItem("dosen_dismissed_comments", JSON.stringify(next));
      return next;
    });
  }

  function dismissSubmission(id: string) {
    setDismissedSubmissions(prev => {
      const next = [...prev, id];
      localStorage.setItem("dosen_dismissed_submissions", JSON.stringify(next));
      return next;
    });
  }

  const task      = allTasks.find(t => t.id === activeTask) ?? allTasks[0];
  const gradingOk = task ? isGradingAvailable(task) : false;
  const submitted = task?.submissions?.length ?? 0;
  const total     = 36;
  const pct       = Math.round((submitted / total) * 100);

  const mockRows = task ? [
    ...task.submissions.map((s, i) => ({
      id: s.id,
      name: s.submittedBy,
      nim: `202200${1234 + i}`,
      time: s.submittedAt,
      file: s.fileName,
      status: "sudah",
      avatarIdx: i % AVATAR_COLORS.length,
      note: s.note,
    })),
    {
      id: "pending-1",
      name: "Andi Syahputra",
      nim: "2022001240",
      time: null,
      file: null,
      status: "belum",
      avatarIdx: 4,
      note: null,
    },
  ] : [];

  const allNewSubmissions = Object.entries(studentStore).flatMap(([taskId, entry]) => {
    const e = entry as TaskEntry;
    return (e.submissions || []).map(s => ({ ...s, taskId, taskTitle: e.taskTitle, taskCourse: e.taskCourse }));
  }).filter(s => !dismissedSubmissions.includes(String(s.id)));

  const allNewComments = Object.entries(studentStore).flatMap(([taskId, entry]) => {
    const e = entry as TaskEntry;
    return (e.comments || []).map(c => ({ ...c, taskId, taskTitle: e.taskTitle, taskCourse: e.taskCourse }));
  }).filter(c => !dismissedComments.includes(String(c.id)));

  // Filter berdasarkan task yang sedang aktif
  const taskSubmissions = activeTask ? allNewSubmissions.filter(s => s.taskId === activeTask) : allNewSubmissions;
  const taskComments    = activeTask ? allNewComments.filter(c => c.taskId === activeTask) : allNewComments;
  const hasNewActivity  = taskSubmissions.length > 0 || taskComments.length > 0;

  function toggleComments(key: string) {
    setExpandedComments(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSaveGrades() {
    if (!activeTask) return;
    localStorage.setItem(`dosen_grades_${activeTask}`, JSON.stringify(grades));
    flash("Semua nilai berhasil disimpan!");
  }

  function handleExportCSV() {
    if (!task) return;
    const header = ["Nama", "NIM", "Waktu Kumpul", "File", "Status", "Nilai"];
    const rows = mockRows.map(r => [
      r.name, r.nim,
      r.time ?? "Belum Kumpul",
      r.file ?? "-",
      r.status === "sudah" ? "Sudah Kumpul" : "Belum Kumpul",
      grades[r.id] ?? "-",
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap_${task.title.replace(/\s+/g, "_")}.csv`;
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

  const displayRows = topbarQ
    ? mockRows.filter(r => r.name.toLowerCase().includes(topbarQ.toLowerCase()) || r.nim.includes(topbarQ))
    : mockRows;
  const belumKumpul = mockRows.filter(r => r.status === "belum");

  function openNotifModal() {
    setNotifSelected(belumKumpul.map(r => r.id));
    setNotifModal(true);
  }

  function handleSendNotif() {
    setNotifModal(false);
    flash(`Notifikasi terkirim ke ${notifSelected.length} mahasiswa!`);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-2 bg-paper border border-forest/30 text-forest px-4 py-3 rounded-xl shadow-lg text-[13.5px] font-medium animate-fadeIn">
          <Check size={15} /> {toast}
        </div>
      )}

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

      {/* Kiriman baru dari mahasiswa */}
      {hasNewActivity && (
        <div className="bg-paper border-[1.5px] border-forest/30 rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-forest/[0.04] flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            <h3 className="text-[13.5px] font-semibold text-ink flex-1">Kiriman Baru dari Mahasiswa</h3>
            <span className="text-[11px] text-muted mr-2">
              {taskSubmissions.length} file · {taskComments.length} komentar
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("dosen_dismissed_comments");
                localStorage.removeItem("dosen_dismissed_submissions");
                setDismissedComments([]);
                setDismissedSubmissions([]);
                flash("Semua kiriman berhasil direset.");
              }}
              className="text-[10.5px] font-semibold text-muted hover:text-forest border border-border hover:border-forest px-2.5 py-1 rounded-lg transition-all"
            >
              ↺ Reset Komentar
            </button>
          </div>

          {taskSubmissions.length > 0 && (
            <div className="px-5 py-4 border-b border-border/60">
              <div className="text-[11px] text-muted uppercase tracking-[0.08em] mb-3 flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5"><Paperclip size={11} /> File Dikumpulkan</span>
                <button
                  onClick={() => {
                    const allIds = taskSubmissions.map((s, i) => String(s.id ?? i));
                    setDismissedSubmissions(prev => {
                      const next = [...new Set([...prev, ...allIds])];
                      localStorage.setItem("dosen_dismissed_submissions", JSON.stringify(next));
                      return next;
                    });
                    flash("Semua file dikumpulkan telah ditutup.");
                  }}
                  className="text-[10.5px] font-semibold text-rose/70 hover:text-rose border border-rose/20 hover:border-rose/50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                >
                  <X size={11} /> Tutup Semua
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {taskSubmissions.map((s, i) => (
                  <div key={s.id || i} className="flex items-start gap-3 bg-cream/60 rounded-xl px-4 py-3 group">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                      {initials(s.submittedBy || "EK")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-medium text-ink">{s.submittedBy}</span>
                        <span className="text-[11px] text-forest font-semibold">📎 {s.fileName}</span>
                        {s.fileSize && <span className="text-[11px] text-muted">{s.fileSize}</span>}
                      </div>
                      <div className="text-[11px] text-muted mt-0.5">
                        {s.taskTitle && <><span className="text-ink-2 font-medium">{s.taskTitle}</span> · </>}
                        {s.taskCourse && <span className="text-teal">{s.taskCourse}</span>}
                        {s.submittedAt && <> · {s.submittedAt}</>}
                      </div>
                      {s.note && <div className="text-[11px] text-muted mt-1 italic">"{s.note}"</div>}
                    </div>
                    <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-teal/10 text-teal shrink-0">Sudah Kumpul</span>
                    <button
                      onClick={() => dismissSubmission(String(s.id ?? i))}
                      title="Tutup"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-start p-1 rounded-md text-muted hover:text-rose hover:bg-rose/10"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {taskComments.length > 0 && (
            <div className="px-5 py-4">
              <div className="text-[11px] text-muted uppercase tracking-[0.08em] mb-3 flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1.5"><MessageSquare size={11} /> Komentar Mahasiswa</span>
                <button
                  onClick={() => {
                    const allIds = taskComments.map((c, i) => String(c.id ?? i));
                    setDismissedComments(prev => {
                      const next = [...new Set([...prev, ...allIds])];
                      localStorage.setItem("dosen_dismissed_comments", JSON.stringify(next));
                      return next;
                    });
                    flash("Semua komentar telah ditutup.");
                  }}
                  className="text-[10.5px] font-semibold text-rose/70 hover:text-rose border border-rose/20 hover:border-rose/50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                >
                  <X size={11} /> Tutup Semua
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {taskComments.map((c, i) => (
                  <div key={c.id || i} className="flex gap-3 bg-cream/60 rounded-xl px-4 py-3 group relative">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                      {initials(c.author || "EK")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[13px] font-medium text-ink">{c.author}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gold/15 text-gold">Mahasiswa</span>
                        {c.taskTitle && (
                          <span className="text-[11px] text-muted">→ <span className="text-ink-2 font-medium">{c.taskTitle}</span></span>
                        )}
                      </div>
                      <div className="text-[12.5px] text-ink-2 leading-relaxed">{c.text}</div>
                      <div className="text-[10.5px] text-muted mt-1">{c.time}</div>
                    </div>
                    <button
                      onClick={() => dismissComment(String(c.id ?? i))}
                      title="Tandai sudah dibaca"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-start mt-0.5 p-1 rounded-md text-muted hover:text-rose hover:bg-rose/10"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task selector */}
      <div className="flex gap-2 flex-wrap">
        {allTasks.map(t => {
          const isSelesai = t.closed || t.status === "selesai";
          const gradable  = isGradingAvailable(t);
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
              {t.title}
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
              <div className="font-semibold text-ink text-[14px]">📥 {task.title} — {task.course}</div>
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
              <span className="text-muted">— tutup tugas di menu Manajemen Tugas untuk mengaktifkan penilaian</span>
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
              {displayRows.map(row => {
                const taskEntry   = studentStore[task.id] as TaskEntry | undefined;
                const newComments = (taskEntry?.comments || []).filter(c =>
                  c.author?.toLowerCase().includes(row.name.split(" ")[0].toLowerCase())
                );
                const commentKey     = `${task.id}-${row.id}`;
                const isExpanded     = expandedComments[commentKey];
                const seedComments   = (task.comments || []).filter(c =>
                  c.author?.toLowerCase().includes(row.name.split(" ")[0].toLowerCase())
                );
                const allRowComments = [...seedComments, ...newComments];

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

                    {isExpanded && allRowComments.length > 0 && (
                      <tr className="bg-cream/50">
                        <td colSpan={7} className="px-5 py-3 border-b border-border/40">
                          <div className="flex flex-col gap-2 pl-10">
                            {allRowComments.map((c, ci) => (
                              <div key={c.id || ci} className="flex gap-2.5 items-start">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${c.role === "dosen" ? "bg-gradient-to-br from-forest to-teal" : "bg-gradient-to-br from-gold to-[#f39c12]"}`}>
                                  {initials(c.author)}
                                </div>
                                <div className="flex-1 bg-paper border border-border/60 rounded-lg px-3 py-2">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[11.5px] font-semibold text-ink">{c.author}</span>
                                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.role === "dosen" ? "bg-forest/10 text-forest" : "bg-gold/15 text-gold"}`}>
                                      {c.role === "dosen" ? "Dosen" : "Mahasiswa"}
                                    </span>
                                    <span className="text-[10px] text-muted ml-auto">{c.time}</span>
                                  </div>
                                  <div className="text-[12px] text-ink-2 leading-relaxed">{c.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Footer actions */}
          <div className="px-5 py-4 border-t border-border flex gap-2 flex-wrap">
            <button
              onClick={handleSaveGrades}
              disabled={!gradingOk}
              title={gradingOk ? undefined : "Penilaian belum tersedia untuk tugas ini"}
              className="bg-forest text-white hover:bg-forest-2 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(45,90,61,0.25)] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5"
            >
              💾 Simpan Semua Nilai
            </button>
            <button onClick={handleExportCSV} className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
              📊 Ekspor Excel
            </button>
            <button onClick={openNotifModal} className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5">
              <Bell size={14} /> Kirim Notifikasi ke Mahasiswa
            </button>
          </div>
        </div>
      )}

      {/* Distribusi Nilai */}
      {task && (
        <div className="bg-paper border-[1.5px] border-border rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] p-5">
          <div className="font-semibold text-ink text-[14px] mb-1">📊 Distribusi Nilai</div>
          <div className="text-[12px] text-muted mb-4">
            {gradeValues.length === 0
              ? "Belum ada penilaian — isi nilai di tabel lalu simpan"
              : `${gradeValues.length} mahasiswa dinilai · rata-rata ${(gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(1)}`}
          </div>
          {gradeValues.length > 0 ? (
            <div className="flex items-end gap-5 h-[130px]">
              {(["A","B","C","D","E"] as const).map(grade => {
                const count = gradeBuckets[grade];
                const COLORS: Record<string, string> = { A: "bg-forest", B: "bg-teal", C: "bg-gold", D: "bg-rose/80", E: "bg-rose/50" };
                const RANGE:  Record<string, string> = { A: "85–100", B: "70–84", C: "55–69", D: "40–54", E: "<40" };
                return (
                  <div key={grade} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[12px] font-mono text-ink-2 min-h-[18px]">{count > 0 ? count : ""}</span>
                    <div className="w-full flex items-end justify-center h-[72px]">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${COLORS[grade]}`}
                        style={{ height: `${count > 0 ? Math.max((count / maxBucket) * 72, 6) : 0}px` }}
                      />
                    </div>
                    <span className="text-[14px] font-bold text-ink">{grade}</span>
                    <span className="text-[10px] text-muted">{RANGE[grade]}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[100px] flex items-center justify-center border-[1.5px] border-dashed border-border rounded-xl text-muted text-[13px]">
              Isi nilai di tabel lalu klik &quot;Simpan Semua Nilai&quot;
            </div>
          )}
        </div>
      )}

      {/* Modal: Kirim Notifikasi */}
      {notifModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setNotifModal(false)} />
          <div className="relative bg-paper border border-border rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-serif text-[18px] text-ink">Kirim Notifikasi</h2>
                <div className="text-[12px] text-muted mt-0.5">Pilih mahasiswa yang akan diingatkan</div>
              </div>
              <button onClick={() => setNotifModal(false)} className="text-muted hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4">
              {belumKumpul.length === 0 ? (
                <div className="text-center py-6 text-muted text-[13px]">
                  Semua mahasiswa sudah mengumpulkan tugas. 🎉
                </div>
              ) : (
                <>
                  <div className="text-[11px] text-muted uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Belum mengumpulkan ({belumKumpul.length})</span>
                    <button
                      onClick={() => setNotifSelected(
                        notifSelected.length === belumKumpul.length ? [] : belumKumpul.map(r => r.id)
                      )}
                      className="text-forest hover:underline normal-case font-normal text-[11px]"
                    >
                      {notifSelected.length === belumKumpul.length ? "Batal pilih semua" : "Pilih semua"}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {belumKumpul.map((row, i) => (
                      <label key={row.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-cream transition-colors">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${notifSelected.includes(row.id) ? "bg-forest border-forest" : "border-border"}`}>
                          {notifSelected.includes(row.id) && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                          {initials(row.name)}
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-medium text-ink">{row.name}</div>
                          <div className="text-[11px] text-muted">{row.nim}</div>
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={notifSelected.includes(row.id)}
                          onChange={() => setNotifSelected(p =>
                            p.includes(row.id) ? p.filter(x => x !== row.id) : [...p, row.id]
                          )}
                        />
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setNotifModal(false)} className="flex-1 border border-border text-muted hover:text-ink py-2 rounded-lg text-[13px] font-semibold transition-all">
                Batal
              </button>
              <button
                onClick={handleSendNotif}
                disabled={notifSelected.length === 0}
                className="flex-1 bg-forest text-white hover:bg-forest/90 disabled:opacity-40 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Bell size={14} /> Kirim ke {notifSelected.length} Mahasiswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
