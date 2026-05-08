"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, LogOut, Menu, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchContext } from "@/lib/search-context";

export default function DosenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  useEffect(() => { setSearchQ(""); setSidebarOpen(false); }, [pathname]);
  const [modalSaved, setModalSaved] = useState(false);
  const [form, setForm] = useState({ title: "", course: "", type: "individu", deadline: "", description: "" });

  const COURSES = ["Analisis SI", "Keamanan Sistem", "SI Enterprise", "PPL"];

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.course || !form.deadline) return;
    const existing = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("dosen_new_tasks") || "[]" : "[]");
    const newTask = {
      id: `new-${Date.now()}`,
      title: form.title,
      course: form.course,
      type: form.type,
      deadline: form.deadline,
      status: "belum mulai",
      priority: "sedang",
      progress: 0,
      note: form.description,
      submissions: [],
    };
    localStorage.setItem("dosen_new_tasks", JSON.stringify([...existing, newTask]));
    setForm({ title: "", course: "", type: "individu", deadline: "", description: "" });
    setIsModalOpen(false);
    setModalSaved(true);
    setTimeout(() => setModalSaved(false), 3000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="min-h-screen flex bg-cream text-ink font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 min-[1400px]:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "w-[248px] flex-shrink-0 bg-paper border-r border-border flex flex-col fixed inset-y-0 left-0 z-40 shadow-[2px_0_16px_rgba(26,26,20,0.08)] transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full min-[1400px]:translate-x-0"
      )}>
        <div className="px-6 py-6 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-serif text-[20px] text-forest leading-none">📚 AcadTrack</div>
            <div className="text-[10px] text-muted tracking-[0.12em] uppercase mt-1">Portal Dosen</div>
          </div>
          <button className="min-[1400px]:hidden text-muted" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="text-[10px] text-muted tracking-[0.1em] uppercase px-2.5 mt-3.5 mb-1.5">Utama</div>
          <Link href="/dosen" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">⊞</span> Dashboard
          </Link>
          <Link href="/dosen/tugas" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/tugas" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/tugas" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📋</span> Manajemen Tugas
          </Link>
          <Link href="/dosen/rekap" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/rekap" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/rekap" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📊</span> Rekap Pengumpulan
            <span className="ml-auto bg-gold/15 text-gold text-[10px] font-bold py-[1px] px-1.5 rounded-full">3</span>
          </Link>
          <Link href="/dosen/mahasiswa" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/mahasiswa" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/mahasiswa" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">🎓</span> Data Mahasiswa
          </Link>
          <Link href="/dosen/kelompok" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/kelompok" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/kelompok" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">👥</span> Kelompok
          </Link>
          <Link href="/dosen/proyek" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/proyek" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/proyek" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">🗂</span> Tugas Kelompok
          </Link>

          <div className="text-[10px] text-muted tracking-[0.1em] uppercase px-2.5 mt-3.5 mb-1.5">Akademik</div>
          <Link href="/dosen/matakuliah" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/matakuliah" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/matakuliah" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📚</span> Mata Kuliah Saya
          </Link>
          <Link href="/dosen/laporan" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/laporan" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/laporan" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📈</span> Laporan & Ekspor
          </Link>
          <Link href="/dosen/notifikasi" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/notifikasi" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/notifikasi" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">🔔</span> Notifikasi
            <span className="ml-auto bg-rose text-white text-[10px] font-bold py-[1px] px-1.5 rounded-full">2</span>
          </Link>
          <Link href="/dosen/log" className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
            pathname === "/dosen/log" ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
          )}>
            {pathname === "/dosen/log" && <div className="absolute left-0 top-1/5 h-[60%] w-[3px] bg-forest rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📋</span> Log Aktivitas
          </Link>
        </nav>

        <div className="relative border-t border-border mt-auto">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-paper rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-border py-2 z-50">
              <button 
                onClick={(e) => { e.stopPropagation(); setTheme(isDark ? "light" : "dark"); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-cream transition-colors text-[14px] font-medium text-ink-2"
              >
                <div className={cn("w-10 h-[22px] rounded-full relative flex items-center transition-colors border", isDark ? "bg-blue-500 border-blue-500" : "bg-zinc-300 border-zinc-300")}>
                  <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute transition-all", isDark ? "right-1" : "left-1")} />
                </div>
                {isDark ? "Mode Gelap" : "Mode Terang"}
              </button>
              
              <div className="h-px bg-border my-1" />
              
              <Link href="/dosen/profil" onClick={() => setIsProfileOpen(false)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-cream transition-colors text-[14px] font-medium text-ink uppercase tracking-wider">
                <User size={18} className="text-ink" />
                DATA PRIBADI
              </Link>
              
              <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-rose/10 transition-colors text-[14px] font-medium text-red-500 uppercase tracking-wider">
                <LogOut size={18} className="text-red-500" />
                LOGOUT
              </button>
            </div>
          )}

          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="px-5 py-4 flex items-center gap-2.5 cursor-pointer hover:bg-cream transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-forest to-teal flex items-center justify-center text-[13px] font-bold text-white shrink-0">
              BS
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate text-ink">Dr. Budi Santoso</div>
              <div className="text-[11px] text-muted truncate">Dosen Tetap · NIP 19780501</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-[1400px]:ml-[248px] flex-1 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className="sticky top-0 z-10 bg-cream/95 backdrop-blur-md border-b-[1.5px] border-border px-4 min-[1400px]:px-8 py-3.5 flex items-center gap-3">
          <button className="min-[1400px]:hidden text-muted mr-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="font-serif text-[18px] flex-1 text-ink">
            {pathname === "/dosen" && <><span>Dashboard</span> <span className="text-forest">Semester Genap 2024/25</span></>}
            {pathname === "/dosen/tugas" && <><span>Manajemen</span> <span className="text-forest">Tugas</span></>}
            {pathname === "/dosen/rekap" && <><span>Rekap</span> <span className="text-forest">Pengumpulan</span></>}
            {pathname === "/dosen/mahasiswa" && <><span>Data</span> <span className="text-forest">Mahasiswa</span></>}
            {pathname === "/dosen/matakuliah" && <><span>Mata Kuliah</span> <span className="text-forest">yang Diampu</span></>}
            {pathname === "/dosen/laporan" && <><span>Laporan &amp;</span> <span className="text-forest">Ekspor</span></>}
            {pathname === "/dosen/notifikasi" && <><span>Notifikasi</span> <span className="text-forest">Dosen</span></>}
            {pathname === "/dosen/log" && <><span>Log</span> <span className="text-forest">Aktivitas</span></>}
            {pathname === "/dosen/kelompok" && <><span>Manajemen</span> <span className="text-forest">Kelompok</span></>}
            {pathname === "/dosen/proyek" && <><span>Tugas</span> <span className="text-forest">Kelompok</span></>}
            {pathname === "/dosen/profil" && <><span>Data</span> <span className="text-forest">Pribadi</span></>}
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={
                pathname.includes("kelompok")  ? "Cari kelompok, anggota…" :
                pathname.includes("tugas")     ? "Cari judul tugas…" :
                pathname.includes("mahasiswa") ? "Cari nama, NIM…" :
                pathname.includes("rekap")     ? "Cari nama mahasiswa…" :
                "Cari mahasiswa, tugas…"
              }
              className="bg-paper border-[1.5px] border-border text-ink pl-[34px] pr-3.5 py-1.5 rounded-lg text-[13px] w-[200px] outline-none focus:border-forest transition-colors"
            />
          </div>
          
          <button className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📥 Unduh Rekap
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-forest text-white hover:bg-forest-2 hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(45,90,61,0.25)] px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            + Buat Tugas
          </button>

        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 animate-fadeIn">
          <SearchContext.Provider value={searchQ}>
          {modalSaved && (
            <div className="fixed top-5 right-5 z-[200] flex items-center gap-2.5 bg-paper border border-forest/30 text-forest px-4 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-[13.5px] font-medium animate-fadeIn">
              <CheckCircle size={16} />
              Tugas baru berhasil dibuat!
            </div>
          )}
          {children}
          </SearchContext.Provider>
        </div>
      </main>

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-paper border border-border rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-lg animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-serif text-[18px] text-ink">Buat Tugas Baru</h2>
                <div className="text-[12px] text-muted mt-0.5">Tugas akan langsung tampil di halaman Manajemen Tugas</div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateTask} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Judul Tugas <span className="text-rose">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({...f, title: e.target.value}))}
                  placeholder="cth. Laporan Analisis Kebutuhan Sistem"
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Mata Kuliah <span className="text-rose">*</span></label>
                  <select
                    value={form.course}
                    onChange={e => setForm(f => ({...f, course: e.target.value}))}
                    className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                    required
                  >
                    <option value="">Pilih Mata Kuliah</option>
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Jenis Tugas</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({...f, type: e.target.value}))}
                    className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                  >
                    <option value="individu">Individu</option>
                    <option value="kelompok">Kelompok</option>
                    <option value="proyek">Proyek</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Deadline <span className="text-rose">*</span></label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm(f => ({...f, deadline: e.target.value}))}
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Deskripsi / Catatan</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  placeholder="Instruksi tugas, rubrik penilaian, dsb."
                  rows={3}
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border-[1.5px] border-border text-muted hover:text-ink hover:border-ink/30 py-2 rounded-lg text-[13px] font-semibold transition-all">
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-forest text-white hover:bg-forest-2 py-2 rounded-lg text-[13px] font-semibold transition-all hover:shadow-[0_4px_14px_rgba(45,90,61,0.25)]">
                  Buat Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
