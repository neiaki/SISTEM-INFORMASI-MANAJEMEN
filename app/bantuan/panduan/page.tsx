"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, BookOpen, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    key: "mahasiswa",
    label: "Mahasiswa",
    icon: GraduationCap,
    color: "text-[#f59e0b]",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/40",
    activeBg: "bg-amber-500",
    steps: [
      {
        title: "Login & Navigasi",
        desc: "Buka AcadTrack, pilih role Mahasiswa, lalu masuk menggunakan NIM dan kata sandi yang diberikan oleh kampus.",
        tips: ["Gunakan browser terbaru untuk pengalaman terbaik", "Simpan kata sandi di password manager"],
      },
      {
        title: "Dashboard",
        desc: "Halaman utama menampilkan ringkasan tugas aktif, deadline terdekat, notifikasi terbaru, dan statistik pembelajaran semester ini.",
        tips: ["Cek dashboard setiap hari untuk tidak melewatkan deadline", "Gunakan widget kalender untuk melihat jadwal mingguan"],
      },
      {
        title: "Manajemen Tugas",
        desc: "Lihat seluruh tugas dari semua mata kuliah, filter berdasarkan status (aktif, dikumpulkan, selesai), dan kumpulkan tugas langsung dari platform.",
        tips: ["Gunakan filter 'Mendesak' untuk memprioritaskan tugas mendekati deadline", "Upload file dalam format PDF untuk hasil terbaik"],
      },
      {
        title: "Tugas Kelompok",
        desc: "Buat atau bergabung ke kelompok, lihat tugas kelompok yang diberikan dosen, kumpulkan hasil kerja kelompok, dan pantau status review dosen.",
        tips: ["Komunikasikan progress melalui fitur diskusi di setiap tugas kelompok", "Pastikan semua anggota terdaftar sebelum mengumpulkan tugas"],
      },
      {
        title: "Kalender & Notifikasi",
        desc: "Pantau semua deadline melalui tampilan kalender bulanan. Aktifkan notifikasi agar mendapat pengingat H-3 dan H-1 sebelum deadline.",
        tips: ["Aktifkan notifikasi di menu Profil > Preferensi Notifikasi", "Sinkronkan kalender dengan aplikasi kalender HP-mu"],
      },
      {
        title: "Laporan & Statistik",
        desc: "Lihat perkembangan akademik kamu: total tugas selesai, rata-rata nilai, tren per mata kuliah, dan perbandingan dengan semester sebelumnya.",
        tips: ["Gunakan laporan sebagai bahan evaluasi diri setiap akhir bulan"],
      },
    ],
  },
  {
    key: "dosen",
    label: "Dosen",
    icon: BookOpen,
    color: "text-[#16a34a]",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-900/40",
    activeBg: "bg-green-600",
    steps: [
      {
        title: "Login & Navigasi",
        desc: "Masuk menggunakan NIDN dan kata sandi. Dashboard dosen menampilkan rekap tugas seluruh kelas, aktivitas terbaru mahasiswa, dan statistik pengumpulan.",
        tips: ["Gunakan fitur pencarian cepat di topbar untuk menemukan mahasiswa atau tugas"],
      },
      {
        title: "Membuat Tugas",
        desc: "Buka menu Tugas, klik Buat Tugas, isi judul, deskripsi, mata kuliah, deadline, dan kelompok sasaran. Tugas akan langsung muncul di dashboard mahasiswa.",
        tips: ["Tambahkan deskripsi yang jelas agar mahasiswa tidak bingung", "Atur deadline realistis dengan mempertimbangkan beban tugas lain"],
      },
      {
        title: "Tugas Kelompok",
        desc: "Kelola tugas kelompok per mata kuliah. Lihat siapa yang sudah mengumpulkan, beri komentar, minta revisi, atau setujui dan beri nilai akhir.",
        tips: ["Gunakan catatan revisi yang spesifik agar mahasiswa tahu apa yang harus diperbaiki", "Status 'Selesai' berarti nilai sudah diberikan dan tidak bisa diubah"],
      },
      {
        title: "Rekap & Penilaian",
        desc: "Lihat rekap pengumpulan seluruh kelas, filter per status, dan beri nilai langsung dari halaman rekap. Export rekap dalam format PDF atau Excel.",
        tips: ["Gunakan filter 'Belum Dinilai' untuk mempercepat proses penilaian", "Export rekap sebelum rapat evaluasi dengan koordinator mata kuliah"],
      },
      {
        title: "Manajemen Kelompok",
        desc: "Buat dan atur kelompok per mata kuliah. Tambah atau hapus anggota kelompok, dan lihat komposisi kelompok aktif.",
        tips: ["Buat kelompok sebelum membuat tugas kelompok agar bisa langsung dipilih"],
      },
      {
        title: "Log Aktivitas",
        desc: "Pantau seluruh aktivitas mahasiswa di kelas kamu: kapan mereka login, mengumpulkan tugas, atau meninggalkan komentar.",
        tips: ["Log aktivitas berguna untuk deteksi mahasiswa yang kurang aktif"],
      },
    ],
  },
];

export default function LihatPanduanPage() {
  const [activeRole, setActiveRole] = useState("mahasiswa");
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set());

  const toggleStep = (i: number) =>
    setOpenSteps(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const role = ROLES.find((r) => r.key === activeRole)!;
  const Icon = role.icon;

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#020817]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f4f6f8]/90 dark:bg-[#020817]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={18} />
          Beranda
        </Link>
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10" />
        <span className="text-[13px] font-semibold text-[#0f172a] dark:text-white">Panduan Pengguna</span>
      </header>

      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-clash font-bold text-[#0f172a] dark:text-white mb-3">
            Panduan Pengguna
          </h1>
          <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] max-w-md mx-auto">
            Panduan lengkap penggunaan AcadTrack untuk setiap peran pengguna. Pilih peran kamu di bawah.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {ROLES.map((r) => {
            const RIcon = r.icon;
            const isActive = r.key === activeRole;
            return (
              <button
                key={r.key}
                onClick={() => { setActiveRole(r.key); setOpenSteps(new Set()); }}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] font-semibold transition-all border",
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

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mb-4">Masih butuh bantuan?</p>
          <Link href="/bantuan" className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-2.5 rounded-full text-[13.5px] transition-colors shadow-md">
            Kunjungi Pusat Bantuan
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 text-center py-6">
        <p className="text-[12px] text-[#94a3b8]">Hak Cipta Dilindungi • AcadTrack Universitas Pamulang © 2026</p>
      </div>
    </div>
  );
}
