"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Users, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    key: "admin",
    label: "Admin",
    icon: Shield,
    color: "text-[#7c3aed]",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-900/40",
    activeBg: "bg-[#7c3aed]",
    steps: [
      {
        title: "Login Admin",
        desc: "Gunakan akun admin yang diberikan oleh tim IT kampus melalui portal /auth/login/admin. Admin memiliki akses penuh ke seluruh data pengguna dan konfigurasi sistem.",
        tips: ["Jangan bagikan kredensial admin kepada siapapun", "Gunakan perangkat yang aman dan terpercaya saat login sebagai admin"],
      },
      {
        title: "Manajemen Pengguna",
        desc: "Tambah, edit, atau nonaktifkan akun mahasiswa dan dosen. Import data massal dari file CSV atau sinkronkan dengan SIAKAD kampus.",
        tips: ["Lakukan import massal di awal semester baru", "Nonaktifkan akun mahasiswa yang sudah lulus atau cuti akademik", "Selalu verifikasi data sebelum melakukan import massal"],
      },
      {
        title: "Pengaturan Sistem",
        desc: "Konfigurasi tahun akademik, semester aktif, kebijakan pengumpulan tugas, batas waktu, dan pengaturan notifikasi global untuk seluruh pengguna.",
        tips: ["Perbarui semester aktif setiap awal semester baru", "Backup konfigurasi sistem sebelum melakukan perubahan besar"],
      },
      {
        title: "Manajemen Role & Akses",
        desc: "Atur hak akses untuk setiap peran pengguna (Mahasiswa, Dosen, Staff TU). Tentukan fitur apa saja yang dapat diakses oleh masing-masing role.",
        tips: ["Terapkan prinsip least privilege — berikan akses minimal yang diperlukan", "Review hak akses secara berkala setiap semester"],
      },
      {
        title: "Laporan & Monitoring",
        desc: "Lihat statistik penggunaan platform secara keseluruhan, pantau uptime sistem, aktivitas login, dan generate laporan untuk pimpinan kampus.",
        tips: ["Jadwalkan generate laporan bulanan setiap tanggal 1", "Monitor log aktivitas untuk mendeteksi akses tidak wajar"],
      },
      {
        title: "Backup & Keamanan",
        desc: "Kelola backup data berkala, atur kebijakan keamanan akun (kekuatan password, sesi login), dan pantau log keamanan sistem.",
        tips: ["Lakukan backup otomatis setiap hari", "Aktifkan notifikasi jika ada percobaan login gagal berulang"],
      },
    ],
  },
  {
    key: "staff-tu",
    label: "Staff TU",
    icon: Users,
    color: "text-[#0891b2]",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-900/40",
    activeBg: "bg-[#0891b2]",
    steps: [
      {
        title: "Login Staff TU",
        desc: "Masuk melalui portal /auth/login/admin menggunakan NIP dan kata sandi. Dashboard menampilkan ringkasan aktivitas kampus dan tugas administratif.",
        tips: ["Periksa dashboard setiap pagi untuk update dan notifikasi terbaru"],
      },
      {
        title: "Manajemen Data Akademik",
        desc: "Kelola data kelas, jadwal perkuliahan, dan mata kuliah. Pastikan data selalu sinkron dengan SIAKAD untuk menghindari inkonsistensi informasi.",
        tips: ["Update data mata kuliah dan jadwal setiap awal semester", "Koordinasikan dengan dosen terkait perubahan jadwal"],
      },
      {
        title: "Rekap & Laporan",
        desc: "Generate laporan akademik untuk keperluan akreditasi, audit, atau pelaporan ke pimpinan. Tersedia berbagai template laporan standar yang bisa langsung digunakan.",
        tips: ["Simpan arsip laporan per semester untuk keperluan akreditasi", "Export laporan dalam format PDF untuk pengarsipan resmi"],
      },
      {
        title: "Pengumuman & Notifikasi",
        desc: "Buat dan kirim pengumuman kepada mahasiswa atau dosen tertentu melalui sistem notifikasi platform. Atur jadwal pengiriman pengumuman otomatis.",
        tips: ["Gunakan pengumuman untuk informasi penting seperti jadwal ujian, libur kampus, atau perubahan kebijakan"],
      },
      {
        title: "Verifikasi Data Mahasiswa",
        desc: "Verifikasi dan validasi data mahasiswa baru, perubahan data pribadi, serta status akademik. Koordinasikan dengan admin untuk perubahan yang memerlukan hak akses lebih tinggi.",
        tips: ["Lakukan verifikasi data sebelum setiap periode ujian", "Catat setiap perubahan data untuk keperluan audit"],
      },
    ],
  },
];

