"use client";

import { useState } from "react";
import Link from "next/link";

const TODAY = new Date("2026-05-08");
function daysLeft(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - TODAY.getTime()) / 86400000);
}
import { Checkbox } from "@/components/ui/checkbox";

function MiniCalendar() {
  const [date, setDate] = useState(new Date(2026, 3, 1)); // April 2026

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  // Deadline dots from seed data (static)
  const DEADLINE_DAYS = new Set([24, 26, 28]); // mhs-3, mhs-5, mhs-1

  const cells: { day: number; curr: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, curr: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, curr: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, curr: false });

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
      <div className="flex items-center mb-3">
        <h3 className="text-[14px] font-semibold flex-1 text-mhs-text">📅 {MONTHS_ID[month]} {year}</h3>
        <button onClick={() => setDate(new Date(year, month - 1, 1))} className="text-mhs-muted hover:text-mhs-text px-1.5 text-[16px]">‹</button>
        <button onClick={() => setDate(new Date(year, month + 1, 1))} className="text-mhs-muted hover:text-mhs-text px-1.5 text-[16px]">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["MIN","SEN","SEL","RAB","KAM","JUM","SAB"].map(d => (
          <div key={d} className="text-[10px] text-mhs-muted py-1 font-semibold">{d}</div>
        ))}
        {cells.map((c, i) => (
          <div key={i} className={`text-[12px] py-1.5 rounded-md relative select-none ${
            !c.curr ? "text-mhs-muted/30" :
            isToday(c.day) ? "text-mhs-on bg-mhs-amber font-bold" :
            "text-mhs-text hover:bg-mhs-border cursor-pointer"
          }`}>
            {c.day}
            {c.curr && DEADLINE_DAYS.has(c.day) && !isToday(c.day) && (
              <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 bg-mhs-rose rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MahasiswaDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* HINT BAR */}
      <div className="bg-gradient-to-r from-mhs-amber/10 to-mhs-teal/5 border border-mhs-amber/20 rounded-xl px-4 py-2.5 text-[12.5px] text-mhs-muted flex items-center gap-2.5">
        <span>⚠️</span>
        <span>Terdapat <strong className="text-mhs-amber font-medium">3 tugas mendesak</strong> yang deadline-nya dalam <strong className="text-mhs-amber font-medium">3 hari ke depan</strong>. Segera kerjakan!</span>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform group">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-amber opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="w-9 h-9 rounded-lg bg-mhs-amber/15 text-mhs-amber flex items-center justify-center text-lg mb-3.5">☑</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">12</div>
          <div className="text-[12px] text-mhs-muted mt-1">Tugas Aktif</div>
          <div className="text-[11px] mt-2.5 text-mhs-green flex items-center gap-1">↑ 3 tugas baru minggu ini</div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform group">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-rose opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex items-start justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-mhs-rose/15 text-mhs-rose flex items-center justify-center text-lg">🔥</div>
            <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-mhs-border" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="87.96 87.96" strokeDashoffset="61.57" strokeLinecap="round" className="text-mhs-rose" />
            </svg>
          </div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">3</div>
          <div className="text-[12px] text-mhs-muted mt-1">Mendesak (≤3 hari)</div>
          <div className="text-[11px] mt-2.5 text-mhs-rose flex items-center gap-1">↑ 2 dari minggu lalu</div>
        </div>

        {/* Card 3 */}
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform group">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-teal opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="w-9 h-9 rounded-lg bg-mhs-teal/15 text-mhs-teal flex items-center justify-center text-lg mb-3.5">🗂</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">4</div>
          <div className="text-[12px] text-mhs-muted mt-1">Proyek Berjalan</div>
          <div className="text-[11px] mt-2.5 text-mhs-green flex items-center gap-1">Rata-rata progres 62%</div>
        </div>

        {/* Card 4 */}
        <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 relative overflow-hidden hover:-translate-y-[3px] transition-transform group">
          <div className="absolute -top-7 -right-7 w-20 h-20 rounded-full bg-mhs-green opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="w-9 h-9 rounded-lg bg-mhs-green/15 text-mhs-green flex items-center justify-center text-lg mb-3.5">✅</div>
          <div className="font-serif text-[32px] leading-none text-mhs-text">18</div>
          <div className="text-[12px] text-mhs-muted mt-1">Selesai Bulan Ini</div>
          <div className="text-[11px] mt-2.5 text-mhs-green flex items-center gap-1">↑ +6 dari bulan lalu</div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="grid grid-cols-[1fr_340px] gap-5">
        
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          
          {/* TUGAS MINGGU INI */}
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5.5">
            <div className="flex items-center mb-4.5 px-1">
              <h3 className="text-[14px] font-semibold flex-1 text-mhs-text">📋 Tugas Minggu Ini</h3>
              <Link href="/mahasiswa/tugas" className="text-[12px] text-mhs-amber hover:underline cursor-pointer">Lihat semua →</Link>
            </div>

            <div className="space-y-1">
              {/* Task 1 */}
              <div className="flex items-center gap-3 p-2.5 border-b border-mhs-border/50 hover:bg-mhs-hover rounded-lg transition-colors cursor-pointer group">
                <Checkbox className="w-4.5 h-4.5 rounded-full border-mhs-border data-[state=checked]:bg-mhs-green data-[state=checked]:border-mhs-green" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate text-mhs-text">Laporan Praktikum Algoritma Sorting</div>
                  <div className="text-[11px] text-mhs-muted mt-0.5 flex gap-2 items-center">
                    <span>Pemrograman Lanjut</span><span className="w-1 h-1 bg-mhs-muted rounded-full"></span><span>Individu</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-mhs-rose/15 text-mhs-rose shrink-0">H-1</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-mhs-rose/15 text-mhs-rose shrink-0">Tinggi</span>
              </div>

              {/* Task 2 */}
              <div className="flex items-center gap-3 p-2.5 border-b border-mhs-border/50 hover:bg-mhs-hover rounded-lg transition-colors cursor-pointer group">
                <Checkbox className="w-4.5 h-4.5 rounded-full border-mhs-border data-[state=checked]:bg-mhs-green data-[state=checked]:border-mhs-green" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate text-mhs-text">ERD Sistem Informasi Perpustakaan</div>
                  <div className="text-[11px] text-mhs-muted mt-0.5 flex gap-2 items-center">
                    <span>Basis Data</span><span className="w-1 h-1 bg-mhs-muted rounded-full"></span><span>Kelompok</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-mhs-rose/15 text-mhs-rose shrink-0">H-2</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-mhs-rose/15 text-mhs-rose shrink-0">Tinggi</span>
              </div>

              {/* Task 3 */}
              <div className="flex items-center gap-3 p-2.5 border-b border-mhs-border/50 hover:bg-mhs-hover rounded-lg transition-colors cursor-pointer group">
                <Checkbox className="w-4.5 h-4.5 rounded-full border-mhs-border data-[state=checked]:bg-mhs-green data-[state=checked]:border-mhs-green" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate text-mhs-text">Resume Materi Sistem Operasi Bab 4</div>
                  <div className="text-[11px] text-mhs-muted mt-0.5 flex gap-2 items-center">
                    <span>Sistem Operasi</span><span className="w-1 h-1 bg-mhs-muted rounded-full"></span><span>Individu</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-mhs-amber/15 text-mhs-amber shrink-0">H-4</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-mhs-amber/15 text-mhs-amber shrink-0">Sedang</span>
              </div>

              {/* Task 4 (Done) */}
              <div className="flex items-center gap-3 p-2.5 hover:bg-mhs-hover rounded-lg transition-colors cursor-pointer group">
                <Checkbox checked className="w-4.5 h-4.5 rounded-full border-mhs-green bg-mhs-green text-mhs-on" />
                <div className="flex-1 min-w-0 opacity-50">
                  <div className="text-[13.5px] font-medium truncate text-mhs-text line-through">Quiz Kalkulus Online – Bab Limit</div>
                  <div className="text-[11px] text-mhs-muted mt-0.5 flex gap-2 items-center">
                    <span>Kalkulus</span><span className="w-1 h-1 bg-mhs-muted rounded-full"></span><span>Individu</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mhs-green/15 text-mhs-green shrink-0">Selesai</span>
              </div>
            </div>
          </div>

          {/* PROGRESS PROYEK */}
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5.5">
            <div className="flex items-center mb-4.5 px-1">
              <h3 className="text-[14px] font-semibold flex-1 text-mhs-text">🚀 Progres Proyek</h3>
              <Link href="/mahasiswa/proyek" className="text-[12px] text-mhs-amber hover:underline cursor-pointer">Detail →</Link>
            </div>

            <div className="space-y-4.5">
              {/* Project 1 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <div className="text-[13px] font-medium text-mhs-text">Aplikasi Mobile Keuangan Mahasiswa</div>
                    <div className="text-[11px] text-mhs-muted mt-0.5">RPL – Kelompok A</div>
                  </div>
                  <div className="font-mono text-[12px] text-mhs-amber">72%</div>
                </div>
                <div className="h-1.5 bg-mhs-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-mhs-amber to-mhs-amber-2 rounded-full transition-all duration-1000 w-[72%]" />
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-green/15 text-mhs-green">Perencanaan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-green/15 text-mhs-green">Desain</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-teal/15 text-mhs-teal">Implementasi</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-border text-mhs-muted">Presentasi</span>
                </div>
              </div>

              {/* Project 2 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <div className="text-[13px] font-medium text-mhs-text">Sistem Manajemen Perpustakaan</div>
                    <div className="text-[11px] text-mhs-muted mt-0.5">Basis Data – Kelompok B</div>
                  </div>
                  <div className="font-mono text-[12px] text-mhs-teal">45%</div>
                </div>
                <div className="h-1.5 bg-mhs-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-mhs-teal to-[#67e8f9] rounded-full transition-all duration-1000 w-[45%]" />
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-green/15 text-mhs-green">Perencanaan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-teal/15 text-mhs-teal">Desain</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-border text-mhs-muted">Implementasi</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-mhs-border text-mhs-muted">Presentasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          
          <MiniCalendar />

          {/* UPCOMING DEADLINES */}
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5.5">
            <h3 className="text-[14px] font-semibold text-mhs-text mb-4 px-1">⏰ Deadline Mendatang</h3>

            <div className="space-y-3">
              {[
                { date: "2026-05-10", day: "10", mon: "Mei", title: "Laporan Praktikum Sorting", sub: "Pemrograman Lanjut • Individu", status: "Dikerjakan", statusCls: "bg-mhs-teal/15 text-mhs-teal" },
                { date: "2026-05-12", day: "12", mon: "Mei", title: "ERD Sistem Perpustakaan", sub: "Basis Data • Kelompok", status: "Dikerjakan", statusCls: "bg-mhs-teal/15 text-mhs-teal" },
                { date: "2026-05-15", day: "15", mon: "Mei", title: "Resume SO Bab 4", sub: "Sistem Operasi • Individu", status: "Belum Mulai", statusCls: "bg-mhs-muted/15 text-mhs-muted" },
              ].map((item, idx) => {
                const hl = daysLeft(item.date);
                const urgent = hl <= 3;
                return (
                  <div key={idx} className={`flex items-start gap-2.5 ${idx < 2 ? "pb-3 border-b border-mhs-border/50" : "pb-1"}`}>
                    <div className={`w-10 text-center rounded-lg py-1 shrink-0 ${urgent ? "bg-mhs-rose/15 border border-mhs-rose/30" : "bg-mhs-border"}`}>
                      <div className={`font-serif text-[18px] leading-none ${urgent ? "text-mhs-rose" : "text-mhs-text"}`}>{item.day}</div>
                      <div className="text-[9px] text-mhs-muted uppercase tracking-wider">{item.mon}</div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-[13px] font-medium text-mhs-text">{item.title}</div>
                      <div className="text-[11px] text-mhs-muted mt-0.5">{item.sub}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${urgent ? "bg-mhs-rose/15 text-mhs-rose" : "bg-mhs-amber/15 text-mhs-amber"}`}>
                          H-{hl}
                        </span>
                        <Link href="/mahasiswa/tugas" className="text-[10px] text-mhs-teal hover:underline">→ Kerjakan</Link>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${item.statusCls}`}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
