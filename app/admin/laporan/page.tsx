"use client";

import useSWR from "swr";
import { exportToCSV, printAsPDF } from "@/lib/exportUtils";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminLaporanPage() {
  const { data: apiData } = useSWR('/api/admin/laporan', fetcher);

  if (!apiData) {
    return <div className="flex h-[400px] items-center justify-center text-adm-muted">Memuat data laporan...</div>;
  }

  const { tasks = [], integrations = [], report } = apiData;

  const totalDone = tasks.filter((t: any) => t.status === "selesai").length;
  const totalActive = tasks.filter((t: any) => t.status !== "selesai").length;

  const handleExportCSV = () => {
    const rows = tasks.map((t: any) => ({
      "Judul": t.title,
      "Kategori": t.course,
      "Status": t.status,
      "Prioritas": t.priority,
      "Progres (%)": t.progress,
      "Deadline": t.deadline,
    }));
    exportToCSV(rows, "laporan-admin-operasional.csv");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] text-adm-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[22px] text-adm-text">
            Laporan &amp; <span className="text-adm-accent">KPI Sistem</span>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={handleExportCSV} className="bg-adm-surface text-adm-muted border border-adm-border hover:text-adm-text hover:border-adm-muted px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📊 Ekspor Excel (CSV)
          </button>
          <button onClick={printAsPDF} className="bg-adm-surface text-adm-muted border border-adm-border hover:text-adm-text hover:border-adm-muted px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
            📄 Ekspor PDF
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-adm-surface border border-adm-border rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg mb-3">✅</div>
          <div className="font-serif text-[30px] leading-none text-adm-text">{totalDone}</div>
          <div className="text-[12px] text-adm-muted mt-1">Tugas Selesai</div>
        </div>
        <div className="bg-adm-surface border border-adm-border rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg mb-3">⏳</div>
          <div className="font-serif text-[30px] leading-none text-adm-text">{totalActive}</div>
          <div className="text-[12px] text-adm-muted mt-1">Masih Berjalan</div>
        </div>
        <div className="bg-adm-surface border border-adm-border rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-adm-accent/10 text-adm-accent flex items-center justify-center text-lg mb-3">🔗</div>
          <div className="font-serif text-[30px] leading-none text-adm-text">{integrations.filter((i: any) => i.status === "Stabil").length}</div>
          <div className="text-[12px] text-adm-muted mt-1">Integrasi Stabil</div>
        </div>
        <div className="bg-adm-surface border border-adm-border rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg mb-3">📅</div>
          <div className="font-serif text-[30px] leading-none text-adm-text">{report.weekly.reduce((a: number, w: any) => a + w.done, 0)}</div>
          <div className="text-[12px] text-adm-muted mt-1">Total Aktivitas Bulan Ini</div>
        </div>
      </div>

      {/* Bar chart weekly */}
      <div className="bg-adm-surface border border-adm-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-adm-text mb-5">📊 Aktivitas per Minggu</h3>
        <div className="flex items-end gap-3 h-[100px]">
          {report.weekly.map((w: any, i: number) => {
            const max = Math.max(...report.weekly.map((x: any) => x.done));
            const h = max > 0 ? (w.done / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-mono text-adm-accent">{w.done}</span>
                <div className="w-full rounded-t-md bg-adm-accent/70 min-h-[4px] transition-all" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-adm-muted">{w.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI */}
      <div className="bg-adm-surface border border-adm-border rounded-[14px] p-5">
        <h3 className="text-[14px] font-semibold text-adm-text mb-4">🎯 Target KPI Operasional</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {report.kpis.map((kpi: any, i: number) => (
            <div key={i} className="bg-adm-card border border-adm-border rounded-xl p-4">
              <div className="text-[13px] font-semibold text-adm-text mb-1">{kpi.title}</div>
              <div className="text-[12px] text-adm-muted leading-relaxed">{kpi.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Task table */}
      <div className="bg-adm-surface border border-adm-border rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-adm-border">
          <h3 className="text-[14px] font-semibold text-adm-text">📋 Ringkasan Tugas Operasional</h3>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-adm-card/50">
              {["Tugas", "Kategori", "Status", "Progres"].map(h => (
                <th key={h} className="text-left py-2.5 px-5 text-[11px] font-semibold text-adm-muted uppercase tracking-[0.06em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: any) => (
              <tr key={task.id} className="border-t border-adm-border/50 hover:bg-adm-hover transition-colors">
                <td className="py-3 px-5 text-adm-text font-medium">{task.title}</td>
                <td className="py-3 px-5 text-adm-muted">{task.course}</td>
                <td className="py-3 px-5">
                  <span className="text-[11px] font-medium capitalize text-adm-accent">{task.status}</span>
                </td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-adm-border rounded-full overflow-hidden">
                      <div className="h-full bg-adm-accent rounded-full" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-adm-muted w-8 text-right">{task.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
