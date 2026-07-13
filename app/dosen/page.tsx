"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type RecentSub = { id: string; taskTitle: string; taskCourse: string; submittedBy: string; submittedAtMs?: number; };

function relTime(ms?: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

const AVATAR_COLORS = [
  "bg-forest/10 text-forest",
  "bg-teal/10 text-teal",
  "bg-gold/15 text-gold",
  "bg-rose/10 text-rose",
  "bg-[#7c3aed]/10 text-[#7c3aed]",
];
function avatarColor(name: string) {
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function DosenDashboard() {
  const { data, error, isLoading } = useSWR("/api/dashboard", fetcher);

  if (isLoading) return <div className="p-5 animate-pulse text-ink">Memuat dashboard...</div>;
  if (error || !data) return <div className="text-red-500 p-5">Gagal memuat dashboard</div>;

  const { stats, recentSubs, runningTasks } = data;

  const newCount = recentSubs.filter((s: any) => {
    const diff = Date.now() - (s.submittedAtMs ?? 0);
    return diff < 24 * 3600_000;
  }).length;

  return (
    <div className="flex flex-col gap-5.5">
      {/* ALERT BANNER */}
      <div className="bg-gold/10 border-[1.5px] border-gold/25 rounded-xl px-4.5 py-3 text-[13px] text-ink-2 flex items-center gap-2.5">
        <span className="text-lg">📬</span>
        <span className="flex-1">
          Terdapat{" "}
          <strong className="text-gold font-semibold">{newCount || recentSubs.length} tugas</strong>{" "}
          yang baru dikumpulkan mahasiswa dan menunggu penilaian Anda.
        </span>
        <Link
          href="/dosen/rekap"
          className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shrink-0"
        >
          Lihat Sekarang
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-paper border-[1.5px] border-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(26,26,20,0.08)] transition-all">
          <div className="w-9.5 h-9.5 rounded-lg bg-forest/10 text-forest flex items-center justify-center text-lg mb-3.5">📋</div>
          <div className="font-serif text-[34px] leading-none text-ink">{stats.activeTasks}</div>
          <div className="text-[12px] text-muted mt-1">Total Tugas Aktif</div>
        </div>

        {/* Card 2 */}
        <div className="bg-paper border-[1.5px] border-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(26,26,20,0.08)] transition-all">
          <div className="w-9.5 h-9.5 rounded-lg bg-gold/10 text-gold flex items-center justify-center text-lg mb-3.5">📥</div>
          <div className="font-serif text-[34px] leading-none text-ink">{stats.submissionsReceived}</div>
          <div className="text-[12px] text-muted mt-1">Pengumpulan Diterima</div>
        </div>

        {/* Card 3 */}
        <div className="bg-paper border-[1.5px] border-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(26,26,20,0.08)] transition-all">
          <div className="w-9.5 h-9.5 rounded-lg bg-rose/10 text-rose flex items-center justify-center text-lg mb-3.5">⏰</div>
          <div className="font-serif text-[34px] leading-none text-ink">{stats.urgentMissing}</div>
          <div className="text-[12px] text-muted mt-1">Tugas Mendesak Kosong</div>
        </div>

        {/* Card 4 */}
        <div className="bg-paper border-[1.5px] border-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(26,26,20,0.08)] transition-all">
          <div className="w-9.5 h-9.5 rounded-lg bg-teal/10 text-teal flex items-center justify-center text-lg mb-3.5">🎓</div>
          <div className="font-serif text-[34px] leading-none text-ink">{stats.courses}</div>
          <div className="text-[12px] text-muted mt-1">Mata Kuliah Diampu</div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="grid grid-cols-[1fr_320px] gap-5 mt-2">

        {/* LEFT COLUMN */}
        <div className="space-y-5">

          {/* TUGAS BERJALAN TABLE */}
          <div className="bg-paper border-[1.5px] border-border rounded-[14px] p-5.5 shadow-[0_1px_6px_rgba(26,26,20,0.08)]">
            <div className="flex items-center mb-4">
              <h3 className="text-[14px] font-semibold text-ink flex-1">📋 Daftar Tugas Berjalan</h3>
              <Link href="/dosen/tugas" className="text-[12px] text-forest hover:underline cursor-pointer">Lihat semua tugas →</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2.5 px-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-b-[1.5px] border-border bg-cream">Nama Tugas</th>
                    <th className="text-left py-2.5 px-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-b-[1.5px] border-border bg-cream">Mata Kuliah</th>
                    <th className="text-left py-2.5 px-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-b-[1.5px] border-border bg-cream">Terkumpul</th>
                    <th className="text-left py-2.5 px-3.5 text-[11px] font-semibold text-muted uppercase tracking-wider border-b-[1.5px] border-border bg-cream">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {runningTasks.length === 0 ? (
                    <tr><td colSpan={4} className="py-3 px-3.5 text-center text-muted text-[12px]">Tidak ada tugas berjalan</td></tr>
                  ) : (
                    runningTasks.map((t: any) => (
                      <tr key={t.id} className="hover:bg-forest/5 group border-b border-border">
                        <td className="py-3 px-3.5 text-ink-2 font-medium">{t.title}</td>
                        <td className="py-3 px-3.5"><span className="inline-block text-[11px] font-semibold py-1 px-2.5 rounded-full bg-forest/10 text-forest">{t.subject}</span></td>
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[12px] text-ink-2">{t.submittedCount} terkumpul</span>
                          </div>
                        </td>
                        <td className="py-3 px-3.5"><span className="inline-block text-[10.5px] font-semibold py-1 px-2.5 rounded-full whitespace-nowrap bg-rose/10 text-rose">{new Date(t.deadline).toLocaleDateString("id-ID")}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BAR CHART — Pengumpulan per Minggu */}
          <div className="bg-paper border-[1.5px] border-border rounded-[14px] p-5.5 shadow-[0_1px_6px_rgba(26,26,20,0.08)]">
            <div className="flex items-center mb-5">
              <h3 className="text-[14px] font-semibold text-ink flex-1">📊 Pengumpulan per Minggu</h3>
              <span className="text-[11px] text-muted">Mar – Apr 2026</span>
            </div>

            {/* Bars */}
            <div className="flex items-end gap-2.5 h-[110px] border-b border-border/60 pb-0 mb-3">
              {[
                { val: 42, label: "W1 Mar", h: 55,  color: "bg-forest",      opacity: "opacity-60",  valCls: "text-ink-2" },
                { val: 67, label: "W2 Mar", h: 78,  color: "bg-forest",      opacity: "opacity-75",  valCls: "text-ink-2" },
                { val: 51, label: "W3 Mar", h: 62,  color: "bg-forest",      opacity: "opacity-65",  valCls: "text-ink-2" },
                { val: 88, label: "W4 Mar", h: 100, color: "bg-forest",      opacity: "",            valCls: "text-forest font-semibold" },
                { val: 27, label: "W1 Apr", h: 33,  color: "bg-gold",        opacity: "",            valCls: "text-gold font-semibold", current: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className={`text-[11px] font-mono ${bar.valCls}`}>{bar.val}</span>
                  <div
                    className={`w-full rounded-t-[6px] ${bar.color} ${bar.opacity} transition-all min-h-[4px]`}
                    style={{ height: `${bar.h}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex gap-2.5">
              {[
                { label: "W1 Mar" },
                { label: "W2 Mar" },
                { label: "W3 Mar" },
                { label: "W4 Mar" },
                { label: "W1 Apr ←", gold: true },
              ].map((bar, i) => (
                <div key={i} className={`flex-1 text-center text-[10px] ${bar.gold ? "text-gold font-semibold" : "text-muted"}`}>
                  {bar.label}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3.5 pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-forest" />
                <span className="text-[11px] text-muted">Minggu Lalu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gold" />
                <span className="text-[11px] text-muted">Minggu Ini</span>
              </div>
              <span className="text-[11px] text-muted ml-auto">Total: <span className="font-mono text-ink-2 font-semibold">275</span> pengumpulan</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">

          {/* DEADLINE MENDATANG */}
          <div className="bg-paper border-[1.5px] border-border rounded-[14px] p-5.5 shadow-[0_1px_6px_rgba(26,26,20,0.08)]">
            <h3 className="text-[14px] font-semibold text-ink mb-4">⏰ Jadwal Terdekat</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-2.5 border-b border-border">
                <div className="w-10 text-center bg-rose/10 border border-rose/25 rounded-lg py-1 shrink-0">
                  <div className="font-serif text-[18px] leading-none text-rose">08</div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">Apr</div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-[13px] font-medium text-ink">Batas Pengumpulan: Sorting</div>
                  <div className="text-[11px] text-muted mt-0.5">Pemrograman Lanjut</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-2.5 border-b border-border">
                <div className="w-10 text-center bg-cream border border-border rounded-lg py-1 shrink-0">
                  <div className="font-serif text-[18px] leading-none text-ink">09</div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">Apr</div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-[13px] font-medium text-ink">Batas Pengumpulan: ERD</div>
                  <div className="text-[11px] text-muted mt-0.5">Basis Data (Kelas A, B)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 text-center bg-cream border border-border rounded-lg py-1 shrink-0">
                  <div className="font-serif text-[18px] leading-none text-ink">14</div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">Apr</div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-[13px] font-medium text-ink">Presentasi Proyek Akhir</div>
                  <div className="text-[11px] text-muted mt-0.5">Sistem Operasi</div>
                </div>
              </div>
            </div>
          </div>

          {/* BARU DIKUMPULKAN */}
          <div className="bg-paper border-[1.5px] border-border rounded-[14px] p-5.5 shadow-[0_1px_6px_rgba(26,26,20,0.08)]">
            <div className="flex items-center mb-4">
              <h3 className="text-[14px] font-semibold text-ink flex-1">🔔 Baru Dikumpulkan</h3>
              {recentSubs.length > 0 && (
                <span className="text-[10px] font-semibold bg-forest/10 text-forest px-2 py-0.5 rounded-full">
                  {recentSubs.length}
                </span>
              )}
            </div>

            {recentSubs.length === 0 ? (
              <p className="text-[12px] text-muted text-center py-4">Belum ada pengumpulan.</p>
            ) : (
              <div className="space-y-3">
                {recentSubs.map((sub: any, i: number) => (
                  <div
                    key={sub.id}
                    className={`flex items-center gap-3 ${i < recentSubs.length - 1 ? "pb-2.5 border-b border-border" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-[10px] shrink-0 ${avatarColor(sub.submittedBy ?? "")}`}>
                      {initials(sub.submittedBy ?? "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink truncate">{sub.submittedBy}</div>
                      <div className="text-[11px] text-muted truncate">{sub.taskTitle}</div>
                    </div>
                    <div className="text-[10px] text-muted bg-cream px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                      {relTime(sub.submittedAtMs)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/dosen/rekap"
              className="block w-full mt-3 py-2 text-[12px] font-semibold text-forest border-[1.5px] border-forest/30 rounded-lg hover:bg-forest/5 transition-colors text-center"
            >
              Lihat Semua Pengumpulan
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
