"use client";

import useSWR from "swr";
import { exportToCSV, printAsPDF } from "@/lib/exportUtils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MK_COLORS = [
  { bg: "bg-mhs-rose/10 text-mhs-rose", bar: "from-mhs-rose to-[#e74c3c]" },
  { bg: "bg-mhs-teal/10 text-mhs-teal", bar: "from-mhs-teal to-[#67e8f9]" },
  { bg: "bg-mhs-purple/10 text-mhs-purple", bar: "from-mhs-purple to-[#c4b5fd]" },
  { bg: "bg-mhs-amber/10 text-mhs-amber", bar: "from-mhs-amber to-mhs-amber-2" },
  { bg: "bg-mhs-green/10 text-mhs-green", bar: "from-mhs-green to-[#86efac]" },
];

const BAR_COLORS = ["bg-mhs-teal/70", "bg-mhs-teal", "bg-mhs-amber", "bg-mhs-teal/60"];

// Removed static stat calculations because we are fetching from the server

export default function LaporanPage() {
  const { data: apiData } = useSWR('/api/laporan', fetcher);

  const handleExportCSV = () => {
    // Implement standard CSV export based on SWR data
    alert("Export CSV not fully implemented in API version yet.");
  };

  if (!apiData) {
    return <div className="text-center py-10">Memuat laporan...</div>;
  }

  const { summary, courseStats, weekly } = apiData;
  const maxWeekly = Math.max(...weekly.map((w: any) => w.done));
  
  const totalNotStarted = summary.totalTasks - summary.totalDone - summary.totalMenungguReview - summary.totalActive;

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
          <div className="font-serif text-[32px] leading-none text-mhs-text">{summary.totalDone}<span className="text-[16px] text-mhs-muted ml-1">/ {summary.totalTasks}</span></div>
          <div className="text-[12px] text-mhs-muted mt-1">Total Tugas Selesai</div>
        </div>
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-amber opacity-10" />
          <div className="w-9 h-9 rounded-lg bg-mhs-amber/15 text-mhs-amber flex items-center justify-center text-lg mb-3.5">🏅</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">{summary.averageNilai}</div>
          <div className="text-[12px] text-mhs-muted mt-1">Rata-rata Nilai</div>
        </div>
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-teal opacity-10" />
          <div className="w-9 h-9 rounded-lg bg-mhs-teal/15 text-mhs-teal flex items-center justify-center text-lg mb-3.5">⏰</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">{summary.totalTasks > 0 ? Math.round(((summary.totalTasks - summary.totalLate) / summary.totalTasks) * 100) : 0}%</div>
          <div className="text-[12px] text-mhs-muted mt-1">Tepat Waktu</div>
          <div className="text-[11px] mt-2 text-mhs-muted">{summary.totalLate} terlambat · {summary.totalActive} berjalan</div>
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
            {weekly.map((w: any, i: number) => {
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
                strokeDasharray={`${summary.totalTasks > 0 ? (summary.totalDone / summary.totalTasks) * 100 : 0} ${summary.totalTasks > 0 ? 100 - (summary.totalDone / summary.totalTasks) * 100 : 100}`}
                strokeDashoffset="25" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--mhs-teal-rgb))" strokeWidth="4"
                strokeDasharray={`${summary.totalTasks > 0 ? (summary.totalActive / summary.totalTasks) * 100 : 0} 100`}
                strokeDashoffset={`${summary.totalTasks > 0 ? -((summary.totalDone / summary.totalTasks) * 100) + 25 : 25}`} />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--mhs-purple-rgb))" strokeWidth="4"
                strokeDasharray={`${summary.totalTasks > 0 ? (summary.totalMenungguReview / summary.totalTasks) * 100 : 0} 100`}
                strokeDashoffset={`${summary.totalTasks > 0 ? -(((summary.totalDone + summary.totalActive) / summary.totalTasks) * 100) + 25 : 25}`} />
            </svg>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                { label: "Selesai", count: summary.totalDone, color: "bg-mhs-green" },
                { label: "Dikerjakan", count: summary.totalActive, color: "bg-mhs-teal" },
                { label: "Review", count: summary.totalMenungguReview, color: "bg-mhs-purple" },
                { label: "Belum Mulai", count: Math.max(0, summary.totalTasks - summary.totalDone - summary.totalActive - summary.totalMenungguReview), color: "bg-mhs-muted" },
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
            {courseStats.map((stat: any, idx: number) => {
              const color = MK_COLORS[idx % MK_COLORS.length];
              return (
              <tr key={stat.course} className="border-t border-mhs-border/50 hover:bg-mhs-hover transition-colors">
                <td className="py-3 px-5">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${color.bg}`}>
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
                        className={`h-full bg-gradient-to-r ${color.bar} rounded-full`}
                        style={{ width: `${stat.pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-mhs-muted w-8 text-right">{stat.pct}%</span>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* GRAFIK PROGRES PER MATA KULIAH */}
      <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-mhs-text mb-5">📊 Grafik Nilai per Mata Kuliah</h3>
        <div className="flex flex-col gap-4">
          {courseStats.map((mk: any, idx: number) => {
            const barColor = MK_COLORS[idx % MK_COLORS.length].bg.split(' ')[0].replace('/10', '');
            return (
            <div key={mk.course}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[12px] font-medium text-mhs-text w-36 shrink-0">{mk.course}</span>
                <div className="flex-1 h-5 bg-mhs-border/50 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-700`}
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
          )})}
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
            {courseStats.map((mk: any) => {
              const selisih = mk.avg - mk.classAvg;
              const diAtas = selisih >= 0;
              return (
                <tr key={mk.course} className="border-t border-mhs-border/50 hover:bg-mhs-hover transition-colors">
                  <td className="py-3 px-5 font-medium text-mhs-text">{mk.course}</td>
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
          <div className="bg-mhs-surface/60 border border-mhs-border/60 rounded-xl p-4">
            <div className="text-[13px] font-semibold text-mhs-text mb-1">Target IPS 3.8+</div>
            <div className="text-[12px] text-mhs-muted leading-relaxed">Nilai rata-rata saat ini 82.4, setara dengan A-. Pertahankan progres!</div>
          </div>
          <div className="bg-mhs-surface/60 border border-mhs-border/60 rounded-xl p-4">
            <div className="text-[13px] font-semibold text-mhs-text mb-1">Kurangi Keterlambatan</div>
            <div className="text-[12px] text-mhs-muted leading-relaxed">Target: max 1 tugas terlambat per semester. Saat ini: 0.</div>
          </div>
          <div className="bg-mhs-surface/60 border border-mhs-border/60 rounded-xl p-4">
            <div className="text-[13px] font-semibold text-mhs-text mb-1">Aktif di Forum Review</div>
            <div className="text-[12px] text-mhs-muted leading-relaxed">Penyelesaian revisi dalam waktu 2x24 jam mencapai 100%.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
