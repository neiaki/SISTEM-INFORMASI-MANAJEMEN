"use client";

import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const STATUS_COLORS: Record<string, string> = {
  "selesai": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "sedang dikerjakan": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "menunggu review": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "belum mulai": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const INTEG_COLORS: Record<string, string> = {
  "Stabil": "text-emerald-600 dark:text-emerald-400",
  "Parsial": "text-amber-600 dark:text-amber-400",
  "Perlu observasi": "text-rose-600 dark:text-rose-400",
  "Rencana aktivasi": "text-slate-500",
};

export default function AdminDashboard() {
  const { data: apiData } = useSWR('/api/admin/dashboard', fetcher);

  if (!apiData) {
    return <div className="flex h-[400px] items-center justify-center text-adm-muted">Memuat data dashboard...</div>;
  }

  const { stats, tasks = [], integrations = [], operations = [], notifications = [] } = apiData;

  const STAT_CARDS = [
    { icon: "👥", label: "Total Pengguna Aktif", value: String(stats.totalUsers || 0), sub: `↑ ${stats.recentUsersCount || 0} akun baru minggu ini`, color: "bg-adm-accent/10 text-adm-accent" },
    { icon: "📋", label: "Tugas Operasional", value: String(tasks.length), sub: `${tasks.filter((t: any) => t.status === "selesai").length} selesai`, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { icon: "🔗", label: "Integrasi Aktif", value: String(stats.activeIntegrationsCount || 0), sub: `dari ${stats.totalIntegrationsCount || 0} terintegrasi`, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: "⚠️", label: "Alert Sistem", value: String(stats.alertCount || 0), sub: "perlu pemantauan", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="text-[11px] text-adm-muted uppercase tracking-[0.1em] mb-0.5">Selamat Datang</div>
        <div className="font-serif text-[24px] text-adm-text">
          Dashboard <span className="text-adm-accent">Admin Kampus</span>
        </div>
        <div className="text-[13px] text-adm-muted mt-1">Pemantauan sistem, integrasi SIAKAD/LMS, serta audit log operasional.</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <div key={i} className="bg-adm-surface border border-adm-border rounded-xl p-5 hover:-translate-y-[2px] transition-transform">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3.5 ${card.color}`}>
              {card.icon}
            </div>
            <div className="font-serif text-[32px] leading-none text-adm-text">{card.value}</div>
            <div className="text-[12px] text-adm-muted mt-1">{card.label}</div>
            <div className="text-[11px] mt-2 text-adm-accent font-medium">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tugas Operasional */}
        <div className="bg-adm-surface border border-adm-border rounded-[14px] overflow-hidden">
          <div className="px-5 py-4 border-b border-adm-border flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-adm-text">📋 Backlog Operasional</h3>
            <Link href="/admin/tugas" className="text-[12px] text-adm-accent hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-adm-border">
            {tasks.length === 0 ? (
              <div className="p-5 text-center text-[13px] text-adm-muted">Tidak ada backlog tugas.</div>
            ) : tasks.slice(0, 4).map((task: any) => (
              <div key={task.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-adm-text truncate">{task.title}</div>
                  <div className="text-[11px] text-adm-muted mt-0.5">{task.course}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[task.status] ?? ""}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Integrasi */}
        <div className="bg-adm-surface border border-adm-border rounded-[14px] overflow-hidden">
          <div className="px-5 py-4 border-b border-adm-border">
            <h3 className="text-[14px] font-semibold text-adm-text">🔗 Status Integrasi Sistem</h3>
          </div>
          <div className="divide-y divide-adm-border">
            {integrations.map((integ: any, i: number) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${integ.status === "Stabil" ? "bg-emerald-500" : integ.status === "Parsial" ? "bg-amber-500" : integ.status === "Perlu observasi" ? "bg-rose-500" : "bg-slate-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-adm-text">{integ.name}</div>
                  <div className="text-[11px] text-adm-muted mt-0.5">{integ.note}</div>
                </div>
                <span className={`text-[11px] font-semibold shrink-0 ${INTEG_COLORS[integ.status] ?? "text-adm-muted"}`}>
                  {integ.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifikasi terbaru */}
      <div className="bg-adm-surface border border-adm-border rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-adm-border flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-adm-text">🔔 Alert Sistem Terbaru</h3>
          <Link href="/admin/notifikasi" className="text-[12px] text-adm-accent hover:underline">Lihat semua</Link>
        </div>
        <div className="divide-y divide-adm-border">
          {notifications.length === 0 ? (
            <div className="p-5 text-center text-[13px] text-adm-muted">Tidak ada notifikasi sistem.</div>
          ) : notifications.map((notif: any, i: number) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-adm-accent/10 flex items-center justify-center text-[15px] shrink-0 mt-0.5">
                {notif.jenis === "SISTEM" ? "⚙️" : notif.jenis === "INTEGRASI" ? "🔗" : "✅"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-adm-text">{notif.judul}</div>
                <div className="text-[11px] text-adm-muted mt-0.5">{notif.pesan}</div>
                <div className="text-[10px] text-adm-muted mt-1">{new Date(notif.waktuKirim).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {operations.map((op: any, i: number) => (
          <div key={i} className="bg-adm-surface border border-adm-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{op.status}</span>
            </div>
            <div className="text-[14px] font-semibold text-adm-text">{op.title}</div>
            <div className="text-[12px] text-adm-muted mt-1 leading-relaxed">{op.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
