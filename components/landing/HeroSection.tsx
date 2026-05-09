"use client";

import Link from "next/link";
import { Globe, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";

interface HeroSectionProps {
  heroParallax: number;
}

export function HeroSection({ heroParallax }: HeroSectionProps) {
  const heroRef = useInView();

  return (
    <section
      ref={heroRef.ref}
      className={cn(
        "max-w-[1200px] mx-auto px-6 pt-16 pb-24 relative transition-all duration-700",
        heroRef.visible ? "fade-in-up opacity-100" : "opacity-0"
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-transparent border border-[#cbd5e1] rounded-full py-1.5 px-4 mb-6">
            <Globe size={16} className="text-[#2563eb]" />
            <span className="text-xs font-semibold text-[#334155] dark:text-[#cbd5e1]">
              Platform Manajemen Tugas &amp; Proyek Kuliah
            </span>
          </div>

          <h1 className="text-5xl md:text-[56px] font-clash text-[#0f172a] dark:text-white leading-[1.1] mb-6">
            AcadTrack
            <br />
            <span className="text-[#2563eb]">
              Kelola Tugas &amp;
              <br />
              Proyek Kuliah
              <br />
              Digital.
            </span>
          </h1>

          <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed mb-8 max-w-md">
            Platform manajemen tugas perkuliahan untuk mahasiswa dan dosen —
            submit, review, rekap pengumpulan, dan pantau progres kelas dalam
            satu dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 text-center btn-rpl flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              Mulai Sekarang
            </Link>
            <Link
              href="/panduan"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#1e3a8a] dark:text-[#60a5fa] font-semibold px-6 py-3 rounded-full transition-colors hover:shadow-md btn-rpl"
            >
              <BookOpen size={16} />
              Layanan Panduan
            </Link>
          </div>
        </div>

        {/* Right: Dashboard Preview */}
        <div className="relative flex justify-center items-center lg:justify-end">
          {/* Browser mockup */}
          <div
            className="w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0] dark:border-[#334155]"
            style={{
              transform: `translateY(${heroParallax}px)`,
              transition: "transform 0.1s linear",
            }}
          >
            {/* Browser chrome */}
            <div className="bg-[#f1f5f9] dark:bg-[#1e293b] px-4 py-2.5 flex items-center gap-2 border-b border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              </div>
              <div className="flex-1 bg-white dark:bg-[#0f172a] rounded-md px-3 py-1 text-[10px] text-[#64748b] dark:text-[#475569] text-center max-w-[200px] mx-auto border border-[#e2e8f0] dark:border-[#1e293b]">
                acadtrack.unpam.ac.id/mahasiswa
              </div>
            </div>
            {/* Dashboard content */}
            <div className="bg-white dark:bg-[#0f172a] p-4">
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                    Selamat pagi,
                  </div>
                  <div className="font-bold text-[13px] text-[#0f172a] dark:text-white">
                    Febiyanto Rizki Qurbandi
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center">
                    EK
                  </div>
                </div>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  {
                    label: "Tugas Aktif",
                    value: "3",
                    color: "text-[#2563eb]",
                  },
                  {
                    label: "Deadline Dekat",
                    value: "1",
                    color: "text-[#f59e0b]",
                  },
                  { label: "Selesai", value: "8", color: "text-[#16a34a]" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl p-2.5 text-center border border-[#f1f5f9] dark:border-[#334155]"
                  >
                    <div
                      className={`text-xl font-bold font-clash ${color}`}
                    >
                      {value}
                    </div>
                    <div className="text-[9px] text-[#94a3b8] mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              {/* Task list */}
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-[#64748b] dark:text-[#94a3b8] mb-2">
                  Tugas Terbaru
                </div>
                {[
                  {
                    title: "UTS Pemrograman Web",
                    matkul: "Pemweb",
                    deadline: "Besok",
                    status: "Aktif",
                    urgent: true,
                  },
                  {
                    title: "Laporan Praktikum BD",
                    matkul: "Basis Data",
                    deadline: "18 Mei",
                    status: "Aktif",
                    urgent: false,
                  },
                  {
                    title: "Tugas 1 — HTML Dasar",
                    matkul: "Pemweb",
                    deadline: "3 Apr",
                    status: "Selesai",
                    urgent: false,
                  },
                ].map(({ title, matkul, deadline, status, urgent }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2.5 bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl p-2.5 border border-[#f1f5f9] dark:border-[#334155]"
                  >
                    <div
                      className={`w-1 h-8 rounded-full shrink-0 ${urgent ? "bg-[#f59e0b]" : status === "Selesai" ? "bg-[#22c55e]" : "bg-[#2563eb]"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-[#0f172a] dark:text-white truncate">
                        {title}
                      </div>
                      <div className="text-[9px] text-[#94a3b8]">
                        {matkul} · {deadline}
                      </div>
                    </div>
                    <div
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${status === "Selesai" ? "bg-[#dcfce7] text-[#16a34a]" : urgent ? "bg-[#fef3c7] text-[#d97706]" : "bg-[#dbeafe] text-[#2563eb]"}`}
                    >
                      {status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge — kanan atas */}
          <div
            className="absolute -top-4 -right-2 lg:-right-6 z-20 anim-float"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl py-3 px-4 shadow-xl flex items-center gap-3 border border-gray-100 dark:border-[#334155]">
              <div className="w-8 h-8 bg-[#dcfce7] rounded-lg flex items-center justify-center">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <path
                    d="M1 6L5 10L13 2"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-[#0f172a] dark:text-white text-[12px]">
                  Tugas Dikumpulkan
                </div>
                <div className="text-[9px] text-[#64748b] dark:text-[#94a3b8]">
                  18/24 mahasiswa
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge — kiri bawah */}
          <div
            className="absolute -bottom-4 -left-2 lg:-left-6 z-20 anim-float"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl py-3 px-4 shadow-xl flex items-center gap-3 border border-gray-100 dark:border-[#334155]">
              <div className="w-8 h-8 bg-[#dbeafe] rounded-lg flex items-center justify-center text-[#2563eb]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-[#0f172a] dark:text-white text-[12px]">
                  Komentar Dosen
                </div>
                <div className="text-[9px] text-[#64748b] dark:text-[#94a3b8]">
                  Baru dibalas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
