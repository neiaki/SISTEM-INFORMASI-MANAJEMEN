"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, BookMarked, Briefcase, ClipboardList, Zap, HelpCircle, PlayCircle, Newspaper, Info, Shield, FileText, GraduationCap, Phone, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    label: "Fitur",
    color: "text-[#2563eb]",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-100 dark:border-blue-900/40",
    items: [
      {
        key: "jurnal-harian",
        title: "Jurnal Harian",
        icon: BookOpen,
        description: "Fitur jurnal harian memungkinkan dosen mencatat aktivitas pembelajaran setiap hari secara terstruktur sesuai jadwal mengajar. Rekap otomatis tersedia untuk keperluan laporan akademik.",
      },
      {
        key: "jurnal-dosen",
        title: "Jurnal Dosen",
        icon: BookMarked,
        description: "Jurnal khusus dosen untuk merekap seluruh kegiatan pengajaran, pembimbingan akademik, dan penelitian. Memudahkan dosen dalam menyusun laporan beban kerja secara digital.",
      },
      {
        key: "jurnal-pkl",
        title: "Jurnal PKL",
        icon: Briefcase,
        description: "Kelola jurnal Praktik Kerja Lapangan (PKL) mahasiswa secara digital. Mahasiswa dapat mengisi jurnal harian PKL, dosen pembimbing dapat memantau dan memberikan catatan secara real-time.",
      },
      {
        key: "tugas-online",
        title: "Tugas Online",
        icon: ClipboardList,
        description: "Dosen dapat membuat, mendistribusikan, dan mengelola tugas online dengan berbagai format. Mahasiswa dapat mengerjakan dan mengumpulkan tugas langsung melalui platform kapan saja dan di mana saja.",
      },
      {
        key: "kuis-interaktif",
        title: "Kuis Interaktif",
        icon: Zap,
        description: "Buat dan ikuti kuis interaktif dengan berbagai tipe soal — pilihan ganda, isian, atau esai. Hasil penilaian otomatis langsung tersedia setelah kuis selesai dikerjakan.",
      },
    ],
  },
  {
    label: "Bantuan",
    color: "text-[#0d9488]",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-100 dark:border-teal-900/40",
    items: [
      {
        key: "panduan-pengguna",
        title: "Panduan Pengguna",
        icon: HelpCircle,
        description: "Dokumentasi lengkap cara penggunaan seluruh fitur AcadTrack untuk mahasiswa, dosen, admin, dan staff TU. Tersedia panduan step-by-step dengan ilustrasi yang mudah dipahami.",
      },
      {
        key: "faq",
        title: "FAQ",
        icon: HelpCircle,
        description: "Kumpulan pertanyaan yang paling sering ditanyakan beserta jawabannya. Temukan solusi cepat untuk masalah umum yang sering ditemui pengguna platform AcadTrack.",
        faqs: [
          { q: "Bagaimana cara mendaftar ke AcadTrack?", a: "Akun AcadTrack dibuat otomatis oleh admin kampus berdasarkan data SIAKAD. Hubungi staff TU jika belum memiliki akun." },
          { q: "Apakah AcadTrack bisa diakses dari HP?", a: "Ya, AcadTrack didesain responsif dan dapat diakses melalui browser di smartphone, tablet, maupun komputer." },
          { q: "Bagaimana sistem penilaian di AcadTrack?", a: "Penilaian dilakukan secara otomatis untuk kuis pilihan ganda dan manual oleh dosen untuk tugas esai atau proyek." },
          { q: "Apakah ada fitur review pembelajaran?", a: "Ya, terdapat fitur review dan analitik untuk memantau perkembangan belajar mahasiswa dari waktu ke waktu." },
          { q: "Bagaimana jika lupa kata sandi?", a: "Gunakan fitur 'Lupa Kata Sandi' di halaman login, atau hubungi admin kampus untuk reset akun." },
        ],
      },
      {
        key: "video-tutorial",
        title: "Video Tutorial",
        icon: PlayCircle,
        description: "Panduan visual langkah demi langkah cara menggunakan setiap fitur AcadTrack. Cocok untuk pengguna baru yang ingin memahami platform dengan cepat dan mudah.",
      },
      {
        key: "blog-tips",
        title: "Blog & Tips",
        icon: Newspaper,
        description: "Artikel edukatif seputar pembelajaran digital, produktivitas akademik, tips penggunaan teknologi, dan informasi terkini tentang dunia pendidikan tinggi.",
      },
      {
        key: "tentang-kami",
        title: "Tentang Kami",
        icon: Info,
        description: "AcadTrack dikembangkan oleh tim IT Universitas Pamulang sebagai solusi manajemen pembelajaran digital terpadu. Kami berkomitmen untuk terus berinovasi demi meningkatkan kualitas pendidikan.",
        extra: "Tim Pengembang IT — Universitas Pamulang",
      },
    ],
  },
  {
    label: "Legal",
    color: "text-[#7c3aed]",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-100 dark:border-violet-900/40",
    items: [
      {
        key: "kebijakan-privasi",
        title: "Kebijakan Privasi",
        icon: Shield,
        description: "Kebijakan privasi menjelaskan bagaimana AcadTrack mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi pengguna sesuai dengan regulasi perlindungan data yang berlaku.",
      },
      {
        key: "syarat-ketentuan",
        title: "Syarat & Ketentuan",
        icon: FileText,
        description: "Syarat dan ketentuan penggunaan platform AcadTrack yang harus dipatuhi oleh seluruh pengguna. Mencakup hak dan kewajiban pengguna serta ketentuan penggunaan yang bertanggung jawab.",
      },
      {
        key: "kebijakan-sekolah",
        title: "Kebijakan Sekolah",
        icon: GraduationCap,
        description: "Kebijakan akademik Universitas Pamulang yang berlaku bagi seluruh civitas akademika dalam penggunaan platform digital dan fasilitas pembelajaran.",
      },
      {
        key: "kontak",
        title: "Kontak",
        icon: Phone,
        description: "Hubungi tim AcadTrack untuk bantuan teknis, pertanyaan, atau saran pengembangan platform.",
        extra: "Email: support@acadtrack.unpam.ac.id · Telepon: (021) 7499892 · Senin–Jumat, 08.00–17.00 WIB",
      },
      {
        key: "statistik",
        title: "Statistik Platform",
        icon: BarChart2,
        description: "Data penggunaan platform AcadTrack secara keseluruhan yang diperbarui secara berkala untuk transparansi kepada seluruh pemangku kepentingan.",
        extra: "1.200+ Mahasiswa Aktif · 80+ Dosen · 5.000+ Jurnal Terkelola · 99.9% Uptime",
      },
    ],
  },
];

