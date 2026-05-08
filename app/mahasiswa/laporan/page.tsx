"use client";

import { createSeedData } from "@/data/sim-data";
import { exportToCSV, printAsPDF } from "@/lib/exportUtils";

const data = createSeedData().mahasiswa;

const MK_COLORS = [
  { bg: "bg-mhs-rose/10 text-mhs-rose", bar: "from-mhs-rose to-[#e74c3c]" },
  { bg: "bg-mhs-teal/10 text-mhs-teal", bar: "from-mhs-teal to-[#67e8f9]" },
  { bg: "bg-mhs-purple/10 text-mhs-purple", bar: "from-mhs-purple to-[#c4b5fd]" },
  { bg: "bg-mhs-amber/10 text-mhs-amber", bar: "from-mhs-amber to-mhs-amber-2" },
  { bg: "bg-mhs-green/10 text-mhs-green", bar: "from-mhs-green to-[#86efac]" },
];

const BAR_COLORS = ["bg-mhs-teal/70", "bg-mhs-teal", "bg-mhs-amber", "bg-mhs-teal/60"];

const totalDone = data.tasks.filter(t => t.status === "selesai").length;
const totalActive = data.tasks.filter(t => t.status !== "selesai").length;
const totalLate = data.tasks.filter(t => {
  const diff = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff < 0 && t.status !== "selesai";
}).length;
const avgProgress = Math.round(data.projects.reduce((a, p) => a + p.progress, 0) / data.projects.length);

const courses = [...new Set(data.tasks.map(t => t.course))];
const courseStats = courses.map((course, idx) => {
  const tasks = data.tasks.filter(t => t.course === course);
  const done = tasks.filter(t => t.status === "selesai").length;
  const running = tasks.filter(t => t.status !== "selesai").length;
  const late = tasks.filter(t => {
    const diff = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff < 0 && t.status !== "selesai";
  }).length;
  const pct = Math.round((done / tasks.length) * 100);
  return { course, total: tasks.length, done, running, late, pct, color: MK_COLORS[idx % MK_COLORS.length] };
});

const maxWeekly = Math.max(...data.report.weekly.map(w => w.done));

const MATKUL_DATA = [
  { name: "Analisis SI",    avg: 87, done: 10, total: 12, classAvg: 81, barColor: "bg-mhs-amber"  },
  { name: "Keamanan Sistem",avg: 74, done: 8,  total: 12, classAvg: 71, barColor: "bg-mhs-rose"   },
  { name: "SI Enterprise",  avg: 91, done: 11, total: 12, classAvg: 83, barColor: "bg-mhs-teal"   },
  { name: "PPL",            avg: 82, done: 9,  total: 12, classAvg: 79, barColor: "bg-mhs-green"  },
  { name: "IMK",            avg: 78, done: 8,  total: 11, classAvg: 75, barColor: "bg-mhs-purple" },
];

