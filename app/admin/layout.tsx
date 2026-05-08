"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchContext } from "@/lib/search-context";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "⊞", exact: true },
  { href: "/admin/tugas", label: "Manajemen Tugas", icon: "📋" },
  { href: "/admin/laporan", label: "Laporan & KPI", icon: "📊" },
  { href: "/admin/notifikasi", label: "Notifikasi & Alert", icon: "🔔" },
  { href: "/admin/profil", label: "Profil Admin", icon: "👤" },
];

const PAGE_TITLES: Record<string, [string, string]> = {
  "/admin": ["Dashboard", "Admin Kampus"],
  "/admin/tugas": ["Manajemen", "Tugas Operasional"],
  "/admin/laporan": ["Laporan &", "KPI Sistem"],
  "/admin/notifikasi": ["Notifikasi &", "Alert Sistem"],
  "/admin/profil": ["Profil", "Admin"],
};

export default function AdminLayout({ children }: { children: ReactNode }) {
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
  const titles = PAGE_TITLES[pathname] ?? ["Admin", "Kampus"];

  return (
    <div className="min-h-screen flex bg-adm-bg text-adm-text font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 min-[1400px]:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "w-[248px] flex-shrink-0 bg-adm-surface border-r border-adm-border flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full min-[1400px]:translate-x-0"
      )}>
        <div className="px-6 py-6 border-b border-adm-border flex items-center justify-between">
          <div>
            <div className="font-serif text-[20px] text-adm-accent leading-none">🏛 AcadTrack</div>
            <div className="text-[10px] text-adm-muted tracking-[0.12em] uppercase mt-1">Portal Admin Kampus</div>
          </div>
          <button className="min-[1400px]:hidden text-adm-muted" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="text-[10px] text-adm-muted tracking-[0.1em] uppercase px-2.5 mt-3 mb-1.5">Utama</div>
          {NAV_ITEMS.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-all mb-0.5 relative",
                  active ? "bg-adm-accent/10 text-adm-accent font-semibold" : "text-adm-muted hover:bg-adm-hover hover:text-adm-text"
                )}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-adm-accent rounded-r-sm" />}
                <span className="text-[16px] w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-adm-border mt-auto">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-adm-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-adm-border py-2 z-50">
              <button
                onClick={(e) => { e.stopPropagation(); setTheme(isDark ? "light" : "dark"); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-adm-hover transition-colors text-[14px] font-medium text-adm-text"
              >
                <div className={cn("w-10 h-[22px] rounded-full relative flex items-center transition-colors border", isDark ? "bg-adm-accent border-adm-accent" : "bg-zinc-300 border-zinc-300")}>
                  <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute transition-all", isDark ? "right-1" : "left-1")} />
                </div>
                {isDark ? "Mode Gelap" : "Mode Terang"}
              </button>
              <div className="h-px bg-adm-border my-1" />
              <Link href="/admin/profil" onClick={() => setIsProfileOpen(false)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-adm-hover transition-colors text-[14px] font-medium text-adm-text uppercase tracking-wider">
                <User size={18} />
                DATA PRIBADI
              </Link>
              <button onClick={() => router.push("/auth/login")} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[14px] font-medium text-red-500 uppercase tracking-wider">
                <LogOut size={18} />
                LOGOUT
              </button>
            </div>
          )}
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="px-6 py-4 flex items-center gap-2.5 cursor-pointer hover:bg-adm-hover transition-colors">
            <div className="w-[34px] h-[34px] rounded-full bg-adm-accent/20 flex items-center justify-center text-[13px] font-bold text-adm-accent shrink-0">
              AK
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate text-adm-text">Admin Kampus</div>
              <div className="text-[11px] text-adm-muted">admin@unpam.ac.id</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-[1400px]:ml-[248px] flex-1 flex flex-col min-h-screen bg-adm-bg">
        <header className="sticky top-0 z-10 bg-adm-bg/85 backdrop-blur-md border-b border-adm-border px-6 min-[1400px]:px-8 py-3.5 flex items-center gap-3">
          <button className="min-[1400px]:hidden text-adm-muted mr-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="font-serif text-xl flex-1 text-adm-text">
            <span>{titles[0]} </span>
            <span className="text-adm-accent">{titles[1]}</span>
          </div>
          <div className="relative hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-adm-muted text-sm">🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Cari data, aktivitas…"
              className="bg-adm-card border border-adm-border text-adm-text pl-[34px] pr-3.5 py-1.5 rounded-lg text-[13px] w-[200px] outline-none focus:border-adm-accent transition-colors placeholder:text-adm-muted"
            />
          </div>
          <div className="text-[11px] bg-adm-accent/10 text-adm-accent font-semibold px-3 py-1 rounded-full border border-adm-accent/20">
            Admin Kampus
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
