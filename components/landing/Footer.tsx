"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const FOOTER_INFO: Record<
  string,
  { title: string; category: string; description: string; extra?: string }
> = {
  brand: {
    title: "AcadTrack",
    category: "Tentang Platform",
    description:
      "AcadTrack adalah platform manajemen tugas dan proyek perkuliahan untuk mahasiswa dan dosen Universitas Pamulang. Submit, review, rekap pengumpulan — semua dalam satu dashboard terintegrasi.",
    extra: "Versi 1.0 • Universitas Pamulang © 2026",
  },
  twitter: {
    title: "Twitter / X",
    category: "Media Sosial",
    description:
      "Ikuti kami di Twitter/X untuk mendapatkan update terbaru seputar AcadTrack, informasi akademik, dan pengumuman kampus.",
    extra: "@AcadTrackUnpam",
  },
  instagram: {
    title: "Instagram",
    category: "Media Sosial",
    description:
      "Follow Instagram kami untuk tips pengelolaan tugas, info kegiatan kampus, dan highlight penggunaan platform AcadTrack.",
    extra: "@acadtrack.unpam",
  },
  facebook: {
    title: "Facebook",
    category: "Media Sosial",
    description:
      "Bergabung dengan komunitas Facebook AcadTrack untuk berdiskusi, berbagi tips, dan mendapatkan informasi terkini dari Universitas Pamulang.",
    extra: "AcadTrack Universitas Pamulang",
  },
  youtube: {
    title: "YouTube",
    category: "Media Sosial",
    description:
      "Tonton video tutorial dan panduan lengkap penggunaan fitur-fitur AcadTrack di channel YouTube resmi kami.",
    extra: "AcadTrack Unpam Channel",
  },
  "manajemen-tugas": {
    title: "Manajemen Tugas",
    category: "Fitur",
    description:
      "Dosen dapat membuat, mengedit, dan mengelola tugas per mata kuliah dengan deadline, prioritas, dan deskripsi yang jelas. Mahasiswa melihat semua tugas aktif di satu dashboard.",
  },
  "pengumpulan-file": {
    title: "Pengumpulan File",
    category: "Fitur",
    description:
      "Mahasiswa mengumpulkan tugas berupa file dengan mudah langsung dari dashboard. Status pengumpulan terlihat real-time oleh dosen beserta timestamp dan komentar.",
  },
  "review-komentar": {
    title: "Review & Komentar",
    category: "Fitur",
    description:
      "Dosen dapat memberikan komentar dan feedback pada setiap submission mahasiswa. Mahasiswa dapat membalas dan berdiskusi langsung di platform.",
  },
  "rekap-pengumpulan": {
    title: "Rekap Pengumpulan",
    category: "Fitur",
    description:
      "Rekap otomatis siapa saja yang sudah dan belum mengumpulkan tugas. Dosen dapat melihat seluruh submission per tugas dari satu halaman rekap.",
  },
  "proyek-kelompok": {
    title: "Proyek Kelompok",
    category: "Fitur",
    description:
      "Buat dan kelola proyek kelompok dengan manajemen anggota, milestone, dan status proyek. Dosen dapat membentuk kelompok manual atau acak otomatis.",
  },
  "panduan-pengguna": {
    title: "Panduan Pengguna",
    category: "Bantuan",
    description:
      "Dokumentasi lengkap cara penggunaan seluruh fitur AcadTrack untuk mahasiswa dan dosen.",
  },
  faq: {
    title: "FAQ",
    category: "Bantuan",
    description:
      "Kumpulan pertanyaan yang paling sering ditanyakan beserta jawabannya. Temukan solusi cepat untuk masalah umum.",
  },
  "video-tutorial": {
    title: "Video Tutorial",
    category: "Bantuan",
    description:
      "Panduan visual langkah demi langkah cara menggunakan setiap fitur AcadTrack.",
  },
  "blog-tips": {
    title: "Blog & Tips",
    category: "Bantuan",
    description:
      "Artikel edukatif seputar pembelajaran digital, produktivitas akademik, dan tips penggunaan teknologi.",
  },
  "tentang-kami": {
    title: "Tentang Kami",
    category: "Bantuan",
    description:
      "AcadTrack dikembangkan oleh tim IT Universitas Pamulang sebagai solusi manajemen tugas digital terpadu.",
    extra: "Tim Pengembang IT — Universitas Pamulang",
  },
  "kebijakan-privasi": {
    title: "Kebijakan Privasi",
    category: "Legal",
    description:
      "Kebijakan privasi menjelaskan bagaimana AcadTrack mengumpulkan, menggunakan, dan melindungi data pengguna.",
  },
  "syarat-ketentuan": {
    title: "Syarat & Ketentuan",
    category: "Legal",
    description:
      "Syarat dan ketentuan penggunaan platform AcadTrack yang harus dipatuhi oleh seluruh pengguna.",
  },
  "kebijakan-sekolah": {
    title: "Kebijakan Sekolah",
    category: "Legal",
    description:
      "Kebijakan akademik Universitas Pamulang yang berlaku dalam penggunaan platform digital dan fasilitas pembelajaran.",
  },
  kontak: {
    title: "Kontak",
    category: "Legal",
    description:
      "Hubungi tim AcadTrack untuk bantuan teknis, pertanyaan, atau saran pengembangan platform.",
    extra:
      "Email: support@acadtrack.unpam.ac.id • Telepon: (021) 7499892 • Senin–Jumat, 08.00–17.00 WIB",
  },
  statistik: {
    title: "Statistik Platform",
    category: "Legal",
    description:
      "Data penggunaan platform AcadTrack secara keseluruhan yang diperbarui secara berkala.",
    extra: "150+ Mahasiswa Aktif • 12+ Mata Kuliah • 500+ Tugas Dikelola",
  },
};

