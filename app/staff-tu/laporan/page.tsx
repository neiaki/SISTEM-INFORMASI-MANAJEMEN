"use client";

import useSWR from "swr";
import { exportToCSV, printAsPDF } from "@/lib/exportUtils";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function StaffTULaporanPage() {
  const { data: apiData } = useSWR('/api/staff-tu/laporan', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (!apiData) {
    return <div className="flex h-[400px] items-center justify-center text-stu-muted">Memuat data laporan...</div>;
  }

  const { stats, tasks = [], report } = apiData;

  const handleExportCSV = () => {
    const rows = tasks.map((t: any) => ({
      "Judul": t.title,
      "Kategori": t.course,
      "Status": t.status,
      "Prioritas": t.priority,
      "Progres (%)": t.progress,
      "Deadline": t.deadline,
    }));
    exportToCSV(rows, "laporan-staff-tu.csv");
  };

  const totalDone = tasks.filter((t: any) => t.status === "selesai").length;
  const totalActive = tasks.filter((t: any) => t.status !== "selesai").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] text-stu-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[22px] text-stu-text">
            Laporan <span className="text-stu-accent">Layanan TU</span>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={handleExportCSV} className="bg-stu-surface text-stu-muted border border-stu-border hover:text-stu-text px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📊 Ekspor CSV
          </button>
          <button onClick={printAsPDF} className="bg-stu-surface text-stu-muted border border-stu-border hover:text-stu-text px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📄 Ekspor PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: "✅", label: "Selesai", value: totalDone, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
          { icon: "⏳", label: "Berjalan", value: totalActive, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
          { icon: "🎓", label: "Kelas Diproses", value: stats.totalKelas || 0, color: "bg-stu-accent/10 text-stu-accent" },
          { icon: "🔄", label: "Mahasiswa Aktif", value: stats.totalMahasiswa || 0, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
        ].map((card, i) => (
          <div key={i} className="bg-stu-surface border border-stu-border rounded-xl p-5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-3 ${card.color}`}>{card.icon}</div>
            <div className="font-serif text-[30px] leading-none text-stu-text">{card.value}</div>
            <div className="text-[12px] text-stu-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-stu-surface border border-stu-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-stu-text mb-5">📊 Aktivitas per Minggu</h3>
        <div className="flex items-end gap-3 h-[100px]">
          {report.weekly.map((w: any, i: number) => {
            const max = Math.max(...report.weekly.map((x: any) => x.done));
            const h = max > 0 ? (w.done / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-mono text-stu-accent">{w.done}</span>
                <div className="w-full rounded-t-md bg-stu-accent/70 min-h-[4px]" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-stu-muted">{w.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-stu-surface border border-stu-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-stu-text mb-4">🎯 Target KPI Layanan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {report.kpis.map((kpi: any, i: number) => (
            <div key={i} className="bg-stu-card border border-stu-border rounded-xl p-4">
              <div className="text-[13px] font-semibold text-stu-text mb-1">{kpi.title}</div>
              <div className="text-[12px] text-stu-muted leading-relaxed">{kpi.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
