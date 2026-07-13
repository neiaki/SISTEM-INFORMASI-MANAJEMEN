"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import { Toast, type ToastType } from "@/components/ui/toast";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Task = {
  id: string;
  idMk?: string;
  course: string;
  title: string;
  type: string;
  deadline: string;
  status: string;
  priority: string;
  progress: number;
  note?: string;
  closed?: boolean;
  closedAt?: string;
  tolerance?: number;
  createdAt?: string;
  submissions?: any[];
  comments?: any[];
  _count?: { submissions: number };
};

const MK_COLORS = [
  "bg-forest/10 text-forest",
  "bg-teal/10 text-teal",
  "bg-gold/15 text-gold",
  "bg-rose/10 text-rose",
  "bg-[#7c3aed]/10 text-[#7c3aed]",
];
function mkColor(course: string) {
  const idx = [...course].reduce((a, c) => a + c.charCodeAt(0), 0) % MK_COLORS.length;
  return MK_COLORS[idx];
}

const STATUS_MAP = {
  "baru dibuka": { cls: "bg-teal/10 text-teal",    label: "Baru Dibuka", desc: "Tugas diterbitkan kurang dari 24 jam yang lalu"  },
  "berjalan":    { cls: "bg-gold/15 text-gold",    label: "Berjalan",    desc: "Tugas aktif dan terbuka untuk pengumpulan"       },
  "selesai":     { cls: "bg-forest/10 text-forest", label: "Selesai",    desc: "Tugas sudah ditutup oleh dosen"                  },
};

function getTaskStatus(task: Task): keyof typeof STATUS_MAP {
  if (task.closed || task.status === "selesai") return "selesai";
  if (!task.createdAt) return "berjalan";
  const hoursSince = (Date.now() - new Date(task.createdAt).getTime()) / 3_600_000;
  return hoursSince < 24 ? "baru dibuka" : "berjalan";
}

const PROGRESS_BAR = [
  "bg-gradient-to-r from-forest to-forest-2",
  "bg-gradient-to-r from-teal to-[#2a9d8f]",
  "bg-gradient-to-r from-gold to-gold-2",
  "bg-gradient-to-r from-rose to-[#e74c3c]",
];

const COURSES = ["Analisis SI", "Keamanan Sistem", "SI Enterprise", "PPL", "Basis Data", "PPL Lanjut"];
const EMPTY_FORM = { title: "", course: "", type: "individu", deadline: "", description: "", tolerance: "0" };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function deadlineCls(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return "text-rose font-semibold";
  if (diff <= 3) return "text-rose font-semibold";
  if (diff <= 7) return "text-gold font-semibold";
  return "text-muted";
}

