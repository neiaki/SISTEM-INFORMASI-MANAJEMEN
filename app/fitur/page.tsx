"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ListTodo,
  FileText,
  MessageSquare,
  PieChart,
  Users,
  ArrowLeft,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Footer } from "@/components/landing/Footer";

const FEATURES = [
  {
    id: "manajemen-tugas",
    title: "Manajemen Tugas",
    icon: ListTodo,
    description: "Kelola seluruh tugas dari semua mata kuliah dalam satu dashboard terpusat.",
    details: [
      "Dosen dapat membuat, mengedit, dan mengatur deadline tugas.",
      "Penanda prioritas (Tinggi, Sedang, Rendah).",
      "Mahasiswa dapat melihat daftar tugas yang sedang aktif dan deadline terdekat.",
      "Notifikasi otomatis saat ada tugas baru.",
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    darkBgColor: "dark:bg-blue-500/10",
  },
  {
    id: "pengumpulan-file",
    title: "Pengumpulan File",
    icon: FileText,
    description: "Kumpulkan tugas Anda dalam berbagai format dengan cepat dan aman.",
    details: [
      "Mendukung upload berbagai jenis format file (PDF, DOCX, ZIP, dll).",
      "Validasi ukuran file otomatis.",
      "Tanda terima pengumpulan tercatat dengan timestamp (waktu server).",
      "Dosen dapat melihat hasil pengumpulan secara real-time.",
    ],
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-500/10",
  },
  {
    id: "review-komentar",
    title: "Review & Komentar",
    icon: MessageSquare,
    description: "Interaksi dua arah antara dosen dan mahasiswa terkait evaluasi tugas.",
    details: [
      "Dosen dapat memberikan feedback spesifik pada file yang dikumpulkan.",
      "Sistem penilaian langsung (skoring).",
      "Mahasiswa dapat membalas komentar dosen untuk klarifikasi.",
      "Riwayat diskusi tersimpan secara permanen untuk referensi.",
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    darkBgColor: "dark:bg-purple-500/10",
  },
  {
    id: "rekap-pengumpulan",
    title: "Rekap Pengumpulan",
    icon: PieChart,
    description: "Pantau kemajuan dan status pengumpulan mahasiswa secara menyeluruh.",
    details: [
      "Dashboard analitik menampilkan persentase pengumpulan kelas.",
      "Daftar mahasiswa yang sudah dan belum mengumpulkan.",
      "Filter berdasarkan status (Tepat Waktu, Terlambat, Tidak Mengumpulkan).",
      "Ekspor laporan rekapitulasi nilai dan status ke Excel/PDF.",
    ],
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    darkBgColor: "dark:bg-orange-500/10",
  },
  {
    id: "proyek-kelompok",
    title: "Proyek Kelompok",
    icon: Users,
    description: "Fasilitasi kerja sama tim dalam menyelesaikan proyek perkuliahan.",
    details: [
      "Pembuatan grup manual atau acak otomatis oleh sistem.",
      "Ruang kerja virtual khusus untuk setiap kelompok.",
      "Penilaian individu berbasis kontribusi dalam kelompok (peer review).",
      "Tracking progres per anggota kelompok secara transparan.",
    ],
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    darkBgColor: "dark:bg-pink-500/10",
  },
];

function FiturContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "manajemen-tugas";
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && FEATURES.some(f => f.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.replace(`/fitur?tab=${id}`, { scroll: false });
  };

  const activeFeature = FEATURES.find((f) => f.id === activeTab) || FEATURES[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020817] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-md border-b border-[#e2e8f0] dark:border-white/10 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#0f172a] dark:text-white hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-semibold text-[15px]">Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center">
             <span className="text-[#3b82f6] font-bold text-2xl font-clash italic mr-1">
                S
             </span>
             <span className="text-[#0f172a] dark:text-white font-bold text-lg tracking-tight">
                Acad<span className="text-[#facc15]">Track</span>
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 lg:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-clash font-bold text-[#0f172a] dark:text-white mb-6">
            Eksplorasi Fitur <span className="text-[#2563eb]">AcadTrack</span>
          </h1>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-[16px] max-w-2xl mx-auto leading-relaxed">
            Platform kami menyediakan berbagai instrumen esensial untuk mempermudah kegiatan akademik Anda. Pelajari bagaimana tiap fitur bekerja untuk mendukung ekosistem perkuliahan digital.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            {FEATURES.map((feature) => {
              const isActive = activeTab === feature.id;
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleTabChange(feature.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                    isActive
                      ? "bg-white dark:bg-[#1e293b] shadow-lg border border-[#e2e8f0] dark:border-[#334155] translate-x-2"
                      : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? `${feature.bgColor} ${feature.darkBgColor} ${feature.color}` : "bg-black/5 dark:bg-white/5 text-[#64748b] dark:text-[#94a3b8]"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-[15px] ${
                        isActive ? "text-[#0f172a] dark:text-white" : "text-[#64748b] dark:text-[#94a3b8]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e2e8f0] dark:border-[#334155] min-h-[400px] flex flex-col">
              <div className="flex items-center gap-5 mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${activeFeature.bgColor} ${activeFeature.darkBgColor} ${activeFeature.color}`}>
                   <activeFeature.icon size={32} />
                </div>
                <div>
                   <h2 className="text-3xl font-clash font-bold text-[#0f172a] dark:text-white">
                     {activeFeature.title}
                   </h2>
                </div>
              </div>
              
              <p className="text-[#475569] dark:text-[#cbd5e1] text-[16px] leading-relaxed mb-10">
                {activeFeature.description}
              </p>

              <div className="space-y-4 flex-1">
                <h4 className="font-semibold text-[#0f172a] dark:text-white text-[15px] mb-4">Kemampuan Utama:</h4>
                {activeFeature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#10b981] mt-0.5 shrink-0" size={20} />
                    <span className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-[#e2e8f0] dark:border-[#334155]">
                 <Link href="/auth/login" className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-semibold text-[14px] hover:bg-[#1e3a8a]/90 transition-colors shadow-lg">
                    <Zap size={16} />
                    Coba Fitur Ini Sekarang
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function FiturPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020817] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
      </div>
    }>
      <FiturContent />
    </Suspense>
  );
}
