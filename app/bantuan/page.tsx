"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  PlayCircle,
  Lightbulb,
  Info,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Footer } from "@/components/landing/Footer";

const BANTUAN_TABS = [
  {
    id: "panduan-pengguna",
    title: "Panduan Pengguna",
    icon: BookOpen,
    description: "Dokumentasi komprehensif untuk membantu Anda menavigasi setiap fitur dalam platform AcadTrack.",
    details: [
      "Cara login dan mengatur profil.",
      "Panduan lengkap manajemen tugas untuk Dosen.",
      "Langkah-langkah pengumpulan file bagi Mahasiswa.",
      "Cara membaca rekapitulasi nilai dan metrik.",
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    darkBgColor: "dark:bg-blue-500/10",
  },
  {
    id: "faq",
    title: "FAQ",
    icon: HelpCircle,
    description: "Pertanyaan yang paling sering diajukan mengenai akun, pendaftaran, dan masalah teknis platform.",
    details: [
      "Bagaimana cara mereset password akun?",
      "Apa yang harus dilakukan jika file gagal diupload?",
      "Bagaimana dosen menambah mahasiswa ke dalam kelas?",
      "Berapa batas maksimal ukuran file tugas?",
    ],
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    darkBgColor: "dark:bg-amber-500/10",
  },
  {
    id: "video-tutorial",
    title: "Video Tutorial",
    icon: PlayCircle,
    description: "Panduan visual langkah demi langkah untuk memaksimalkan penggunaan fitur AcadTrack.",
    details: [
      "Video instruksional cara membuat kelas baru.",
      "Screencast tutorial memberikan review pada tugas.",
      "Panduan interaktif pembentukan kelompok otomatis.",
      "Webinar pengenalan platform bagi mahasiswa baru.",
    ],
    color: "text-red-500",
    bgColor: "bg-red-50",
    darkBgColor: "dark:bg-red-500/10",
  },
  {
    id: "blog-tips",
    title: "Blog & Tips",
    icon: Lightbulb,
    description: "Artikel pilihan dan tips untuk meningkatkan produktivitas belajar serta efektivitas mengajar.",
    details: [
      "Tips mengatur waktu (time-management) selama perkuliahan.",
      "Praktik terbaik dalam mengerjakan proyek kelompok.",
      "Cara dosen memberikan feedback yang membangun.",
      "Update dan fitur terbaru dari tim pengembang AcadTrack.",
    ],
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-500/10",
  },
  {
    id: "tentang-kami",
    title: "Tentang Kami",
    icon: Info,
    description: "Mengenal lebih dekat visi, misi, dan tim pengembang di balik AcadTrack Universitas Pamulang.",
    details: [
      "Latar belakang pengembangan platform manajemen tugas.",
      "Visi untuk memajukan ekosistem perkuliahan digital.",
      "Daftar anggota tim pengembang dari fakultas IT.",
      "Roadmap fitur yang akan datang di versi berikutnya.",
    ],
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    darkBgColor: "dark:bg-indigo-500/10",
  },
];

function BantuanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "panduan-pengguna";
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && BANTUAN_TABS.some(f => f.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.replace(`/bantuan?tab=${id}`, { scroll: false });
  };

  const activeFeature = BANTUAN_TABS.find((f) => f.id === activeTab) || BANTUAN_TABS[0];

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
            Pusat <span className="text-[#2563eb]">Bantuan</span>
          </h1>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-[16px] max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban, panduan lengkap, dan tips terbaik untuk memastikan pengalaman akademik Anda di AcadTrack berjalan mulus tanpa hambatan.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            {BANTUAN_TABS.map((feature) => {
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
                <h4 className="font-semibold text-[#0f172a] dark:text-white text-[15px] mb-4">Informasi Tersedia:</h4>
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
                 {activeFeature.id === "panduan-pengguna" ? (
                   <Link href="/panduan" className="inline-flex items-center gap-2 bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e3a8a] dark:text-white px-6 py-3 rounded-full font-semibold text-[14px] hover:bg-black/5 dark:hover:bg-white/5 border border-[#e2e8f0] dark:border-[#334155] transition-colors">
                      <span>Buka Halaman Panduan Lengkap</span>
                      <ChevronRight size={16} />
                   </Link>
                 ) : activeFeature.id === "faq" ? (
                   <Link href="/#faq" className="inline-flex items-center gap-2 bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e3a8a] dark:text-white px-6 py-3 rounded-full font-semibold text-[14px] hover:bg-black/5 dark:hover:bg-white/5 border border-[#e2e8f0] dark:border-[#334155] transition-colors">
                      <span>Lihat Selengkapnya</span>
                      <ChevronRight size={16} />
                   </Link>
                 ) : (
                   <button className="inline-flex items-center gap-2 bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e3a8a] dark:text-white px-6 py-3 rounded-full font-semibold text-[14px] hover:bg-black/5 dark:hover:bg-white/5 border border-[#e2e8f0] dark:border-[#334155] transition-colors">
                      <span>Lihat Selengkapnya</span>
                      <ChevronRight size={16} />
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BantuanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020817] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
      </div>
    }>
      <BantuanContent />
    </Suspense>
  );
}
