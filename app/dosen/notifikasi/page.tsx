"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { X } from "lucide-react";
import { createSeedData } from "@/data/sim-data";
import { useNotifStore } from "@/lib/notifStore";
import { Toast, type ToastType } from "@/components/ui/toast";
import type { Notifikasi } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const data = createSeedData().dosen;

const COURSES = ["Analisis SI", "Keamanan Sistem", "SI Enterprise", "PPL", "Interaksi Manusia & Komputer"];

type Broadcast = {
  key: string;
  title: string;
  message: string;
  target: string;
  time: string;
};

const KIND_CONFIG: Record<string, any> = {
  REVIEW:  { icon: "⚠️", bg: "bg-rose/10",    color: "text-rose",   label: "Review",      labelCls: "bg-rose/10 text-rose",   category: "sistem" },
  PROGRES: { icon: "📅", bg: "bg-gold/10",    color: "text-gold",   label: "Progres",     labelCls: "bg-gold/15 text-gold",   category: "sistem" },
  DEADLINE:{ icon: "🔥", bg: "bg-rose/10",    color: "text-rose",   label: "Deadline",    labelCls: "bg-rose/10 text-rose",   category: "sistem" },
  INFO:    { icon: "✅", bg: "bg-forest/10",  color: "text-forest", label: "Info",        labelCls: "bg-forest/10 text-forest", category: "sistem" },
  BROADCAST:{ icon: "📢", bg: "bg-forest/10", color: "text-forest", label: "Broadcast",   labelCls: "bg-forest/15 text-forest", category: "broadcast" },
  SISTEM:   { icon: "⚙️", bg: "bg-forest/10", color: "text-forest", label: "Sistem",      labelCls: "bg-forest/15 text-forest", category: "sistem" },
};

const STATIC_NOTIFS = [
  { icon: "📥", bg: "bg-gold/10", color: "text-gold", label: "Pengumpulan", labelCls: "bg-gold/15 text-gold", category: "sistem",
    title: "3 tugas baru dikumpulkan mahasiswa", message: "Laporan Praktikum Sorting · Pemrograman Lanjut", time: "Baru saja" },
  { icon: "⏰", bg: "bg-rose/10", color: "text-rose", label: "Deadline", labelCls: "bg-rose/10 text-rose", category: "sistem",
    title: 'Deadline "ERD Perpustakaan" besok', message: "18 mahasiswa belum mengumpulkan · Basis Data", time: "2 jam lalu" },
  { icon: "✅", bg: "bg-forest/10", color: "text-forest", label: "Info", labelCls: "bg-forest/10 text-forest", category: "sistem",
    title: "Nilai Quiz Algoritma berhasil disimpan", message: "34/36 mahasiswa dinilai · Pemrograman Lanjut", time: "Kemarin" },
];

const TEMPLATES = [
  { label: "⏰ Pengingat Deadline", title: "Pengingat Deadline Tugas", message: "Reminder: Tugas [nama] akan deadline dalam 2 hari. Segera kumpulkan sebelum batas waktu." },
  { label: "✏️ Revisi Tugas",       title: "Mohon Lakukan Revisi",    message: "Mohon revisi tugas [nama] sesuai feedback yang diberikan. Hubungi dosen jika ada pertanyaan." },
  { label: "📊 Info Nilai",         title: "Nilai Sudah Dipublikasi",  message: "Nilai tugas [nama] sudah dipublikasikan. Silakan cek di halaman rekap pengumpulan." },
];