const socialLinks: { key: string; href: string; svg: React.ReactNode }[] = [
  {
    key: "twitter",
    href: "https://twitter.com",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    href: "https://instagram.com",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    href: "https://facebook.com",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    href: "https://youtube.com",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    ),
  },
];

export function Footer() {
  const [footerModal, setFooterModal] = useState<string | null>(null);

  return (
    <>
      {/* FOOTER */}
      <div className="bg-[#0f172a]">
        <footer className="max-w-[1200px] mx-auto px-6 pt-20 pb-6 border-t border-[#1e293b]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            {/* Column 1 — Brand */}
            <div className="md:col-span-1">
              <button
                onClick={() => setFooterModal("brand")}
                className="flex items-center mb-6 hover:opacity-75 transition-opacity"
                aria-label="Tentang AcadTrack"
              >
                <span className="text-[#3b82f6] font-bold text-3xl font-clash italic mr-1" title="Scholar">
                  S
                </span>
                <div className="flex flex-col leading-none">
                  <span className="text-white font-bold text-xl tracking-tight leading-none">
                    Acad<span className="text-[#facc15]">Track</span>
                  </span>
                  <span className="text-[8px] font-semibold text-[#94a3b8]">
                    Scholar · Academic · Tracker
                  </span>
                </div>
              </button>
              <p className="text-[#94a3b8] text-[13px] leading-relaxed mb-6 pr-4">
                Platform manajemen tugas dan proyek perkuliahan untuk mahasiswa
                dan dosen Universitas Pamulang.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ key, href, svg }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={FOOTER_INFO[key]?.title}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0f172a] hover:opacity-80 hover:scale-110 transition-all"
                  >
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Fitur */}
            <div>
              <h4 className="text-white font-bold text-[14px] mb-6">Fitur</h4>
              <ul className="space-y-3">
                {(
                  [
                    "manajemen-tugas",
                    "pengumpulan-file",
                    "review-komentar",
                    "rekap-pengumpulan",
                    "proyek-kelompok",
                  ] as const
                ).map((key) => (
                  <li key={key}>
                    <button
                      onClick={() => setFooterModal(key)}
                      className="text-[#94a3b8] hover:text-white text-[13px] transition-colors text-left hover:translate-x-1 inline-block"
                    >
                      {FOOTER_INFO[key].title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Bantuan */}
            <div>
              <h4 className="text-white font-bold text-[14px] mb-6">
                Bantuan
              </h4>
              <ul className="space-y-3">
                {(
                  [
                    "panduan-pengguna",
                    "faq",
                    "video-tutorial",
                    "blog-tips",
                    "tentang-kami",
                  ] as const
                ).map((key) => (
                  <li key={key}>
                    <Link
                      href={`/bantuan#${key}`}
                      className="text-[#94a3b8] hover:text-white text-[13px] transition-colors text-left hover:translate-x-1 inline-block"
                    >
                      {FOOTER_INFO[key].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Legal */}
            <div>
              <h4 className="text-white font-bold text-[14px] mb-6">Legal</h4>
              <ul className="space-y-3">
                {(
                  [
                    "kebijakan-privasi",
                    "syarat-ketentuan",
                    "kebijakan-sekolah",
                    "kontak",
                    "statistik",
                  ] as const
                ).map((key) => (
                  <li key={key}>
                    <button
                      onClick={() => setFooterModal(key)}
                      className="text-[#94a3b8] hover:text-white text-[13px] transition-colors text-left hover:translate-x-1 inline-block"
                    >
                      {FOOTER_INFO[key].title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-[#64748b] text-[12px]">
              Hak Cipta Dilindungi • AcadTrack — Universitas Pamulang © 2026
            </p>
          </div>
        </footer>
      </div>

      {/* FOOTER INFO MODAL */}
      {footerModal && FOOTER_INFO[footerModal] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setFooterModal(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-[#1e293b] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#334155]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFooterModal(null)}
              aria-label="Tutup modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="mb-1">
              <span className="text-[10px] font-semibold text-[#3b82f6] uppercase tracking-widest">
                {FOOTER_INFO[footerModal].category}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-3">
              {FOOTER_INFO[footerModal].title}
            </h3>
            <p className="text-[#94a3b8] text-[14px] leading-relaxed">
              {FOOTER_INFO[footerModal].description}
            </p>
            {FOOTER_INFO[footerModal].extra && (
              <div className="mt-4 pt-4 border-t border-[#334155]">
                <p className="text-[#64748b] text-[12px]">
                  {FOOTER_INFO[footerModal].extra}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