export default function BantuanAdminPage() {
  const [activeRole, setActiveRole] = useState("admin");
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set());

  const toggleStep = (i: number) =>
    setOpenSteps(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const role = ROLES.find((r) => r.key === activeRole)!;
  const Icon = role.icon;

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#020817]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f4f6f8]/90 dark:bg-[#020817]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/bantuan" className="flex items-center gap-2 text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={18} />
          Pusat Bantuan
        </Link>
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10" />
        <span className="text-[13px] font-semibold text-[#0f172a] dark:text-white">Panduan Admin & Staff TU</span>
      </header>

      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/50 rounded-full py-1.5 px-4 mb-5">
            <Shield size={14} className="text-[#7c3aed]" />
            <span className="text-xs font-semibold text-[#7c3aed]">Portal Administrasi</span>
          </div>
          <h1 className="text-4xl font-clash font-bold text-[#0f172a] dark:text-white mb-3">
            Panduan Admin & Staff TU
          </h1>
          <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] max-w-md mx-auto">
            Dokumentasi lengkap penggunaan AcadTrack untuk pengelola sistem kampus.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-3 justify-center mb-10">
          {ROLES.map((r) => {
            const RIcon = r.icon;
            const isActive = r.key === activeRole;
            return (
              <button
                key={r.key}
                onClick={() => { setActiveRole(r.key); setOpenSteps(new Set()); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-all border",
                  isActive
                    ? `${r.activeBg} text-white border-transparent shadow-md`
                    : "bg-white dark:bg-[#0f172a] text-[#475569] dark:text-[#94a3b8] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                )}
              >
                <RIcon size={16} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Steps */}
        <div className={cn("rounded-2xl border overflow-hidden", role.border)}>
          <div className={cn("px-6 py-5 flex items-center gap-3", role.bg)}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role.activeBg)}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-[#0f172a] dark:text-white text-[15px]">Panduan untuk {role.label}</div>
              <div className={cn("text-[12px] font-medium", role.color)}>{role.steps.length} langkah penggunaan</div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/10 bg-white dark:bg-[#0f172a]">
            {role.steps.map((step, i) => (
              <div key={i}>
                <button
                  onClick={() => toggleStep(i)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0", role.activeBg)}>
                    {i + 1}
                  </div>
                  <span className="flex-1 font-semibold text-[14px] text-[#0f172a] dark:text-white">{step.title}</span>
                  {openSteps.has(i)
                    ? <ChevronUp size={16} className="text-[#94a3b8] shrink-0" />
                    : <ChevronDown size={16} className="text-[#94a3b8] shrink-0" />}
                </button>

                {openSteps.has(i) && (
                  <div className="px-6 pb-5 border-t border-gray-100 dark:border-white/10 pt-4">
                    <p className="text-[13.5px] text-[#475569] dark:text-[#94a3b8] leading-relaxed mb-4">
                      {step.desc}
                    </p>
                    {step.tips && step.tips.length > 0 && (
                      <div className={cn("rounded-xl p-4 space-y-2", role.bg)}>
                        <div className={cn("text-[11px] font-bold uppercase tracking-wider mb-2", role.color)}>Tips</div>
                        {step.tips.map((tip, ti) => (
                          <div key={ti} className="flex items-start gap-2">
                            <CheckCircle size={13} className={cn("mt-0.5 shrink-0", role.color)} />
                            <span className="text-[12.5px] text-[#475569] dark:text-[#94a3b8]">{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Login CTA */}
        <div className="mt-10 bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-white/10 p-6 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-[#0f172a] dark:text-white text-[15px] mb-1">Siap untuk masuk?</div>
            <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8]">Gunakan portal login khusus admin untuk mengakses sistem.</div>
          </div>
          <Link
            href="/auth/login/admin"
            className="shrink-0 flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-5 py-2.5 rounded-xl text-[13.5px] transition-colors shadow-md"
          >
            <Shield size={15} />
            Login Admin
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 text-center py-6">
        <p className="text-[12px] text-[#94a3b8]">Hak Cipta Dilindungi • AcadTrack Universitas Pamulang © 2026</p>
      </div>
    </div>
  );
}