export default function DosenTugasPage() {
  const topbarQ = useSearch();
  const router = useRouter();
  const [filter, setFilter]         = useState("semua");
  const [courseFilter, setCourseFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm]     = useState(EMPTY_FORM);
  const [editTask, setEditTask]         = useState<Task | null>(null);
  const [editForm, setEditForm]         = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dupTask, setDupTask]           = useState<Task | null>(null);
  const [dupForm, setDupForm]           = useState({ title: "", course: "", deadline: "" });
  const [toast, setToast]               = useState<{ message: string; type: ToastType } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, error, isLoading } = useSWR("/api/tugas", fetcher);

  // Map API data to Task type
  const rawTasks = data?.tasks || [];
  const allTasks: Task[] = rawTasks.map((t: any) => {
    return {
      id: t.id,
      idMk: t.idMk,
      title: t.judul,
      course: t.mataKuliah?.namaMk || "Unknown",
      type: t.jenis?.toLowerCase() || "individu",
      status: t.statusGlobal?.toLowerCase() || "berjalan",
      deadline: t.deadline,
      priority: "sedang",
      progress: 0,
      note: t.deskripsi || "",
      createdAt: t.createdAt,
      closed: t.statusGlobal === "selesai",
      _count: t._count,
    };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (dupTask) setDupTask(null);
      else if (editTask) setEditTask(null);
      else if (isCreateOpen) setIsCreateOpen(false);
      else if (confirmDelete) setConfirmDelete(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dupTask, editTask, isCreateOpen, confirmDelete]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!createForm.title || !createForm.course || !createForm.deadline) return;
    setIsSubmitting(true);
    
    // Find course ID from courses
    // Hardcode for now, but usually it should be the ID from a dropdown
    let idMk = "unknown";
    if (rawTasks.length > 0) {
      const matchingCourse = rawTasks.find((t: any) => t.mataKuliah?.namaMk === createForm.course);
      if (matchingCourse) idMk = matchingCourse.idMk;
    }
    
    try {
      const res = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idMk, // In a real app we'd fetch course list. For now we try to find it.
          judul: createForm.title,
          deskripsi: createForm.description,
          deadline: createForm.deadline,
          jenis: createForm.type,
        })
      });

      if (res.ok) {
        mutate("/api/tugas"); // Re-fetch tasks
        setCreateForm(EMPTY_FORM);
        setIsCreateOpen(false);
        setToast({ message: "Tugas baru berhasil dibuat!", type: "success" });
      } else {
        setToast({ message: "Gagal membuat tugas. ID MK tidak valid.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Terjadi kesalahan", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(task: Task) {
    setEditTask(task);
    setEditForm({
      title: task.title,
      course: task.course,
      type: task.type,
      deadline: task.deadline,
      description: task.note || "",
      tolerance: String(task.tolerance ?? 0),
    });
  }

  async function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTask) return;
    setIsSubmitting(true);
    
    let idMk = editTask.idMk;
    if (editForm.course !== editTask.course) {
      const matchingCourse = rawTasks.find((t: any) => t.mataKuliah?.namaMk === editForm.course);
      if (matchingCourse) idMk = matchingCourse.idMk;
    }

    try {
      const res = await fetch(`/api/tugas/${editTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idMk,
          judul: editForm.title,
          deskripsi: editForm.description,
          deadline: new Date(editForm.deadline).toISOString(),
          jenis: editForm.type,
        })
      });

      if (res.ok) {
        mutate("/api/tugas");
        setEditTask(null);
        setToast({ message: "Tugas berhasil diperbarui!", type: "success" });
      } else {
        setToast({ message: "Gagal memperbarui tugas.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Terjadi kesalahan", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/tugas/${id}`, { method: "DELETE" });
      if (res.ok) {
        mutate("/api/tugas");
        setConfirmDelete(null);
        setToast({ message: "Tugas berhasil dihapus!", type: "success" });
      } else {
        setToast({ message: "Gagal menghapus tugas.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Terjadi kesalahan", type: "error" });
    }
  }

  async function handleClose(id: string) {
    try {
      const res = await fetch(`/api/tugas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusGlobal: "Selesai" })
      });
      if (res.ok) {
        mutate("/api/tugas");
        setToast({ message: "Tugas berhasil ditutup!", type: "success" });
      } else {
        setToast({ message: "Gagal menutup tugas.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Terjadi kesalahan", type: "error" });
    }
  }

  async function handleReopen(id: string) {
    try {
      const res = await fetch(`/api/tugas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusGlobal: "Sedang Dikerjakan" })
      });
      if (res.ok) {
        mutate("/api/tugas");
        setToast({ message: "Tugas berhasil dibuka kembali!", type: "success" });
      } else {
        setToast({ message: "Gagal membuka tugas.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Terjadi kesalahan", type: "error" });
    }
  }

  function openDuplicate(task: Task) {
    setDupTask(task);
    setDupForm({ title: `Copy of ${task.title}`, course: task.course, deadline: "" });
  }

  async function handleDuplicate(e: React.FormEvent) {
    e.preventDefault();
    if (!dupTask || !dupForm.title || !dupForm.course || !dupForm.deadline) return;
    setIsSubmitting(true);
    
    let idMk = dupTask.idMk;
    if (dupForm.course !== dupTask.course) {
      const matchingCourse = rawTasks.find((t: any) => t.mataKuliah?.namaMk === dupForm.course);
      if (matchingCourse) idMk = matchingCourse.idMk;
    }

    try {
      const res = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idMk,
          judul: dupForm.title,
          deskripsi: dupTask.note,
          deadline: new Date(dupForm.deadline).toISOString(),
          jenis: dupTask.type,
          bobotNilai: 100,
          tipe: "Tugas"
        })
      });

      if (res.ok) {
        mutate("/api/tugas");
        setDupTask(null);
        setToast({ message: "Tugas berhasil diduplikat!", type: "success" });
      } else {
        setToast({ message: "Gagal menduplikat tugas.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Terjadi kesalahan", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoToRekap(id: string) {
    localStorage.setItem("dosen_rekap_active_task", id);
    router.push("/dosen/rekap");
  }

  const filtered = allTasks.filter(t => {
    const st = getTaskStatus(t);
    const matchFilter =
      filter === "aktif"   ? st !== "selesai" :
      filter === "selesai" ? st === "selesai" : true;
    const matchCourse = !courseFilter || t.course === courseFilter;
    const matchQ = !topbarQ || t.title.toLowerCase().includes(topbarQ.toLowerCase()) || t.course.toLowerCase().includes(topbarQ.toLowerCase());
    return matchFilter && matchCourse && matchQ;
  });

  const courseTasks = courseFilter ? allTasks.filter(t => t.course === courseFilter) : allTasks;
  const tabs = [
    { id: "semua",   label: `Semua (${courseTasks.length})` },
    { id: "aktif",   label: `Aktif (${courseTasks.filter(t => getTaskStatus(t) !== "selesai").length})` },
    { id: "selesai", label: `Selesai (${courseTasks.filter(t => getTaskStatus(t) === "selesai").length})` },
  ];

  const modalInputCls = "w-full bg-cream border border-border text-ink rounded-lg px-3 py-2 text-[13px] outline-none focus:border-forest transition-colors";
  const modalLabelCls = "block text-[11px] text-muted uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-6">

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => setIsCreateOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-paper rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-md animate-fadeIn">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
                <h2 className="font-serif text-[17px] text-ink">Buat Tugas Baru</h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-muted hover:text-ink transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
                <div>
                  <label className={modalLabelCls}>Judul Tugas *</label>
                  <input required value={createForm.title} onChange={e => setCreateForm(f => ({...f, title: e.target.value}))} placeholder="Judul tugas…" className={modalInputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={modalLabelCls}>Mata Kuliah *</label>
                    <select required value={createForm.course} onChange={e => setCreateForm(f => ({...f, course: e.target.value}))} className={modalInputCls}>
                      <option value="">Pilih MK</option>
                      {COURSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Jenis</label>
                    <select value={createForm.type} onChange={e => setCreateForm(f => ({...f, type: e.target.value}))} className={modalInputCls}>
                      <option value="individu">Individu</option>
                      <option value="kelompok">Kelompok</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={modalLabelCls}>Deadline *</label>
                    <input required type="date" value={createForm.deadline} onChange={e => setCreateForm(f => ({...f, deadline: e.target.value}))} className={modalInputCls} />
                  </div>
                  <div>
                    <label className={modalLabelCls}>Toleransi Terlambat (jam)</label>
                    <input type="number" min="0" max="72" value={createForm.tolerance} onChange={e => setCreateForm(f => ({...f, tolerance: e.target.value}))} className={modalInputCls} />
                  </div>
                </div>
                <div>
                  <label className={modalLabelCls}>Deskripsi</label>
                  <textarea value={createForm.description} onChange={e => setCreateForm(f => ({...f, description: e.target.value}))} rows={3} placeholder="Instruksi pengerjaan…" className={`${modalInputCls} resize-none`} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 border border-border text-muted hover:text-ink py-2 rounded-lg text-[13px] transition-colors">Batal</button>
                  <button type="submit" className="flex-1 bg-forest text-white hover:bg-forest-2 py-2 rounded-lg text-[13px] font-semibold transition-colors">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* EDIT MODAL */}
      {editTask && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => setEditTask(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-paper rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-md animate-fadeIn">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
                <h2 className="font-serif text-[17px] text-ink">Edit Tugas</h2>
                <button onClick={() => setEditTask(null)} className="text-muted hover:text-ink transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleEditSave} className="px-6 py-5 space-y-4">
                <div>
                  <label className={modalLabelCls}>Judul Tugas *</label>
                  <input required value={editForm.title} onChange={e => setEditForm(f => ({...f, title: e.target.value}))} className={modalInputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={modalLabelCls}>Mata Kuliah *</label>
                    <select required value={editForm.course} onChange={e => setEditForm(f => ({...f, course: e.target.value}))} className={modalInputCls}>
                      <option value="">Pilih MK</option>
                      {COURSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Jenis</label>
                    <select value={editForm.type} onChange={e => setEditForm(f => ({...f, type: e.target.value}))} className={modalInputCls}>
                      <option value="individu">Individu</option>
                      <option value="kelompok">Kelompok</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={modalLabelCls}>Deadline *</label>
                  <input required type="date" value={editForm.deadline} onChange={e => setEditForm(f => ({...f, deadline: e.target.value}))} className={modalInputCls} />
                </div>
                <div>
                  <label className={modalLabelCls}>Deskripsi</label>
                  <textarea value={editForm.description} onChange={e => setEditForm(f => ({...f, description: e.target.value}))} rows={3} className={`${modalInputCls} resize-none`} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setEditTask(null)} className="flex-1 border border-border text-muted hover:text-ink py-2 rounded-lg text-[13px] transition-colors">Batal</button>
                  <button type="submit" className="flex-1 bg-forest text-white hover:bg-forest-2 py-2 rounded-lg text-[13px] font-semibold transition-colors">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-paper rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-sm animate-fadeIn p-6 text-center">
              <div className="text-[32px] mb-3">🗑️</div>
              <h2 className="font-serif text-[17px] text-ink mb-2">Hapus Tugas?</h2>
              <p className="text-[13px] text-muted mb-5">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-border text-muted hover:text-ink py-2 rounded-lg text-[13px] transition-colors">Batal</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-rose text-white hover:opacity-90 py-2 rounded-lg text-[13px] font-semibold transition-colors">Hapus</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DUPLICATE MODAL */}
      {dupTask && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => setDupTask(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-paper rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-md animate-fadeIn">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
                <div>
                  <h2 className="font-serif text-[17px] text-ink">Duplikat Tugas</h2>
                  <div className="text-[11px] text-muted mt-0.5">Salin ke mata kuliah lain dengan deadline baru</div>
                </div>
                <button onClick={() => setDupTask(null)} className="text-muted hover:text-ink transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleDuplicate} className="px-6 py-5 space-y-4">
                <div>
                  <label className={modalLabelCls}>Judul Tugas Baru *</label>
                  <input required value={dupForm.title} onChange={e => setDupForm(f => ({...f, title: e.target.value}))} className={modalInputCls} />
                </div>
                <div>
                  <label className={modalLabelCls}>Mata Kuliah Target *</label>
                  <select required value={dupForm.course} onChange={e => setDupForm(f => ({...f, course: e.target.value}))} className={modalInputCls}>
                    <option value="">Pilih MK</option>
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={modalLabelCls}>Deadline Baru *</label>
                  <input required type="date" value={dupForm.deadline} onChange={e => setDupForm(f => ({...f, deadline: e.target.value}))} className={modalInputCls} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setDupTask(null)} className="flex-1 border border-border text-muted hover:text-ink py-2 rounded-lg text-[13px] transition-colors">Batal</button>
                  <button type="submit" className="flex-1 bg-forest text-white hover:bg-forest-2 py-2 rounded-lg text-[13px] font-semibold transition-colors">📋 Duplikat</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[24px] text-ink">Manajemen Tugas</div>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="bg-paper border-[1.5px] border-border text-ink-2 px-3 py-2 rounded-lg text-[13px] outline-none focus:border-forest transition-colors"
          >
            <option value="">Semua Mata Kuliah</option>
            {[...new Set(allTasks.map(t => t.course))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-forest text-white hover:bg-forest-2 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(45,90,61,0.25)] px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5"
          >
            <span>+</span> Buat Tugas Baru
          </button>
        </div>
      </div>

      {/* STAT MINI ROW */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Tugas", val: courseTasks.length,                                                      icon: "📋", accent: "text-forest", bg: "bg-forest/8" },
          { label: "Aktif",       val: courseTasks.filter(t => getTaskStatus(t) !== "selesai").length,          icon: "⚡", accent: "text-gold",   bg: "bg-gold/8"   },
          { label: "Selesai",     val: courseTasks.filter(t => getTaskStatus(t) === "selesai").length,          icon: "✅", accent: "text-teal",   bg: "bg-teal/8"   },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border border-border/60 rounded-xl px-4 py-3 flex items-center gap-3`}>
            <span className="text-[22px]">{s.icon}</span>
            <div>
              <div className={`font-serif text-[24px] leading-none ${s.accent}`}>{s.val}</div>
              <div className="text-[11px] text-muted mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TAB FILTER */}
      <div className="flex gap-0.5 bg-cream border border-border rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`text-[12.5px] font-medium px-4 py-1.5 rounded-lg transition-all ${
              filter === tab.id ? "bg-paper text-forest shadow-sm font-semibold" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status legend */}
      <div className="flex items-start gap-3 flex-wrap bg-cream border border-border/60 rounded-xl px-4 py-3">
        <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-0.5 shrink-0">Keterangan Status:</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {Object.values(STATUS_MAP).map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.cls}`}>{s.label}</span>
              <span className="text-[11px] text-muted">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-paper border-[1.5px] border-border rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] overflow-hidden">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr>
              {["Judul Tugas","Mata Kuliah","Jenis","Deadline","Pengumpulan"].map(h => (
                <th key={h} className="text-left py-2.5 px-4 text-[11px] font-semibold text-muted uppercase tracking-[0.06em] bg-cream border-b-[1.5px] border-border whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="text-left py-2.5 px-4 text-[11px] font-semibold text-muted uppercase tracking-[0.06em] bg-cream border-b-[1.5px] border-border whitespace-nowrap">
                <span className="flex items-center gap-1">
                  Status
                  <span className="text-[9px] text-muted/50 font-normal normal-case tracking-normal">(lihat keterangan ↑)</span>
                </span>
              </th>
              <th className="text-left py-2.5 px-4 text-[11px] font-semibold text-muted uppercase tracking-[0.06em] bg-cream border-b-[1.5px] border-border whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task, idx) => {
              const statusKey = getTaskStatus(task);
              const st = STATUS_MAP[statusKey];
              const submitted = task.submissions?.length ?? 0;
              const total = 36 + (idx * 4 % 10);
              const pct = Math.round((submitted / total) * 100);
              const barCls = PROGRESS_BAR[idx % PROGRESS_BAR.length];
              return (
                <tr key={task.id} className={`border-b border-border/50 last:border-0 hover:bg-forest/[0.03] transition-colors ${statusKey === "selesai" ? "opacity-60" : ""}`}>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{task.title}</div>
                    <div className="text-[11px] text-muted mt-0.5 flex items-center gap-2">
                      <span>Deadline {formatDate(task.deadline)}</span>
                      {(task.tolerance ?? 0) > 0 && (
                        <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded">+{task.tolerance}j toleransi</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${mkColor(task.course)}`}>{task.course}</span>
                  </td>
                  <td className="py-3.5 px-4 text-muted text-[12px] capitalize">{task.type}</td>
                  <td className={`py-3.5 px-4 font-mono text-[12px] ${deadlineCls(task.deadline)}`}>
                    {formatDate(task.deadline)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-cream-2 rounded-full overflow-hidden">
                        <div className={`h-full ${barCls} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-mono text-[12px] text-ink-2 whitespace-nowrap">{submitted}/{total}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {statusKey !== "selesai" ? (
                        <button
                          onClick={() => handleClose(task.id)}
                          className="bg-paper text-forest border-[1.5px] border-forest/30 hover:bg-forest/5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap"
                        >
                          Tutup
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleGoToRekap(task.id)}
                            className="bg-forest text-white hover:bg-forest-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap"
                          >
                            Nilai →
                          </button>
                          <button
                            onClick={() => handleReopen(task.id)}
                            className="bg-paper text-teal border-[1.5px] border-teal/30 hover:bg-teal/5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap"
                          >
                            Buka Kembali
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openEdit(task)}
                        className="bg-paper text-ink-2 border-[1.5px] border-border hover:border-forest hover:text-forest px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(task.id)}
                        className="bg-paper text-rose border-[1.5px] border-rose/25 hover:bg-rose/5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => openDuplicate(task)}
                        className="bg-paper text-gold border-[1.5px] border-gold/30 hover:bg-gold/5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap"
                      >
                        📋 Duplikat
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
