"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  Building,
  Mail,
  BarChart3,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Phone,
  Clock,
  MapPin,
} from "lucide-react";
import { Footer } from "@/components/landing/Footer";

const LEGAL_TABS = [
  {
    id: "kebijakan-privasi",
    title: "Kebijakan Privasi",
    icon: ShieldCheck,
    description: "Kami berkomitmen untuk melindungi informasi pribadi Anda. Dokumen ini menjelaskan bagaimana data Anda dikumpulkan, digunakan, dan dijaga keamanannya.",
    details: [
      "Pengumpulan data pribadi terbatas pada kebutuhan akademik (NIM, Nama, Email).",
      "Tidak ada data pengguna yang dibagikan kepada pihak ketiga tanpa izin.",
      "Seluruh koneksi dan pengiriman file dienkripsi (End-to-End Encryption).",
      "Pengguna memiliki hak untuk meminta penghapusan data kapan saja.",
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    darkBgColor: "dark:bg-blue-500/10",
  },
  {
    id: "syarat-ketentuan",
    title: "Syarat & Ketentuan",
    icon: Scale,
    description: "Aturan dan regulasi yang mengatur akses serta penggunaan platform AcadTrack Universitas Pamulang.",
    details: [
      "Platform ini eksklusif untuk dosen dan mahasiswa aktif Universitas Pamulang.",
      "Pengguna dilarang mengunggah file yang mengandung malware atau konten ilegal.",
      "Kecurangan akademik (plagiarisme) dapat ditelusuri melalui history file.",
      "Tim pengembang berhak memblokir akun yang melanggar ketentuan penggunaan.",
    ],
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    darkBgColor: "dark:bg-amber-500/10",
  },
  {
    id: "kebijakan-sekolah",
    title: "Kebijakan Sekolah",
    icon: Building,
    description: "Integrasi aturan akademik dan kebijakan institusi Universitas Pamulang dalam penggunaan platform digital.",
    details: [
      "Mengacu pada pedoman akademik rektorat Universitas Pamulang.",
      "Standardisasi format pengumpulan tugas (Kop Surat, Format Penamaan).",
      "Kebijakan batas toleransi keterlambatan tugas sepenuhnya wewenang dosen.",
      "Platform ini berstatus sebagai pendukung, bukan pengganti SIAKAD.",
    ],
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-500/10",
  },
  {
    id: "kontak",
    title: "Kontak & Dukungan",
    icon: Mail,
    description: "Jika Anda memiliki pertanyaan teknis, menemukan bug, atau ingin memberikan saran, silakan hubungi tim kami melalui kanal berikut.",
    details: [
      "Email Dukungan: support@acadtrack.unpam.ac.id",
      "Telepon: (021) 7499892",
      "Waktu Operasional: Senin–Jumat, 08.00–17.00 WIB",
      "Lokasi: Gedung IT Center, Kampus Viktor Universitas Pamulang",
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    darkBgColor: "dark:bg-purple-500/10",
  },
  {
    id: "statistik",
    title: "Statistik Platform",
    icon: BarChart3,
    description: "Transparansi metrik dan data penggunaan platform AcadTrack (Data diperbarui secara berkala).",
    details: [
      "150+ Mahasiswa aktif terdaftar di semester berjalan.",
      "12+ Mata kuliah terintegrasi dalam sistem.",
      "500+ Tugas dan file proyek berhasil dikelola.",
      "Uptime server 99.9% selama jam sibuk perkuliahan.",
    ],
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    darkBgColor: "dark:bg-pink-500/10",
  },
];

function LegalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "kebijakan-privasi";
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && LEGAL_TABS.some(f => f.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.replace(`/legal?tab=${id}`, { scroll: false });
  };

  const activeFeature = LEGAL_TABS.find((f) => f.id === activeTab) || LEGAL_TABS[0];

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
            Pusat <span className="text-[#2563eb]">Legal & Informasi</span>
          </h1>
          <p className="text-[#64748b] dark:text-[#94a3b8] text-[16px] max-w-2xl mx-auto leading-relaxed">
            Transparansi adalah kunci. Pelajari lebih lanjut tentang kebijakan privasi kami, aturan platform, dan informasi pendukung lainnya.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            {LEGAL_TABS.map((feature) => {
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
                <h4 className="font-semibold text-[#0f172a] dark:text-white text-[15px] mb-4">
                  {activeFeature.id === "kontak" ? "Detail Kontak:" : "Poin Utama:"}
                </h4>
                {activeFeature.details.map((detail, idx) => {
                  
                  // Specific styling for kontak
                  if (activeFeature.id === "kontak") {
                    let ContactIcon = CheckCircle2;
                    if (detail.includes("Email")) ContactIcon = Mail;
                    if (detail.includes("Telepon")) ContactIcon = Phone;
                    if (detail.includes("Waktu")) ContactIcon = Clock;
                    if (detail.includes("Lokasi")) ContactIcon = MapPin;

                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <ContactIcon className="text-[#8b5cf6] mt-0.5 shrink-0" size={20} />
                        <span className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed font-medium">
                          {detail}
                        </span>
                      </div>
                    )
                  }

                  // Default Styling
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-[#10b981] mt-0.5 shrink-0" size={20} />
                      <span className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed">
                        {detail}
                      </span>
                    </div>
                  );
                })}
              </div>

              {activeFeature.id !== "kontak" && activeFeature.id !== "statistik" && (
                <div className="mt-12 pt-8 border-t border-[#e2e8f0] dark:border-[#334155]">
                  <button className="inline-flex items-center gap-2 bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e3a8a] dark:text-white px-6 py-3 rounded-full font-semibold text-[14px] hover:bg-black/5 dark:hover:bg-white/5 border border-[#e2e8f0] dark:border-[#334155] transition-colors">
                      <span>Unduh Dokumen PDF Lengkap</span>
                      <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020817] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full" />
      </div>
    }>
      <LegalContent />
    </Suspense>
  );
}
