"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getAllTaskData,
  seedDummyComments,
  seedDummySubmissions,
  type Submission,
} from "@/lib/taskStore";

type RecentSub = Submission & { taskTitle: string; taskCourse: string };
type Tab = "dashboard" | "tugas" | "rekap" | "mahasiswa" | "kelompok" | "laporan";

function relTime(ms?: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

const AVATAR_COLORS = [
  "bg-[#166534]/10 text-[#166534]",
  "bg-teal-600/10 text-teal-700",
  "bg-amber-500/10 text-amber-600",
  "bg-rose-500/10 text-rose-600",
  "bg-violet-600/10 text-violet-700",
];
function avatarColor(name: string) {
  return AVATAR_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
}

const NAV = [
  { key: "dashboard", icon: "⊞", label: "Dashboard" },
  { key: "tugas",     icon: "📋", label: "Manajemen Tugas" },
  { key: "rekap",     icon: "📊", label: "Rekap Pengumpulan", badge: "3" },
  { key: "mahasiswa", icon: "🎓", label: "Data Mahasiswa" },
  { key: "kelompok",  icon: "👥", label: "Kelompok" },
  { key: "laporan",   icon: "📈", label: "Laporan & Ekspor" },
];

const TUGAS_ROWS = [
  { nama: "Laporan Praktikum Sorting", matkul: "Pemrog. Lanjut", color: "text-rose-600 bg-rose-50", terkumpul: 45, total: 48, pct: 93, deadline: "08 Apr (Besok)", deadCls: "bg-rose-50 text-rose-600" },
  { nama: "ERD Sistem Perpustakaan",   matkul: "Basis Data",     color: "text-teal-700 bg-teal-50", terkumpul: 12, total: 15, pct: 80, deadline: "09 Apr",          deadCls: "bg-amber-50 text-amber-600" },
  { nama: "Resume Sistem Operasi Bab 4", matkul: "Sistem Operasi", color: "text-amber-600 bg-amber-50", terkumpul: 20, total: 60, pct: 33, deadline: "11 Apr",      deadCls: "bg-[#dcfce7] text-[#166534]" },
  { nama: "Analisis Kebutuhan Sistem", matkul: "Analisis SI",    color: "text-violet-700 bg-violet-50", terkumpul: 38, total: 45, pct: 84, deadline: "15 Apr",      deadCls: "bg-[#dcfce7] text-[#166534]" },
  { nama: "UTS Pemrograman Web",       matkul: "Pemweb",         color: "text-blue-700 bg-blue-50",  terkumpul: 55, total: 60, pct: 91, deadline: "18 Apr",         deadCls: "bg-[#dcfce7] text-[#166534]" },
];

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [recentSubs, setRecentSubs] = useState<RecentSub[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    seedDummyComments();
    seedDummySubmissions();
    const store = getAllTaskData();
    const all: RecentSub[] = [];
    for (const entry of Object.values(store)) {
      for (const sub of entry.submissions) {
        if (sub.submittedBy) all.push({ ...sub, taskTitle: entry.taskTitle, taskCourse: entry.taskCourse });
      }
    }
    all.sort((a, b) => (b.submittedAtMs ?? 0) - (a.submittedAtMs ?? 0));
    setRecentSubs(all.slice(0, 5));
  }, []);

  const filtered = TUGAS_ROWS.filter(
    (r) => r.nama.toLowerCase().includes(search.toLowerCase()) || r.matkul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-cream text-ink font-sans overflow-hidden" style={{ minWidth: 960 }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[210px] flex-shrink-0 bg-paper border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="font-serif text-[18px] text-forest leading-none">📚 AcadTrack</div>
          <div className="text-[9px] text-muted tracking-[0.12em] uppercase mt-1">Portal Dosen</div>
        </div>

        <nav className="flex-1 py-3 px-2.5 overflow-y-auto">
          <div className="text-[9.5px] text-muted tracking-[0.1em] uppercase px-2.5 mb-2 mt-1">Utama</div>
          {NAV.map((item) => {
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key as Tab)}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-all w-full text-left mb-0.5 relative",
                  isActive ? "bg-forest/10 text-forest font-semibold" : "text-muted hover:bg-cream hover:text-ink"
                )}
              >
                {isActive && <div className="absolute left-0 top-1/4 h-[50%] w-[3px] bg-forest rounded-r-sm" />}
                <span className="text-[14px] w-4.5 text-center shrink-0">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-amber-500/15 text-amber-600 text-[9.5px] font-bold py-px px-1.5 rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border px-4 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d5a3d] to-[#0d9488] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            BS
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-ink truncate">Dr. Budi Santoso</div>
            <div className="text-[10px] text-muted">Dosen Tetap · NIP 19780501</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-cream/95 backdrop-blur border-b border-border px-6 py-3 flex items-center gap-3 shrink-0">
          <div className="font-serif text-[16px] flex-1 text-ink">
            {tab === "dashboard" && <><span>Dashboard</span> <span className="text-forest"> Semester Genap 2024/25</span></>}
            {tab === "tugas"     && <><span>Manajemen</span> <span className="text-forest"> Tugas</span></>}
            {tab === "rekap"     && <><span>Rekap</span>     <span className="text-forest"> Pengumpulan</span></>}
            {tab === "mahasiswa" && <><span>Data</span>      <span className="text-forest"> Mahasiswa</span></>}
            {tab === "kelompok"  && <><span>Manajemen</span> <span className="text-forest"> Kelompok</span></>}
            {tab === "laporan"   && <><span>Laporan &amp;</span>  <span className="text-forest"> Ekspor</span></>}
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-[13px]">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "rekap" ? "Cari nama mahasiswa…" : "Cari tugas, mahasiswa…"}
              className="bg-paper border border-border text-ink pl-7 pr-3 py-1.5 rounded-lg text-[12px] w-[180px] outline-none focus:border-forest transition-colors"
            />
          </div>
          <button className="bg-paper text-ink-2 border border-border hover:text-forest hover:border-forest px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all">
            📥 Unduh Rekap
          </button>
          <button className="bg-forest text-white hover:opacity-90 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all">
            + Buat Tugas
          </button>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-5">

          {/* ── DASHBOARD TAB ── */}
          {(tab === "dashboard" || tab === "mahasiswa" || tab === "kelompok" || tab === "laporan") && (
            <div className="flex flex-col gap-4">

              {/* Alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-[12.5px] text-amber-800 flex items-center gap-2.5">
                <span className="text-base">📬</span>
                <span className="flex-1">
                  Terdapat <strong className="text-amber-600 font-semibold">{recentSubs.length} tugas</strong> yang baru dikumpulkan dan menunggu review.
                </span>
                <button onClick={() => setTab("rekap")} className="bg-white text-amber-700 border border-amber-300 hover:border-amber-500 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all shrink-0">
                  Lihat Sekarang
                </button>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: "📋", val: "24", label: "Total Tugas Aktif",       note: "↑ 4 tugas baru bulan ini",    noteCls: "text-[#166534]" },
                  { icon: "📥", val: "187", label: "Pengumpulan Diterima",   note: "dari 240 total mahasiswa",    noteCls: "text-[#166534]" },
                  { icon: "⏰", val: "12",  label: "Belum Dikumpulkan",      note: "deadline ≤ 3 hari",           noteCls: "text-rose-600" },
                  { icon: "🎓", val: "4",   label: "Mata Kuliah Diampu",     note: "240 mahasiswa total",         noteCls: "text-[#166534]" },
                ].map((c) => (
                  <div key={c.label} className="bg-paper border border-border rounded-xl p-4 hover:-translate-y-[2px] hover:shadow-md transition-all cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center text-base mb-2.5">{c.icon}</div>
                    <div className="font-serif text-[30px] leading-none text-ink">{c.val}</div>
                    <div className="text-[11px] text-muted mt-0.5">{c.label}</div>
                    <div className={cn("text-[10.5px] mt-2 font-medium", c.noteCls)}>{c.note}</div>
                  </div>
                ))}
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-[1fr_280px] gap-4">
                {/* Left */}
                <div className="space-y-4">
                  {/* Table */}
                  <div className="bg-paper border border-border rounded-[12px] p-4 shadow-sm">
                    <div className="flex items-center mb-3">
                      <h3 className="text-[13px] font-semibold text-ink flex-1">📋 Daftar Tugas Berjalan</h3>
                      <button onClick={() => setTab("tugas")} className="text-[11px] text-forest hover:underline">Lihat semua →</button>
                    </div>
                    <table className="w-full text-[12px] border-collapse">
                      <thead>
                        <tr>
                          {["Nama Tugas", "Mata Kuliah", "Terkumpul", "Deadline"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border bg-cream/60">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TUGAS_ROWS.slice(0, 3).map((row) => (
                          <tr key={row.nama} className="hover:bg-forest/5 border-b border-border/60 cursor-pointer" onClick={() => setTab("tugas")}>
                            <td className="py-2.5 px-3 text-ink-2 font-medium">{row.nama}</td>
                            <td className="py-2.5 px-3"><span className={cn("inline-block text-[10px] font-semibold py-0.5 px-2 rounded-full", row.color)}>{row.matkul}</span></td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-ink-2">{row.terkumpul}/{row.total}</span>
                                <div className="w-12 h-1.5 bg-cream-2 rounded-full overflow-hidden">
                                  <div className="h-full bg-forest rounded-full" style={{ width: `${row.pct}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3"><span className={cn("inline-block text-[10px] font-semibold py-0.5 px-2 rounded-full whitespace-nowrap", row.deadCls)}>{row.deadline}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bar chart */}
                  <div className="bg-paper border border-border rounded-[12px] p-4 shadow-sm">
                    <div className="flex items-center mb-4">
                      <h3 className="text-[13px] font-semibold text-ink flex-1">📊 Pengumpulan per Minggu</h3>
                      <span className="text-[10.5px] text-muted">Mar – Apr 2026</span>
                    </div>
                    <div className="flex items-end gap-2 h-[90px] border-b border-border/60 mb-2.5">
                      {[
                        { val: 42, h: 55, color: "bg-forest opacity-60", label: "W1 Mar" },
                        { val: 67, h: 78, color: "bg-forest opacity-75", label: "W2 Mar" },
                        { val: 51, h: 62, color: "bg-forest opacity-65", label: "W3 Mar" },
                        { val: 88, h: 100, color: "bg-forest",           label: "W4 Mar" },
                        { val: 27, h: 33, color: "bg-amber-500",         label: "W1 Apr", current: true },
                      ].map((b, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                          <span className={cn("text-[10px] font-mono", b.current ? "text-amber-600 font-semibold" : "text-ink-2")}>{b.val}</span>
                          <div className={cn("w-full rounded-t-[4px] transition-all", b.color)} style={{ height: `${b.h}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {["W1 Mar", "W2 Mar", "W3 Mar", "W4 Mar", "W1 Apr ←"].map((l, i) => (
                        <div key={i} className={cn("flex-1 text-center text-[9.5px]", i === 4 ? "text-amber-600 font-semibold" : "text-muted")}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-4">
                  {/* Jadwal */}
                  <div className="bg-paper border border-border rounded-[12px] p-4 shadow-sm">
                    <h3 className="text-[13px] font-semibold text-ink mb-3">⏰ Jadwal Terdekat</h3>
                    <div className="space-y-2.5">
                      {[
                        { day: "08", mon: "Apr", title: "Batas Sorting",  sub: "Pemrograman Lanjut", cls: "bg-rose-50 border-rose-200 text-rose-600" },
                        { day: "09", mon: "Apr", title: "Batas ERD",      sub: "Basis Data",         cls: "bg-cream border-border text-ink" },
                        { day: "14", mon: "Apr", title: "Presentasi Akhir", sub: "Sistem Operasi",   cls: "bg-cream border-border text-ink" },
                      ].map((e) => (
                        <div key={e.day + e.title} className="flex items-start gap-2.5 pb-2.5 border-b border-border last:border-0 last:pb-0">
                          <div className={cn("w-9 text-center border rounded-lg py-0.5 shrink-0", e.cls)}>
                            <div className="font-serif text-[15px] leading-none">{e.day}</div>
                            <div className="text-[8.5px] muted uppercase tracking-wider">{e.mon}</div>
                          </div>
                          <div className="pt-0.5">
                            <div className="text-[12px] font-medium text-ink">{e.title}</div>
                            <div className="text-[10px] text-muted">{e.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent submissions */}
                  <div className="bg-paper border border-border rounded-[12px] p-4 shadow-sm">
                    <div className="flex items-center mb-3">
                      <h3 className="text-[13px] font-semibold text-ink flex-1">🔔 Baru Dikumpulkan</h3>
                      {recentSubs.length > 0 && (
                        <span className="text-[9.5px] font-semibold bg-forest/10 text-forest px-2 py-0.5 rounded-full">{recentSubs.length}</span>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      {(recentSubs.length > 0 ? recentSubs : [
                        { id: "1", submittedBy: "Febiyanto Rizki Qurbandi",  taskTitle: "Laporan Sorting",  submittedAtMs: Date.now() - 1800000, taskCourse: "" },
                        { id: "2", submittedBy: "Andra Rafi Irgi", taskTitle: "ERD Perpustakaan", submittedAtMs: Date.now() - 7200000, taskCourse: "" },
                        { id: "3", submittedBy: "Bagus Icha",     taskTitle: "Resume SO Bab 4", submittedAtMs: Date.now() - 86400000, taskCourse: "" },
                      ] as RecentSub[]).slice(0, 3).map((sub, i, arr) => (
                        <div key={sub.id} className={cn("flex items-center gap-2.5", i < arr.length - 1 ? "pb-2.5 border-b border-border" : "")}>
                          <div className={cn("w-7 h-7 rounded-lg font-bold flex items-center justify-center text-[10px] shrink-0", avatarColor(sub.submittedBy ?? ""))}>
                            {initials(sub.submittedBy ?? "?")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium text-ink truncate">{sub.submittedBy}</div>
                            <div className="text-[10px] text-muted truncate">{sub.taskTitle}</div>
                          </div>
                          <div className="text-[9.5px] text-muted bg-cream px-1.5 py-0.5 rounded shrink-0">{relTime(sub.submittedAtMs)}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setTab("rekap")} className="block w-full mt-3 py-1.5 text-[11.5px] font-semibold text-forest border border-forest/30 rounded-lg hover:bg-forest/5 transition-colors text-center">
                      Lihat Semua Pengumpulan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TUGAS TAB ── */}
          {tab === "tugas" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {["Semua", "Aktif", "Selesai"].map((f) => (
                    <button key={f} className={cn("px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all border", f === "Semua" ? "bg-forest text-white border-forest" : "bg-paper text-muted border-border hover:text-ink")}>{f}</button>
                  ))}
                </div>
                <div className="ml-auto flex gap-2">
                  <select className="bg-paper border border-border text-ink text-[12px] px-3 py-1.5 rounded-lg outline-none">
                    <option>Semua Matkul</option>
                    {["Pemrog. Lanjut", "Basis Data", "Sistem Operasi", "Analisis SI", "Pemweb"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <button className="bg-forest text-white hover:opacity-90 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold">+ Buat Tugas</button>
                </div>
              </div>

              <div className="bg-paper border border-border rounded-[12px] overflow-hidden shadow-sm">
                <table className="w-full text-[12.5px] border-collapse">
                  <thead>
                    <tr>
                      {["Nama Tugas", "Mata Kuliah", "Terkumpul", "Deadline", "Aksi"].map((h) => (
                        <th key={h} className="text-left py-2.5 px-4 text-[10.5px] font-semibold text-muted uppercase tracking-wider border-b border-border bg-cream/70">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.nama} className="hover:bg-forest/5 border-b border-border/60 cursor-pointer transition-colors" onClick={() => setTab("rekap")}>
                        <td className="py-3 px-4 text-ink font-medium">{row.nama}</td>
                        <td className="py-3 px-4"><span className={cn("inline-block text-[10.5px] font-semibold py-0.5 px-2 rounded-full", row.color)}>{row.matkul}</span></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11.5px] text-ink-2">{row.terkumpul}/{row.total}</span>
                            <div className="w-14 h-1.5 bg-cream-2 rounded-full overflow-hidden">
                              <div className="h-full bg-forest rounded-full" style={{ width: `${row.pct}%` }} />
                            </div>
                            <span className="text-[10px] text-muted">{row.pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4"><span className={cn("inline-block text-[10.5px] font-semibold py-0.5 px-2 rounded-full whitespace-nowrap", row.deadCls)}>{row.deadline}</span></td>
                        <td className="py-3 px-4">
                          <button onClick={(e) => { e.stopPropagation(); setTab("rekap"); }} className="text-[11px] font-semibold text-forest hover:underline">Lihat Rekap</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-10 text-muted text-[13px]">Tidak ada tugas yang cocok.</div>
                )}
              </div>
            </div>
          )}

          {/* ── REKAP TAB ── */}
          {tab === "rekap" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sudah Kumpul", val: "18", cls: "text-[#166534]", bg: "bg-[#dcfce7]" },
                  { label: "Belum Kumpul", val: "6",  cls: "text-rose-600",  bg: "bg-rose-50" },
                  { label: "Total",        val: "24", cls: "text-ink",       bg: "bg-cream" },
                ].map((c) => (
                  <div key={c.label} className={cn("rounded-xl p-4 text-center border border-border", c.bg)}>
                    <div className={cn("text-[28px] font-serif font-bold", c.cls)}>{c.val}</div>
                    <div className="text-[11px] text-muted mt-0.5">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-paper border border-border rounded-[12px] overflow-hidden shadow-sm">
                <div className="flex items-center px-4 py-3 border-b border-border bg-cream/50">
                  <h3 className="text-[13px] font-semibold text-ink flex-1">Daftar Mahasiswa — Laporan Praktikum Sorting</h3>
                  <select className="bg-paper border border-border text-ink text-[11.5px] px-2.5 py-1 rounded-lg outline-none">
                    <option>Laporan Praktikum Sorting</option>
                    {TUGAS_ROWS.slice(1).map((r) => <option key={r.nama}>{r.nama}</option>)}
                  </select>
                </div>
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr>
                      {["Mahasiswa", "NIM", "Status", "Waktu Kumpul", "File", "Komentar"].map((h) => (
                        <th key={h} className="text-left py-2 px-4 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border bg-cream/60">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nim: "231011450284", nama: "Febiyanto Rizki Qurbandi",       status: true,  time: "08 Apr, 09:41", file: "laporan_eki.pdf",  kom: 1 },
                      { nim: "231011450403", nama: "Andra Rafi Irgi",     status: true,  time: "08 Apr, 10:15", file: "tugas_andra.docx", kom: 0 },
                      { nim: "231011400651", nama: "Bagus Icha Saputra",  status: true,  time: "08 Apr, 11:02", file: "bagus_lap.pdf",    kom: 2 },
                      { nim: "231011450136", nama: "Fahriz Rifky",        status: false, time: "—",            file: "—",               kom: 0 },
                      { nim: "231011450646", nama: "Muhammad Ardiansyah", status: true,  time: "08 Apr, 14:30", file: "muh_sorting.pdf", kom: 1 },
                      { nim: "221011450203", nama: "Siti Rahayu",         status: false, time: "—",            file: "—",               kom: 0 },
                    ].filter((r) => !search || r.nama.toLowerCase().includes(search.toLowerCase()) || r.nim.includes(search))
                      .map((r) => (
                      <tr key={r.nim} className="hover:bg-forest/5 border-b border-border/60 cursor-pointer transition-colors">
                        <td className="py-2.5 px-4 font-medium text-ink">{r.nama}</td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-muted">{r.nim}</td>
                        <td className="py-2.5 px-4">
                          <span className={cn("inline-block text-[10.5px] font-semibold py-0.5 px-2 rounded-full", r.status ? "bg-[#dcfce7] text-[#166534]" : "bg-rose-50 text-rose-600")}>
                            {r.status ? "Dikumpulkan" : "Belum Kumpul"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-muted text-[11px]">{r.time}</td>
                        <td className="py-2.5 px-4 text-[11px]">
                          {r.file !== "—" ? <span className="text-forest hover:underline cursor-pointer">📎 {r.file}</span> : <span className="text-muted">—</span>}
                        </td>
                        <td className="py-2.5 px-4 text-[11px]">
                          {r.kom > 0 ? <span className="text-forest font-semibold">{r.kom} komentar</span> : <button className="text-muted hover:text-forest transition-colors">+ Beri komentar</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
