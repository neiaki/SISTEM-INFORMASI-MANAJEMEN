"use client";

import { useState } from "react";
import useSWR from "swr";
import { Toast, type ToastType } from "@/components/ui/toast";
import type { Notifikasi } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const KIND_CFG: Record<string, { icon: string; bg: string; text: string; label: string }> = {
  SISTEM:    { icon: "⚙️", bg: "bg-adm-accent/10", text: "text-adm-accent",  label: "Sistem" },
  INTEGRASI: { icon: "🔗", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", label: "Integrasi" },
  INFO:      { icon: "✅", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", label: "Info" },
};

const PREF_DEFAULTS = [
  { key: "email_sistem", label: "Peringatan Sistem Kritis", detail: "Kirim email segera saat terdeteksi error pada layanan atau sinkronisasi database gagal.", enabled: true },
  { key: "inapp_audit", label: "Aktivitas Audit Log", detail: "Munculkan notifikasi in-app untuk perubahan peran atau penghapusan data penting.", enabled: true },
  { key: "telegram_alert", label: "Telegram Alert", detail: "Teruskan notifikasi kritis ke grup admin di Telegram.", enabled: false },
];

export default function AdminNotifikasiPage() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const { data: apiData, mutate } = useSWR('/api/notifikasi', fetcher);
  const { data: prefData, mutate: mutatePref } = useSWR('/api/users/preferences', fetcher);

  const notifications: Notifikasi[] = apiData?.notifikasi || [];
  const dbPrefs = prefData?.preferences || {};

  const prefs = PREF_DEFAULTS.map(p => ({
    ...p,
    enabled: dbPrefs[p.key] ?? p.enabled
  }));

  async function handleMarkRead(id: string) {
    await fetch(`/api/notifikasi/${id}`, { method: 'PATCH' });
    mutate();
  }

  const handleTogglePref = async (key: string) => {
    const currentVal = dbPrefs[key] ?? PREF_DEFAULTS.find(p => p.key === key)?.enabled;
    const newPrefs = { ...dbPrefs, [key]: !currentVal };
    
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
      mutatePref();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      <div>
        <div className="text-[11px] text-adm-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
        <div className="font-serif text-[22px] text-adm-text">Notifikasi &amp; Alert Sistem</div>
      </div>

      {/* Notification list */}
      <div className="bg-adm-surface border border-adm-border rounded-[14px] max-w-2xl">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-adm-muted text-[13px]">Tidak ada notifikasi sistem saat ini.</div>
        ) : notifications.map((notif, i) => {
          const cfg = KIND_CFG[notif.jenis] ?? KIND_CFG.INFO;
          const isRead = notif.statusBaca;
          const isLast = i === notifications.length - 1;
          const timeLabel = new Date(notif.waktuKirim).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
          return (
            <div
              key={notif.id}
              className={`flex gap-3.5 p-4 items-start ${!isLast ? "border-b border-adm-border" : ""} ${isRead ? "opacity-60" : ""}`}
            >
              <div className={`w-[38px] h-[38px] rounded-[10px] ${cfg.bg} ${cfg.text} flex items-center justify-center text-[18px] shrink-0`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-0.5">
                  <div className="text-[13.5px] font-semibold text-adm-text flex-1">{notif.judul}</div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                </div>
                <div className="text-[12px] text-adm-muted mt-0.5 leading-relaxed">{notif.pesan}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-adm-muted">{timeLabel}</span>
                  {!isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="text-[11px] text-adm-accent hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
              </div>
              {!isRead && <div className="w-2 h-2 rounded-full bg-adm-accent shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>

      {/* Preferences */}
      <div>
        <div className="text-[14px] font-semibold text-adm-text mb-3">⚙️ Preferensi Notifikasi</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {prefs.map(pref => (
            <div key={pref.key} className="bg-adm-surface border border-adm-border rounded-[14px] p-4 flex items-start gap-3">
              <button
                onClick={() => handleTogglePref(pref.key)}
                className={`w-9 h-5 rounded-full relative flex items-center transition-colors shrink-0 mt-0.5 border ${
                  pref.enabled ? "bg-adm-accent border-adm-accent" : "bg-adm-border border-adm-border"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute transition-all ${pref.enabled ? "right-[3px]" : "left-[3px]"}`} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-adm-text">{pref.label}</div>
                <div className="text-[11px] text-adm-muted mt-0.5 leading-relaxed">{pref.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