type Item = typeof SECTIONS[0]["items"][0];

function ItemCard({ item, accentColor, accentBg, accentBorder, initialOpen }: {
  item: Item;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen ?? false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const hasFaqs = "faqs" in item && Array.isArray((item as { faqs?: { q: string; a: string }[] }).faqs);
  const faqs = hasFaqs ? (item as { faqs: { q: string; a: string }[] }).faqs : [];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (initialOpen && ref.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  }, [initialOpen]);

  return (
    <div id={item.key} ref={ref} className={cn("rounded-2xl border bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden transition-all", initialOpen ? `ring-2 ${accentColor.replace("text-", "ring-")}` : "", accentBorder)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", accentBg)}>
          <Icon size={20} className={accentColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#0f172a] dark:text-white text-[15px]">{item.title}</div>
          <div className="text-[12px] text-[#64748b] dark:text-[#94a3b8] line-clamp-1 mt-0.5">{item.description}</div>
        </div>
        {open ? <ChevronUp size={16} className="text-[#94a3b8] shrink-0" /> : <ChevronDown size={16} className="text-[#94a3b8] shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-white/10 pt-4">
          <p className="text-[13.5px] text-[#475569] dark:text-[#94a3b8] leading-relaxed">
            {item.description}
          </p>
          {"extra" in item && item.extra && (
            <div className={cn("mt-3 text-[12px] font-medium px-3 py-2 rounded-lg", accentBg, accentColor)}>
              {item.extra}
            </div>
          )}
          {hasFaqs && faqs.length > 0 && (
            <div className="mt-4 space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-[13px] font-medium text-[#0f172a] dark:text-white">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={14} className="text-[#94a3b8] shrink-0" /> : <ChevronDown size={14} className="text-[#94a3b8] shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 text-[12.5px] text-[#475569] dark:text-[#94a3b8] leading-relaxed border-t border-gray-100 dark:border-white/10 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BantuanPage() {
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setActiveHash(window.location.hash.replace("#", ""));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#020817] text-[#0f172a] dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f4f6f8]/90 dark:bg-[#020817]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={18} />
          Kembali
        </Link>
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-[#2563eb] font-bold text-xl font-clash italic">S</span>
          <span className="font-bold text-lg tracking-tight">Acad<span className="text-[#f59e0b]">Track</span></span>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-[960px] mx-auto px-6 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-full py-1.5 px-4 mb-5">
          <HelpCircle size={14} className="text-[#2563eb]" />
          <span className="text-xs font-semibold text-[#2563eb]">Pusat Bantuan AcadTrack</span>
        </div>
        <h1 className="text-4xl font-clash font-bold text-[#0f172a] dark:text-white mb-3">
          Ada yang bisa kami bantu?
        </h1>
        <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] max-w-lg mx-auto">
          Temukan panduan, jawaban FAQ, informasi fitur, dan kebijakan platform AcadTrack di satu tempat.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-[960px] mx-auto px-6 pb-20 space-y-12">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className={cn("text-[13px] font-bold uppercase tracking-widest", section.color)}>{section.label}</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              {section.items.map((item) => (
                <ItemCard
                  key={item.key}
                  item={item}
                  accentColor={section.color}
                  accentBg={section.bg}
                  accentBorder={section.border}
                  initialOpen={activeHash === item.key}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-white/10 text-center py-6">
        <p className="text-[12px] text-[#94a3b8]">Hak Cipta Dilindungi • AcadTrack Universitas Pamulang © 2026</p>
      </div>
    </div>
  );
}
