"use client";

import { useState } from "react";
import useSWR from "swr";
import { Toast, type ToastType } from "@/components/ui/toast";
import type { JenisNotifikasi, Notifikasi } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const KIND_CONFIG: Record<string, any> = {
  DEADLINE: { icon: "🔥", bg: "bg-mhs-rose/15",   color: "text-mhs-rose",   label: "Deadline", labelCls: "bg-mhs-rose/15 text-mhs-rose",   category: "Tugas"    },
  PROGRES:  { icon: "📅", bg: "bg-mhs-amber/15",  color: "text-mhs-amber",  label: "Progres",  labelCls: "bg-mhs-amber/15 text-mhs-amber",  category: "Sistem"   },
  BROADCAST: { icon: "📢", bg: "bg-mhs-purple/15", color: "text-mhs-purple", label: "Broadcast",   labelCls: "bg-mhs-purple/15 text-mhs-purple", category: "Sistem"    },
  INFO:     { icon: "✅", bg: "bg-mhs-green/15",  color: "text-mhs-green",  label: "Info",     labelCls: "bg-mhs-green/15 text-mhs-green",   category: "Sistem"   },
  SISTEM:   { icon: "⚙️", bg: "bg-mhs-teal/15",   color: "text-mhs-teal",   label: "Sistem",   labelCls: "bg-mhs-teal/15 text-mhs-teal",     category: "Sistem"   },
};

const CHANNEL_ICON: Record<string, string> = {
  "In-app + Email": "📧",
  "Telegram": "💬",
  "In-app": "🔔",
  "Email": "📩",
};

const FILTER_TABS = ["Semua", "Belum Dibaca", "Tugas", "Sistem"] as const;
type FilterTab = typeof FILTER_TABS[number];

const PREF_DEFAULTS = [
  { key: "email_deadline", label: "Email Reminder Deadline", detail: "Kirim email peringatan 24 jam sebelum tugas berakhir", enabled: true },
  { key: "inapp_tugas", label: "Notifikasi Tugas Baru", detail: "Munculkan badge merah saat ada tugas/proyek baru", enabled: true },
  { key: "email_nilai", label: "Email Info Nilai", detail: "Kirim email saat nilai tugas baru saja dipublikasikan", enabled: false },
  { key: "telegram_sync", label: "Sinkronisasi Telegram", detail: "Teruskan notifikasi mendesak ke bot Telegram", enabled: false },
];

