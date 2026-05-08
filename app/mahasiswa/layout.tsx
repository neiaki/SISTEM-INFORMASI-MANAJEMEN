"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchContext } from "@/lib/search-context";

export default function MahasiswaLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => { setSearchQ(""); setSidebarOpen(false); setIsProfileOpen(false); }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="min-h-screen flex bg-mhs-bg text-mhs-text font-sans selection:bg-mhs-amber/30">
      {/* SIDEBAR */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 min-[1400px]:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "w-[240px] flex-shrink-0 bg-mhs-surface border-r border-mhs-border flex flex-col fixed inset-y-0 left-0 z-40 py-7 transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full min-[1400px]:translate-x-0"
      )}>
        <div className="px-6 pb-7 border-b border-mhs-border flex items-center justify-between">
          <div>
            <div className="font-serif text-[22px] text-mhs-amber leading-none">📚 AcadTrack</div>
            <div className="text-[10px] text-mhs-muted tracking-[0.12em] uppercase mt-1">SIM Tugas & Proyek Kuliah</div>
          </div>
          <button className="min-[1400px]:hidden text-mhs-muted" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-5 px-3 overflow-y-auto">
          <div className="text-[10px] text-mhs-muted tracking-[0.1em] uppercase px-3 mt-4 mb-1.5">Utama</div>
          <Link href="/mahasiswa" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">⊞</span> Dashboard
          </Link>
          <Link href="/mahasiswa/tugas" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/tugas" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/tugas" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">☑</span> Manajemen Tugas
            <span className="ml-auto bg-mhs-danger text-white text-[10px] font-semibold py-[1px] px-1.5 rounded-full">5</span>
          </Link>
          <Link href="/mahasiswa/proyek" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/proyek" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/proyek" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">🗂</span> Tugas Kelompok
          </Link>
          <Link href="/mahasiswa/kelompok" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/kelompok" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/kelompok" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">👥</span> Kelompok
          </Link>
          <Link href="/mahasiswa/participant" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/participant" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/participant" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">🎓</span> Participant
          </Link>

          <div className="text-[10px] text-mhs-muted tracking-[0.1em] uppercase px-3 mt-4 mb-1.5">Lainnya</div>
          <Link href="/mahasiswa/kalender" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/kalender" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/kalender" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📅</span> Kalender
          </Link>
          <Link href="/mahasiswa/laporan" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/laporan" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/laporan" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📊</span> Laporan & Statistik
          </Link>
          <Link href="/mahasiswa/notifikasi" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/notifikasi" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/notifikasi" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">🔔</span> Notifikasi
            <span className="inline-block w-2 h-2 bg-mhs-rose rounded-full ml-auto animate-pulse"></span>
          </Link>
          <Link href="/mahasiswa/log" className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative group",
            pathname === "/mahasiswa/log" ? "bg-mhs-amber/10 text-mhs-amber" : "text-mhs-muted hover:bg-mhs-card hover:text-mhs-text"
          )}>
            {pathname === "/mahasiswa/log" && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-mhs-amber rounded-r-sm" />}
            <span className="text-[16px] w-5 text-center">📋</span> Log Aktivitas
          </Link>
        </nav>

        <div className="relative border-t border-mhs-border mt-auto">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-mhs-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-mhs-border py-2 z-50">
              <button 
                onClick={(e) => { e.stopPropagation(); setTheme(isDark ? "light" : "dark"); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-mhs-card transition-colors text-[14px] font-medium text-mhs-text"
              >
                <div className={cn("w-10 h-[22px] rounded-full relative flex items-center transition-colors border", isDark ? "bg-blue-500 border-blue-500" : "bg-zinc-300 border-zinc-300")}>
                  <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute transition-all", isDark ? "right-1" : "left-1")} />
                </div>
                {isDark ? "Mode Gelap" : "Mode Terang"}
              </button>
              
              <div className="h-px bg-mhs-border my-1" />
              
              <Link href="/mahasiswa/profil" onClick={() => setIsProfileOpen(false)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-mhs-card transition-colors text-[14px] font-medium text-mhs-text uppercase tracking-wider">
                <User size={18} className="text-mhs-text" />
                DATA PRIBADI
              </Link>
              
              <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-mhs-rose/10 transition-colors text-[14px] font-medium text-red-500 uppercase tracking-wider">
                <LogOut size={18} className="text-red-500" />
                LOGOUT
              </button>
            </div>
          )}

          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="px-6 py-4 flex items-center gap-2.5 cursor-pointer hover:bg-mhs-card transition-colors"
          >
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-mhs-amber to-mhs-purple flex items-center justify-center text-[13px] font-bold text-white shrink-0">
              EK
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate text-mhs-text">Eki Kurniawan</div>
              <div className="text-[11px] text-mhs-muted">NIM 2022001234</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-[1400px]:ml-[240px] flex-1 flex flex-col min-h-screen bg-mhs-bg">
        {/* TOPBAR */}
        <header className="sticky top-0 z-10 bg-mhs-bg/85 backdrop-blur-md border-b border-mhs-border px-4 min-[1400px]:px-8 py-3.5 flex items-center gap-3">
          <button className="min-[1400px]:hidden text-mhs-muted mr-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="font-serif text-xl flex-1 text-mhs-text">
            {pathname === "/mahasiswa" && <><span>Dashboard</span> <span className="text-mhs-amber">Semester Genap 2024/25</span></>}
            {pathname === "/mahasiswa/tugas" && <><span>Manajemen</span> <span className="text-mhs-amber">Tugas</span></>}
            {pathname === "/mahasiswa/proyek" && <><span>Tugas</span> <span className="text-mhs-amber">Kelompok</span></>}
            {pathname === "/mahasiswa/kelompok" && <><span>Data</span> <span className="text-mhs-amber">Kelompok</span></>}
            {pathname === "/mahasiswa/kalender" && <><span>Kalender</span> <span className="text-mhs-amber">Deadline</span></>}
            {pathname === "/mahasiswa/laporan" && <><span>Laporan &amp;</span> <span className="text-mhs-amber">Statistik</span></>}
            {pathname === "/mahasiswa/notifikasi" && <><span>Notifikasi &amp;</span> <span className="text-mhs-amber">Pengingat</span></>}
            {pathname === "/mahasiswa/profil" && <><span>Data</span> <span className="text-mhs-amber">Pribadi</span></>}
            {pathname === "/mahasiswa/participant" && <><span>Daftar</span> <span className="text-mhs-amber">Peserta</span></>}
            {pathname === "/mahasiswa/log" && <><span>Log</span> <span className="text-mhs-amber">Aktivitas</span></>}
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mhs-muted text-sm">🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={
                pathname.includes("kelompok") ? "Cari kelompok, anggota…" :
                pathname.includes("tugas")    ? "Cari tugas, mata kuliah…" :
                pathname.includes("proyek")   ? "Cari proyek, mata kuliah…" :
                pathname.includes("participant") ? "Cari nama, NIM…" :
                "Cari tugas, proyek…"
              }
              className="bg-mhs-card border border-mhs-border text-mhs-text pl-[34px] pr-3.5 py-1.5 rounded-lg text-[13px] w-[200px] outline-none focus:border-mhs-amber transition-colors"
            />
          </div>
          
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 animate-fadeIn">
          <SearchContext.Provider value={searchQ}>
            {children}
          </SearchContext.Provider>
        </div>
      </main>
    </div>
  );
}
