"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { exportToCSV, printAsPDF } from "@/lib/exportUtils";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getPillCls = (idx: number) => {
  const classes = [
    "bg-forest/10 text-forest",
    "bg-teal/10 text-teal",
    "bg-gold/15 text-gold",
    "bg-rose/10 text-rose"
  ];
  return classes[idx % classes.length];
};

const getBarCls = (idx: number) => {
  const classes = [
    "from-forest to-teal",
    "from-teal to-[#2a9d8f]",
    "from-gold to-[#f39c12]",
    "from-rose to-[#e74c3c]"
  ];
  return classes[idx % classes.length];
};

const getAvgCls = (idx: number) => {
  const classes = [
    "text-forest",
    "text-teal",
    "text-gold",
    "text-rose"
  ];
  return classes[idx % classes.length];
};

export default function DosenLaporanPage() {
  const { data, isLoading, error } = useSWR('/api/laporan', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted gap-3">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-[13px]">Memuat laporan...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-rose gap-3">
        <span className="text-[13px] font-medium">Gagal memuat laporan.</span>
      </div>
    );
  }

  const { summary, courseStats, weekly } = data;
  const maxWeekly = Math.max(...(weekly.map((w: any) => w.count) as number[]), 1);

  const handleExportExcel = () => {
    const rows = courseStats.map((g: any) => ({
      "Mata Kuliah": g.course,
      "Jumlah Mahasiswa": g.students,
      "Rata-rata Nilai": g.avg ?? "—",
      "Nilai Tertinggi": g.high ?? "—",
      "Nilai Terendah": g.low ?? "—",
      "Jumlah Lulus": g.pass ?? "—",
      "Persentase Lulus (%)": g.passP ?? "—",
      "Jumlah Tidak Lulus": g.fail ?? "—",
      "Persentase Tidak Lulus (%)": g.failP ?? "—",
    }));
    exportToCSV(rows, "laporan-dosen-kpi.csv");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[24px] text-ink">Laporan & Ekspor</div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📊 Ekspor Excel
          </button>
          <button onClick={printAsPDF} className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📄 Ekspor PDF
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Pengumpulan", val: summary.totalSubmissions, icon: "📬", accent: "text-forest", bg: "bg-forest/8" },
          { label: "Mahasiswa Terlambat", val: summary.totalLate || 0,   icon: "⚠️", accent: "text-rose",   bg: "bg-rose/8"   },
          { label: "Rata-rata Nilai",    val: summary.averageNilai, icon: "⭐", accent: "text-gold",   bg: "bg-gold/8"   },
          { label: "Tingkat Pengumpulan", val: summary.completionRate, icon: "✅", accent: "text-teal",  bg: "bg-teal/8"   },
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

      {/* CHARTS ROW */}
      <div className="grid grid-cols-2 gap-4">
        {/* BAR CHART */}
        <div className="bg-paper border-[1.5px] border-border rounded-[14px] p-5 shadow-[0_1px_6px_rgba(26,26,20,0.06)]">
          <h3 className="text-[14px] font-semibold text-ink mb-5">📊 Pengumpulan per Minggu</h3>
          <div className="flex items-end gap-3 h-[100px]">
            {weekly.map((w: any, i: number) => {
              const h = maxWeekly > 0 ? (w.count / maxWeekly) * 100 : 0;
              const isMax = w.count === maxWeekly;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className={`font-mono text-[11px] ${isMax ? "text-forest font-semibold" : "text-muted"}`}>{w.count}</span>
                  <div
                    className={`w-full rounded-t-md min-h-[4px] transition-all ${isMax ? "bg-gradient-to-b from-forest to-teal" : "bg-forest/30"}`}
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted">{w.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPLETION RATE BY COURSE */}
        <div className="bg-paper border-[1.5px] border-border rounded-[14px] p-5 shadow-[0_1px_6px_rgba(26,26,20,0.06)]">
          <h3 className="text-[14px] font-semibold text-ink mb-5">📈 Tingkat Kelulusan per MK</h3>
          <div className="flex flex-col gap-3.5">
            {courseStats.filter((g: any) => g.pass !== null).map((g: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${getPillCls(i)}`}>{g.course}</span>
                  <span className="font-mono text-muted">{g.passP}%</span>
                </div>
                <div className="w-full h-1.5 bg-cream-2 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getBarCls(i)} rounded-full`} style={{ width: `${g.passP}%` }} />
                </div>
              </div>
            ))}
            {courseStats.filter((g: any) => g.pass !== null).length === 0 && (
                <div className="text-[13px] text-muted text-center py-4">Belum ada mahasiswa yang dinilai.</div>
            )}
          </div>
        </div>
      </div>

      {/* GRADE TABLE */}
      <div className="bg-paper border-[1.5px] border-border rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-[14px] font-semibold text-ink">📊 Distribusi Nilai per Mata Kuliah</h3>
        </div>
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr>
              {["Mata Kuliah", "Mhs", "Rata-rata", "Tertinggi", "Terendah", "Lulus", "Tidak Lulus"].map(h => (
                <th key={h} className="text-left py-2.5 px-5 text-[11px] font-semibold text-muted uppercase tracking-[0.06em] bg-cream border-b-[1.5px] border-border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courseStats.map((g: any, i: number) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-forest/[0.03] transition-colors">
                <td className="py-3 px-5">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${getPillCls(i)}`}>{g.course}</span>
                </td>
                <td className="py-3 px-5 text-ink">{g.students}</td>
                <td className={`py-3 px-5 font-mono font-semibold ${g.avg !== null ? getAvgCls(i) : "text-muted"}`}>
                  {g.avg !== null ? g.avg : "—"}
                </td>
                <td className="py-3 px-5 font-mono text-[12px] text-muted">{g.high ?? "—"}</td>
                <td className="py-3 px-5 font-mono text-[12px] text-muted">{g.low ?? "—"}</td>
                <td className="py-3 px-5">
                  {g.pass !== null ? (
                    <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-forest/10 text-forest">{g.pass} ({g.passP}%)</span>
                  ) : (
                    <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-muted/10 text-muted">Belum Dinilai</span>
                  )}
                </td>
                <td className="py-3 px-5">
                  {g.fail !== null ? (
                    <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-rose/10 text-rose">{g.fail} ({g.failP}%)</span>
                  ) : (
                    <span className="text-muted text-[12px]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
