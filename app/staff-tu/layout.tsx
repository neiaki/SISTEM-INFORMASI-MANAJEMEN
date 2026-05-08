"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchContext } from "@/lib/search-context";

const NAV_ITEMS = [
  { href: "/staff-tu", label: "Dashboard", icon: "⊞", exact: true },
  { href: "/staff-tu/tugas", label: "Backlog Operator", icon: "📋" },
  { href: "/staff-tu/laporan", label: "Laporan Layanan", icon: "📊" },
  { href: "/staff-tu/notifikasi", label: "Notifikasi", icon: "🔔" },
  { href: "/staff-tu/profil", label: "Profil", icon: "👤" },
];

const PAGE_TITLES: Record<string, [string, string]> = {
  "/staff-tu": ["Dashboard", "Staff TU"],
  "/staff-tu/tugas": ["Backlog", "Operator"],
  "/staff-tu/laporan": ["Laporan", "Layanan TU"],
  "/staff-tu/notifikasi": ["Notifikasi &", "Antrean"],
  "/staff-tu/profil": ["Profil", "Staff TU"],
};

export default function StaffTULayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => { setSearchQ(""); setSidebarOpen(false); }, [pathname]);
  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const titles = PAGE_TITLES[pathname] ?? ["Staff", "TU"];

  return (
    <div className="min-h-screen flex bg-stu-bg text-stu-text font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 min-[1400px]:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "w-[248px] flex-shrink-0 bg-stu-surface border-r border-stu-border flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full min-[1400px]:translate-x-0"
      )}>
        <div className="px-6 py-6 border-b border-stu-border flex items-center justify-between">
          <div>
            <div className="font-serif text-[20px] text-stu-accent leading-none">📂 AcadTrack</div>
            <div className="text-[10px] text-stu-muted tracking-[0.12em] uppercase mt-1">Portal Staff TU</div>
          </div>
          <button className="min-[1400px]:hidden text-stu-muted" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="text-[10px] text-stu-muted tracking-[0.1em] uppercase px-2.5 mt-3 mb-1.5">Utama</div>
          {NAV_ITEMS.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
                  active ? "bg-stu-accent/10 text-stu-accent font-semibold" : "text-stu-muted hover:bg-stu-hover hover:text-stu-text"
                )}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-stu-accent rounded-r-sm" />}
                <span className="text-[16px] w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-stu-border mt-auto">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-stu-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-stu-border py-2 z-50">
              <button
                onClick={(e) => { e.stopPropagation(); setTheme(isDark ? "light" : "dark"); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-stu-hover transition-colors text-[14px] font-medium text-stu-text"
              >
                <div className={cn("w-10 h-[22px] rounded-full relative flex items-center transition-colors border", isDark ? "bg-stu-accent border-stu-accent" : "bg-zinc-300 border-zinc-300")}>
                  <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute transition-all", isDark ? "right-1" : "left-1")} />
                </div>
                {isDark ? "Mode Gelap" : "Mode Terang"}
              </button>
              <div className="h-px bg-stu-border my-1" />
              <Link href="/staff-tu/profil" onClick={() => setIsProfileOpen(false)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-stu-hover transition-colors text-[14px] font-medium text-stu-text uppercase tracking-wider">
                <User size={18} />
                DATA PRIBADI
              </Link>
              <button onClick={() => router.push("/auth/login")} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[14px] font-medium text-red-500 uppercase tracking-wider">
                <LogOut size={18} />
                LOGOUT
              </button>
            </div>
          )}
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="px-6 py-4 flex items-center gap-2.5 cursor-pointer hover:bg-stu-hover transition-colors">
            <div className="w-[34px] h-[34px] rounded-full bg-stu-accent/20 flex items-center justify-center text-[13px] font-bold text-stu-accent shrink-0">
              AY
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate text-stu-text">Ayu Kartika</div>
              <div className="text-[11px] text-stu-muted">Operator Akademik</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-[1400px]:ml-[248px] flex-1 flex flex-col min-h-screen bg-stu-bg">
        <header className="sticky top-0 z-10 bg-stu-bg/85 backdrop-blur-md border-b border-stu-border px-6 min-[1400px]:px-8 py-3.5 flex items-center gap-3">
          <button className="min-[1400px]:hidden text-stu-muted mr-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="font-serif text-xl flex-1 text-stu-text">
            <span>{titles[0]} </span>
            <span className="text-stu-accent">{titles[1]}</span>
          </div>
          <div className="relative hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stu-muted text-sm">🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Cari data, kelas…"
              className="bg-stu-card border border-stu-border text-stu-text pl-[34px] pr-3.5 py-1.5 rounded-lg text-[13px] w-[200px] outline-none focus:border-stu-accent transition-colors placeholder:text-stu-muted"
            />
          </div>
          <div className="text-[11px] bg-stu-accent/10 text-stu-accent font-semibold px-3 py-1 rounded-full border border-stu-accent/20">
            Staff TU
          </div>
        </header>

        <div className="p-6 min-[1400px]:p-8 animate-fadeIn">
          <SearchContext.Provider value={searchQ}>
            {children}
          </SearchContext.Provider>
        </div>
      </main>
    </div>
  );
}
