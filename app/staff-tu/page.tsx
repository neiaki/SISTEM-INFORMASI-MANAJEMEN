"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import useSWR from "swr";
import { Toast, type ToastType } from "@/components/ui/toast";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const STATUS_COLORS: Record<string, string> = {
  "selesai":           "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "sedang dikerjakan": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "menunggu review":   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "belum mulai":       "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function StaffTUDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>("MAHASISWA");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: apiData, mutate } = useSWR('/api/staff-tu/dashboard', fetcher);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    try {
      const res = await fetch("/api/admin/import-users", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Gagal mengimport data");
      }

      setToast({ message: result.message, type: "success" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      mutate(); // refresh dashboard stats
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!apiData) {
    return <div className="flex h-[400px] items-center justify-center text-stu-muted">Memuat data...</div>;
  }

  const { stats, tasks = [], notifications = [] } = apiData;

  const STAT_CARDS = [
    { icon: "📂", label: "Backlog Aktif", value: String(stats.backlogAktif || 0), sub: "tugas operasional pending", color: "bg-stu-accent/10 text-stu-accent" },
    { icon: "🎓", label: "Mahasiswa Terdaftar", value: String(stats.totalMahasiswa || 0), sub: "Total akun mahasiswa aktif", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
    { icon: "👨‍🏫", label: "Dosen Pengampu", value: String(stats.totalDosen || 0), sub: "Total dosen aktif", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    { icon: "🏫", label: "Total Kelas", value: String(stats.totalKelas || 0), sub: "Mata Kuliah semester berjalan", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      
      <div>
        <div className="text-[11px] text-stu-muted uppercase tracking-[0.1em] mb-0.5">Selamat Datang</div>
        <div className="font-serif text-[24px] text-stu-text">
          Dashboard <span className="text-stu-accent">Staff TU</span>
        </div>
        <div className="text-[13px] text-stu-muted mt-1">Fokus pada data pengguna, antrean operasional, dan status akademik.</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <div key={i} className="bg-stu-surface border border-stu-border rounded-xl p-5 hover:-translate-y-[2px] transition-transform">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3.5 ${card.color}`}>
              {card.icon}
            </div>
            <div className="font-serif text-[32px] leading-none text-stu-text">{card.value}</div>
            <div className="text-[12px] text-stu-muted mt-1">{card.label}</div>
            <div className="text-[11px] mt-2 text-stu-accent font-medium">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Import CSV Card */}
        <div className="bg-stu-surface border border-stu-border rounded-[14px] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-stu-border">
            <h3 className="text-[14px] font-semibold text-stu-text">📤 Import Pengguna (CSV)</h3>
            <div className="text-[12px] text-stu-muted mt-0.5">Daftarkan pengguna baru secara massal.</div>
          </div>
          <div className="p-5 flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-stu-text">Tipe Pengguna</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-stu-card border border-stu-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-stu-accent text-stu-text"
              >
                <option value="MAHASISWA">Mahasiswa</option>
                <option value="DOSEN">Dosen</option>
                <option value="STAFF_TU">Staff TU</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-stu-text">File CSV</label>
              <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-stu-card border border-stu-border rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-stu-accent text-stu-text file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[12px] file:font-semibold file:bg-stu-accent/10 file:text-stu-accent hover:file:bg-stu-accent/20 cursor-pointer"
              />
            </div>

            <div className="flex gap-2 text-[11px] mt-auto">
              <a href="/templates/template-import-mahasiswa.csv" className="text-stu-accent hover:underline flex items-center gap-1">
                <span>📄</span> Template Mhs
              </a>
              <a href="/templates/template-import-dosen.csv" className="text-stu-accent hover:underline flex items-center gap-1 ml-2">
                <span>📄</span> Template Dosen
              </a>
              <a href="/templates/template-import-staff.csv" className="text-stu-accent hover:underline flex items-center gap-1 ml-2">
                <span>📄</span> Template Staff
              </a>
            </div>

            <button 
              onClick={handleImport}
              disabled={!file || loading}
              className="mt-2 w-full bg-stu-accent text-white py-2 rounded-lg text-[13px] font-semibold hover:bg-stu-accent/90 disabled:opacity-50 transition-colors"
            >
              {loading ? "Mengimport..." : "Mulai Import"}
            </button>
          </div>
        </div>

        {/* Backlog */}
        <div className="bg-stu-surface border border-stu-border rounded-[14px] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-stu-border flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-stu-text">📋 Backlog Terbaru</h3>
            <Link href="/staff-tu/tugas" className="text-[12px] text-stu-accent hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-stu-border flex-1">
            {tasks.length === 0 ? (
              <div className="p-5 text-center text-[13px] text-stu-muted">Tidak ada backlog.</div>
            ) : tasks.slice(0, 4).map((task: any) => (
              <div key={task.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-stu-text truncate">{task.title}</div>
                  <div className="text-[11px] text-stu-muted mt-0.5">{task.course}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[task.status] ?? ""}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification preview */}
      <div className="bg-stu-surface border border-stu-border rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-stu-border flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-stu-text">🔔 Notifikasi Terbaru</h3>
          <Link href="/staff-tu/notifikasi" className="text-[12px] text-stu-accent hover:underline">Lihat semua</Link>
        </div>
        <div className="divide-y divide-stu-border">
          {notifications.length === 0 ? (
            <div className="p-5 text-center text-[13px] text-stu-muted">Tidak ada notifikasi sistem.</div>
          ) : notifications.slice(0, 3).map((notif: any, i: number) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-stu-accent/10 flex items-center justify-center text-[14px] shrink-0">
                {notif.jenis === "DEADLINE" ? "🔥" : notif.jenis === "INFO" ? "✅" : "📋"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-stu-text">{notif.judul}</div>
                <div className="text-[11px] text-stu-muted mt-0.5">{notif.pesan}</div>
                <div className="text-[10px] text-stu-muted mt-1">{new Date(notif.waktuKirim).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