export default function DosenNotifikasiPage() {
  const { togglePref, getPrefs } = useNotifStore("dosen");
  const prefs = getPrefs(data.preferences);

  const [activeTab, setActiveTab]     = useState("semua");
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState({ title: "", message: "", target: "semua" });
  const [toast, setToast]             = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [modalOpen]);

  const { data: apiData, mutate } = useSWR('/api/notifikasi', fetcher);
  const notifications: Notifikasi[] = apiData?.notifikasi || [];

  const filtered = notifications.filter(notif => {
    const cfg = KIND_CONFIG[notif.jenis] ?? KIND_CONFIG.INFO;
    if (activeTab === "belum-dibaca") return !notif.statusBaca;
    if (activeTab === "broadcast")   return cfg.category === "broadcast";
    if (activeTab === "sistem")      return cfg.category === "sistem";
    return true;
  });

  const unread      = notifications.filter(n => !n.statusBaca).length;
  const broadcastNotifs = notifications.filter(n => (KIND_CONFIG[n.jenis] ?? KIND_CONFIG.INFO).category === "broadcast");
  const seedNotifs = notifications.filter(n => (KIND_CONFIG[n.jenis] ?? KIND_CONFIG.INFO).category === "sistem");

  async function handleMarkAllRead() {
    await fetch('/api/notifikasi/mark-all-read', { method: 'POST' });
    mutate();
    setToast({ message: "Semua notifikasi telah ditandai dibaca.", type: "success" });
  }

  async function handleMarkRead(id: string) {
    await fetch(`/api/notifikasi/${id}`, { method: 'PATCH' });
    mutate();
  }

  async function handleSendBroadcast() {
    if (!form.title.trim() || !form.message.trim()) return;

    await fetch('/api/notifikasi/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        message: form.message,
        target: form.target,
      }),
    });

    mutate();
    setForm({ title: "", message: "", target: "semua" });
    setModalOpen(false);
    setToast({ message: "Pengumuman berhasil dikirim!", type: "success" });
  }

  function applyTemplate(t: typeof TEMPLATES[0]) {
    setForm(f => ({ ...f, title: t.title, message: t.message }));
  }

  const tabs = [
    { id: "semua",        label: "Semua",        count: notifications.length },
    { id: "belum-dibaca", label: "Belum Dibaca",  count: unread           },
    { id: "broadcast",    label: "Broadcast",     count: broadcastNotifs.length },
    { id: "sistem",       label: "Sistem",         count: seedNotifs.length    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[24px] text-ink">Notifikasi</div>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={handleMarkAllRead} className="text-[12px] text-forest hover:underline font-medium">
              Tandai semua dibaca
            </button>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="bg-forest text-white hover:bg-forest/90 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5"
          >
            📢 Buat Pengumuman
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-cream border border-border rounded-xl p-1 max-w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
              activeTab === tab.id ? "bg-paper text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                activeTab === tab.id ? "bg-forest/15 text-forest" : "bg-border text-muted"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notif List */}
      <div className="bg-paper border-[1.5px] border-border rounded-[14px] shadow-[0_1px_6px_rgba(26,26,20,0.06)] max-w-2xl">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted text-[13px]">Tidak ada notifikasi di kategori ini.</div>
        ) : filtered.map((notif, i) => {
          const cfg = KIND_CONFIG[notif.jenis] ?? KIND_CONFIG.INFO;
          const isRead = notif.statusBaca;
          const isLast = i === filtered.length - 1;
          const timeLabel = new Date(notif.waktuKirim).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
          return (
            <div
              key={notif.id}
              className={`flex gap-3.5 p-4 items-start ${!isLast ? "border-b border-border/60" : ""} ${isRead ? "opacity-60" : ""} transition-opacity`}
            >
              <div className={`w-[38px] h-[38px] rounded-[10px] ${cfg.bg} ${cfg.color} flex items-center justify-center text-[18px] shrink-0`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-0.5">
                  <div className="text-[13.5px] font-semibold text-ink flex-1">{notif.judul}</div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.labelCls}`}>{cfg.label}</span>
                </div>
                <div className="text-[12px] text-muted mt-0.5 leading-relaxed">{notif.pesan}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-muted">{timeLabel}</span>
                  {!isRead && (
                    <button onClick={() => handleMarkRead(notif.id)} className="text-[11px] text-forest hover:underline">
                      Tandai dibaca
                    </button>
                  )}
                </div>
              </div>
              {!isRead && <div className="w-2 h-2 rounded-full bg-rose shrink-0 mt-2 animate-pulse" />}
            </div>
          );
        })}
      </div>

      {/* Preferensi */}
      <div>
        <div className="text-[14px] font-semibold text-ink mb-3">⚙️ Preferensi Notifikasi</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {prefs.map(pref => (
            <div key={pref.key} className="bg-paper border-[1.5px] border-border rounded-[14px] p-4 flex items-start gap-3 shadow-[0_1px_4px_rgba(26,26,20,0.04)]">
              <button
                onClick={() => togglePref("dosen", pref.key)}
                className={`w-9 h-5 rounded-full relative flex items-center transition-colors shrink-0 mt-0.5 border ${
                  pref.enabled ? "bg-forest border-forest" : "bg-border border-border"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute transition-all ${pref.enabled ? "right-[3px]" : "left-[3px]"}`} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-ink">{pref.label}</div>
                <div className="text-[11px] text-muted mt-0.5 leading-relaxed">{pref.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Broadcast */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-paper border border-border rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-serif text-[18px] text-ink">Buat Pengumuman</h2>
                <div className="text-[12px] text-muted mt-0.5">Broadcast ke mahasiswa</div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-ink transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Templates */}
              <div>
                <div className="text-[11px] text-muted uppercase tracking-wider mb-2">Template Cepat</div>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.label}
                      onClick={() => applyTemplate(t)}
                      className="text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-cream border border-border hover:border-forest hover:text-forest transition-all"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Judul <span className="text-rose">*</span></label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Judul pengumuman…"
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Pesan <span className="text-rose">*</span></label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Isi pesan pengumuman…"
                  rows={3}
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Target Penerima</label>
                <select
                  value={form.target}
                  onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                >
                  <option value="semua">Semua Mahasiswa</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 border border-border text-muted hover:text-ink py-2 rounded-lg text-[13px] font-semibold transition-all">
                Batal
              </button>
              <button
                onClick={handleSendBroadcast}
                disabled={!form.title.trim() || !form.message.trim()}
                className="flex-1 bg-forest text-white hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-lg text-[13px] font-semibold transition-all"
              >
                📢 Kirim Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