export default function NotifikasiPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const { data: apiData, mutate } = useSWR('/api/notifikasi', fetcher);
  const { data: prefData, mutate: mutatePref } = useSWR('/api/users/preferences', fetcher);
  
  const notifications: Notifikasi[] = apiData?.notifikasi || [];
  const dbPrefs = prefData?.preferences || {};

  const prefs = PREF_DEFAULTS.map(p => ({
    ...p,
    enabled: dbPrefs[p.key] ?? p.enabled
  }));

  const total = notifications.length;
  const unread = notifications.filter((n) => !n.statusBaca).length;

  const filtered = notifications.filter((notif) => {
    const isRead = notif.statusBaca;
    const cfg = KIND_CONFIG[notif.jenis] ?? KIND_CONFIG.INFO;
    if (activeFilter === "Belum Dibaca") return !isRead;
    if (activeFilter === "Tugas")       return cfg.category === "Tugas";
    if (activeFilter === "Sistem")      return cfg.category === "Sistem";
    return true;
  });

  const tabCount = (tab: FilterTab) => {
    if (tab === "Semua")       return total;
    if (tab === "Belum Dibaca") return unread;
    if (tab === "Tugas")       return notifications.filter(n => (KIND_CONFIG[n.jenis] ?? KIND_CONFIG.INFO).category === "Tugas").length;
    if (tab === "Sistem")      return notifications.filter(n => (KIND_CONFIG[n.jenis] ?? KIND_CONFIG.INFO).category === "Sistem").length;
    return 0;
  };

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/notifikasi/${id}`, { method: 'PATCH' });
    mutate();
  };

  const handleMarkAllRead = async () => {
    await fetch('/api/notifikasi/mark-all-read', { method: 'POST' });
    setToast({ message: "Semua notifikasi ditandai dibaca", type: "success" });
    mutate();
  };

  const handleTogglePref = async (key: string) => {
    const currentVal = dbPrefs[key] ?? PREF_DEFAULTS.find(p => p.key === key)?.enabled;
    const newPrefs = { ...dbPrefs, [key]: !currentVal };
    
    // Optimistic update
    mutatePref({ preferences: newPrefs }, false);
    
    try {
      await fetch('/api/users/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs)
      });
      setToast({ message: "Preferensi disimpan", type: "success" });
    } catch {
      setToast({ message: "Gagal menyimpan preferensi", type: "error" });
      mutatePref(); // Revert
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[22px] text-mhs-text">Notifikasi & <span className="text-mhs-amber">Pengingat</span></div>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <span className="text-[12px] bg-mhs-rose/10 text-mhs-rose font-semibold px-3 py-1 rounded-full border border-mhs-rose/20">
               {unread} belum dibaca
            </span>
          )}
          {unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[12px] bg-mhs-amber/10 text-mhs-amber font-semibold px-3 py-1.5 rounded-lg border border-mhs-amber/20 hover:bg-mhs-amber/20 transition-colors"
            >
              ✓ Tandai Semua Dibaca
            </button>
          )}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-0.5 bg-mhs-surface border border-mhs-border rounded-xl p-1 w-fit">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === tab ? "bg-mhs-card text-mhs-text shadow-sm" : "text-mhs-muted hover:text-mhs-text"
            }`}
          >
            {tab}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
              activeFilter === tab ? "bg-mhs-amber/20 text-mhs-amber" : "bg-mhs-border/60 text-mhs-muted"
            }`}>
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* NOTIFICATION LIST */}
      <div className="bg-mhs-card border border-mhs-border rounded-[14px] max-w-2xl">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-mhs-muted text-[13px]">
            Tidak ada notifikasi di kategori ini
          </div>
        )}
        {filtered.map((notif, fi) => {
          const cfg = KIND_CONFIG[notif.jenis] ?? KIND_CONFIG.INFO;
          const isRead = notif.statusBaca;
          const isLast = fi === filtered.length - 1;
          const timeLabel = new Date(notif.waktuKirim).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
          return (
            <div
              key={notif.id}
              className={`flex gap-3.5 p-4 items-start ${!isLast ? "border-b border-mhs-border" : ""} ${isRead ? "opacity-60" : ""} transition-opacity`}
            >
              {/* Unread dot (amber) */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                {!isRead && <div className="w-2 h-2 rounded-full bg-mhs-amber animate-pulse" />}
                {isRead && <div className="w-2 h-2" />}
              </div>

              <div className={`w-[38px] h-[38px] rounded-[10px] ${cfg.bg} ${cfg.color} flex items-center justify-center text-[18px] shrink-0`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-0.5">
                  <div className="text-[13.5px] font-semibold text-mhs-text flex-1">{notif.judul}</div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.labelCls}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="text-[12px] text-mhs-muted mt-0.5 leading-relaxed">{notif.pesan}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-mhs-muted">
                    {CHANNEL_ICON[notif.channel] ?? "📢"} {notif.channel.replace("_", "-")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-mhs-muted/40" />
                  <span className="text-[11px] text-mhs-muted">{timeLabel}</span>
                  {!isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="text-[11px] text-mhs-amber hover:underline ml-auto"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PREFERENCES */}
      <div>
        <div className="text-[14px] font-semibold text-mhs-text mb-3">⚙️ Preferensi Notifikasi</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {prefs.map(pref => (
            <div key={pref.key} className="bg-mhs-card border border-mhs-border rounded-[14px] p-4 flex items-start gap-3">
              <button
                onClick={() => handleTogglePref(pref.key)}
                className={`w-9 h-5 rounded-full relative flex items-center transition-colors shrink-0 mt-0.5 border ${
                  pref.enabled ? "bg-mhs-teal border-mhs-teal" : "bg-mhs-border border-mhs-border"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute transition-all ${pref.enabled ? "right-[3px]" : "left-[3px]"}`} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-mhs-text">{pref.label}</div>
                <div className="text-[11px] text-mhs-muted mt-0.5 leading-relaxed">{pref.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INTEGRATIONS */}
      <div>
        <div className="text-[14px] font-semibold text-mhs-text mb-3">🔗 Status Integrasi</div>
        <div className="flex flex-col gap-2.5 max-w-2xl">
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-4 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full shrink-0 ${dbPrefs.email_deadline || dbPrefs.email_nilai ? 'bg-mhs-green' : 'bg-mhs-muted'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-mhs-text">Email Gateway (Resend)</div>
              <div className="text-[11px] text-mhs-muted mt-0.5">Terkoneksi ke alamat email student</div>
            </div>
            <span className="text-[11px] text-mhs-muted shrink-0 text-right max-w-[160px]">
              {dbPrefs.email_deadline || dbPrefs.email_nilai ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-4 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full shrink-0 ${dbPrefs.telegram_sync ? 'bg-mhs-amber' : 'bg-mhs-muted'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-mhs-text">Telegram Bot</div>
              <div className="text-[11px] text-mhs-muted mt-0.5">Menerima peringatan realtime via chat</div>
            </div>
            <span className="text-[11px] text-mhs-muted shrink-0 text-right max-w-[160px]">
              {dbPrefs.telegram_sync ? 'Menunggu Konfirmasi' : 'Belum di-setup'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