export default function LaporanPage() {
  const handleExportCSV = () => {
    const rows = data.tasks.map(t => ({
      "Judul Tugas": t.title,
      "Mata Kuliah": t.course,
      "Jenis": t.type,
      "Status": t.status,
      "Prioritas": t.priority,
      "Progres (%)": t.progress,
      "Deadline": t.deadline,
    }));
    exportToCSV(rows, "laporan-mahasiswa.csv");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[22px] text-mhs-text">Laporan & Statistik</div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={handleExportCSV} className="bg-mhs-card text-mhs-muted border border-mhs-border hover:text-mhs-text hover:border-mhs-muted px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📊 Ekspor Excel (CSV)
          </button>
          <button onClick={printAsPDF} className="bg-mhs-card text-mhs-muted border border-mhs-border hover:text-mhs-text hover:border-mhs-muted px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📄 Ekspor PDF
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-green opacity-10" />
          <div className="w-9 h-9 rounded-lg bg-mhs-green/15 text-mhs-green flex items-center justify-center text-lg mb-3.5">✅</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">{totalDone}<span className="text-[16px] text-mhs-muted ml-1">/ 59</span></div>
          <div className="text-[12px] text-mhs-muted mt-1">Total Tugas Selesai</div>
        </div>
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-amber opacity-10" />
          <div className="w-9 h-9 rounded-lg bg-mhs-amber/15 text-mhs-amber flex items-center justify-center text-lg mb-3.5">🏅</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">82.4</div>
          <div className="text-[12px] text-mhs-muted mt-1">Rata-rata Nilai</div>
          <div className="text-[11px] mt-2 text-mhs-teal">+1.2 dari semester lalu</div>
        </div>
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-teal opacity-10" />
          <div className="w-9 h-9 rounded-lg bg-mhs-teal/15 text-mhs-teal flex items-center justify-center text-lg mb-3.5">⏰</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">91%</div>
          <div className="text-[12px] text-mhs-muted mt-1">Tepat Waktu</div>
          <div className="text-[11px] mt-2 text-mhs-muted">{totalLate} terlambat · {totalActive} berjalan</div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-2 gap-4">
        {/* BAR CHART */}
        <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
          <div className="flex items-center mb-5">
            <h3 className="text-[14px] font-semibold text-mhs-text flex-1">📊 Tugas Selesai per Minggu</h3>
          </div>
          <div className="flex items-end gap-2 h-[100px]">
            {data.report.weekly.map((w, i) => {
              const heightPct = maxWeekly > 0 ? (w.done / maxWeekly) * 100 : 0;
              const isMax = w.done === maxWeekly;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className={`font-mono text-[11px] ${isMax ? "text-mhs-amber" : "text-mhs-muted"}`}>{w.done}</span>
                  <div
                    className={`w-full rounded-t-md ${isMax ? "bg-mhs-amber" : "bg-mhs-teal/70"} transition-all min-h-[4px]`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-mhs-muted">{w.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PIE / STATUS DISTRIBUTION */}
        <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
          <h3 className="text-[14px] font-semibold text-mhs-text mb-5">🥧 Distribusi Status Tugas</h3>
          <div className="flex gap-5 items-center">
            <svg width="100" height="100" viewBox="0 0 36 36" className="shrink-0">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--mhs-border-rgb))" strokeWidth="4"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--mhs-green-rgb))" strokeWidth="4"
                strokeDasharray={`${(totalDone / data.tasks.length) * 100} ${100 - (totalDone / data.tasks.length) * 100}`}
                strokeDashoffset="25" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--mhs-teal-rgb))" strokeWidth="4"
                strokeDasharray={`${(data.tasks.filter(t => t.status === "sedang dikerjakan").length / data.tasks.length) * 100} 100`}
                strokeDashoffset={`${-((totalDone / data.tasks.length) * 100) + 25}`} />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--mhs-purple-rgb))" strokeWidth="4"
                strokeDasharray={`${(data.tasks.filter(t => t.status === "menunggu review").length / data.tasks.length) * 100} 100`}
                strokeDashoffset={`${-((totalDone / data.tasks.length + data.tasks.filter(t => t.status === "sedang dikerjakan").length / data.tasks.length) * 100) + 25}`} />
            </svg>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                { label: "Selesai", count: totalDone, color: "bg-mhs-green" },
                { label: "Dikerjakan", count: data.tasks.filter(t => t.status === "sedang dikerjakan").length, color: "bg-mhs-teal" },
                { label: "Review", count: data.tasks.filter(t => t.status === "menunggu review").length, color: "bg-mhs-purple" },
                { label: "Belum Mulai", count: data.tasks.filter(t => t.status === "belum mulai").length, color: "bg-mhs-muted" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-[12px]">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="flex-1 text-mhs-muted">{item.label}</span>
                  <span className="font-mono text-mhs-text">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PER MATA KULIAH TABLE */}
      <div className="bg-mhs-card border border-mhs-border rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-mhs-border">
          <h3 className="text-[14px] font-semibold text-mhs-text">📚 Ringkasan per Mata Kuliah</h3>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] bg-mhs-surface/50">Mata Kuliah</th>
              <th className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] bg-mhs-surface/50">Total</th>
              <th className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] bg-mhs-surface/50">Selesai</th>
              <th className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] bg-mhs-surface/50">Berjalan</th>
              <th className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] bg-mhs-surface/50">Terlambat</th>
              <th className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] bg-mhs-surface/50 w-48">Progres</th>
            </tr>
          </thead>
          <tbody>
            {courseStats.map(stat => (
              <tr key={stat.course} className="border-t border-mhs-border/50 hover:bg-mhs-hover transition-colors">
                <td className="py-3 px-5">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${stat.color.bg}`}>
                    {stat.course}
                  </span>
                </td>
                <td className="py-3 px-5 text-mhs-text">{stat.total}</td>
                <td className="py-3 px-5 text-mhs-text">{stat.done}</td>
                <td className="py-3 px-5 text-mhs-text">{stat.running}</td>
                <td className="py-3 px-5 text-mhs-text">{stat.late}</td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-mhs-border rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.color.bar} rounded-full`}
                        style={{ width: `${stat.pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-mhs-muted w-8 text-right">{stat.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GRAFIK PROGRES PER MATA KULIAH */}
      <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-mhs-text mb-5">📊 Grafik Nilai per Mata Kuliah</h3>
        <div className="flex flex-col gap-4">
          {MATKUL_DATA.map(mk => (
            <div key={mk.name}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[12px] font-medium text-mhs-text w-36 shrink-0">{mk.name}</span>
                <div className="flex-1 h-5 bg-mhs-border/50 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${mk.barColor} rounded-full transition-all duration-700`}
                    style={{ width: `${mk.avg}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white mix-blend-screen">
                    {mk.avg}
                  </span>
                </div>
                <span className="text-[13px] font-mono font-semibold text-mhs-text w-8 text-right">{mk.avg}</span>
              </div>
              <div className="ml-[156px] text-[10px] text-mhs-muted">{mk.done}/{mk.total} tugas selesai</div>
            </div>
          ))}
        </div>
      </div>

      {/* PERBANDINGAN DENGAN RATA-RATA KELAS */}
      <div className="bg-mhs-card border border-mhs-border rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-mhs-border">
          <h3 className="text-[14px] font-semibold text-mhs-text">🏆 Perbandingan dengan Rata-rata Kelas</h3>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-mhs-surface/50">
              {["Mata Kuliah", "Nilai Saya", "Rata-rata Kelas", "Selisih", "Status"].map(h => (
                <th key={h} className="text-left py-2.5 px-5 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] border-b border-mhs-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATKUL_DATA.map(mk => {
              const selisih = mk.avg - mk.classAvg;
              const diAtas = selisih >= 0;
              return (
                <tr key={mk.name} className="border-t border-mhs-border/50 hover:bg-mhs-hover transition-colors">
                  <td className="py-3 px-5 font-medium text-mhs-text">{mk.name}</td>
                  <td className="py-3 px-5 font-mono font-semibold text-mhs-text">{mk.avg}</td>
                  <td className="py-3 px-5 font-mono text-mhs-muted">{mk.classAvg}</td>
                  <td className="py-3 px-5">
                    <span className={`font-mono font-semibold text-[13px] ${diAtas ? "text-mhs-teal" : "text-mhs-rose"}`}>
                      {diAtas ? "+" : ""}{selisih}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${diAtas ? "bg-mhs-teal/10 text-mhs-teal" : "bg-mhs-rose/10 text-mhs-rose"}`}>
                      {diAtas ? "Di Atas Rata-rata" : "Di Bawah Rata-rata"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* KPI */}
      <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-mhs-text mb-4">🎯 Target KPI Semester</h3>
        <div className="grid grid-cols-3 gap-4">
          {data.report.kpis.map((kpi, i) => (
            <div key={i} className="bg-mhs-surface/60 border border-mhs-border/60 rounded-xl p-4">
              <div className="text-[13px] font-semibold text-mhs-text mb-1">{kpi.title}</div>
              <div className="text-[12px] text-mhs-muted leading-relaxed">{kpi.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
