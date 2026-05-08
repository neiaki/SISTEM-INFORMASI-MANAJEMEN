"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Globe,
  BookOpen,
  GraduationCap,
  Infinity as InfinityIcon,
  ClipboardList,
  TrendingUp,
  Users,
  UserCheck,
  BookMarked,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  MessageCircle,
  ArrowRight,
  X,
  Briefcase,
  Zap,
  ChevronRight,
  Menu,
  ArrowUp,
  Star,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Apa itu AcadTrack?",
    answer: "AcadTrack adalah platform manajemen pembelajaran terintegrasi untuk mahasiswa dan dosen Universitas Pamulang."
  },
  {
    question: "Bagaimana cara menggunakan jurnal harian?",
    answer: "Dosen dapat masuk ke menu jurnal harian pada dashboard dan mengisi aktivitas pembelajaran sesuai jadwal."
  },
  {
    question: "Apakah bisa mengerjakan tugas dan kuis online?",
    answer: "Ya, mahasiswa dapat mengerjakan tugas dan kuis secara online langsung melalui platform ini."
  },
  {
    question: "Bagaimana sistem penilaian di AcadTrack?",
    answer: "Penilaian dilakukan secara otomatis untuk kuis pilihan ganda dan manual oleh dosen untuk tugas esai atau proyek."
  },
  {
    question: "Apakah ada fitur review pembelajaran?",
    answer: "Ya, terdapat fitur review dan analitik untuk memantau perkembangan belajar mahasiswa dari waktu ke waktu."
  }
];

const FOOTER_INFO: Record<string, { title: string; category: string; description: string; extra?: string }> = {
  brand: {
    title: "AcadTrack",
    category: "Tentang Platform",
    description: "AcadTrack adalah platform E-Learning resmi Universitas Pamulang yang dirancang untuk mempermudah manajemen pembelajaran digital. Terintegrasi dengan sistem akademik kampus untuk pengalaman belajar-mengajar yang lebih efektif.",
    extra: "Versi 1.0 • Universitas Pamulang © 2025"
  },
  twitter: {
    title: "Twitter / X",
    category: "Media Sosial",
    description: "Ikuti kami di Twitter/X untuk mendapatkan update terbaru seputar AcadTrack, informasi akademik, dan pengumuman kampus.",
    extra: "@AcadTrackUnpam"
  },
  instagram: {
    title: "Instagram",
    category: "Media Sosial",
    description: "Follow Instagram kami untuk konten pembelajaran, info kegiatan kampus, dan highlight penggunaan platform AcadTrack.",
    extra: "@acadtrack.unpam"
  },
  facebook: {
    title: "Facebook",
    category: "Media Sosial",
    description: "Bergabung dengan komunitas Facebook AcadTrack untuk berdiskusi, berbagi tips belajar, dan mendapatkan informasi terkini dari Universitas Pamulang.",
    extra: "AcadTrack Universitas Pamulang"
  },
  youtube: {
    title: "YouTube",
    category: "Media Sosial",
    description: "Tonton video tutorial, rekaman webinar, dan panduan lengkap penggunaan fitur-fitur AcadTrack di channel YouTube resmi kami.",
    extra: "AcadTrack Unpam Channel"
  },
  "jurnal-harian": {
    title: "Jurnal Harian",
    category: "Fitur",
    description: "Fitur jurnal harian memungkinkan dosen mencatat aktivitas pembelajaran setiap hari secara terstruktur sesuai jadwal mengajar. Rekap otomatis tersedia untuk keperluan laporan akademik.",
  },
  "jurnal-dosen": {
    title: "Jurnal Dosen",
    category: "Fitur",
    description: "Jurnal khusus dosen untuk merekap seluruh kegiatan pengajaran, pembimbingan akademik, dan penelitian. Memudahkan dosen dalam menyusun laporan beban kerja secara digital.",
  },
  "jurnal-pkl": {
    title: "Jurnal PKL",
    category: "Fitur",
    description: "Kelola jurnal Praktik Kerja Lapangan (PKL) mahasiswa secara digital. Mahasiswa dapat mengisi jurnal harian PKL, dosen pembimbing dapat memantau dan memberikan catatan secara real-time.",
  },
  "tugas-online": {
    title: "Tugas Online",
    category: "Fitur",
    description: "Dosen dapat membuat, mendistribusikan, dan mengelola tugas online dengan berbagai format. Mahasiswa dapat mengerjakan dan mengumpulkan tugas langsung melalui platform kapan saja dan di mana saja.",
  },
  "kuis-interaktif": {
    title: "Kuis Interaktif",
    category: "Fitur",
    description: "Buat dan ikuti kuis interaktif dengan berbagai tipe soal — pilihan ganda, isian, atau esai. Hasil penilaian otomatis langsung tersedia setelah kuis selesai dikerjakan.",
  },
  "panduan-pengguna": {
    title: "Panduan Pengguna",
    category: "Bantuan",
    description: "Dokumentasi lengkap cara penggunaan seluruh fitur AcadTrack untuk mahasiswa, dosen, admin, dan staff TU. Tersedia panduan step-by-step dengan ilustrasi yang mudah dipahami.",
  },
  faq: {
    title: "FAQ",
    category: "Bantuan",
    description: "Kumpulan pertanyaan yang paling sering ditanyakan beserta jawabannya. Temukan solusi cepat untuk masalah umum yang sering ditemui pengguna platform AcadTrack.",
  },
  "video-tutorial": {
    title: "Video Tutorial",
    category: "Bantuan",
    description: "Panduan visual langkah demi langkah cara menggunakan setiap fitur AcadTrack. Cocok untuk pengguna baru yang ingin memahami platform dengan cepat dan mudah.",
  },
  "blog-tips": {
    title: "Blog & Tips",
    category: "Bantuan",
    description: "Artikel edukatif seputar pembelajaran digital, produktivitas akademik, tips penggunaan teknologi, dan informasi terkini tentang dunia pendidikan tinggi.",
  },
  "tentang-kami": {
    title: "Tentang Kami",
    category: "Bantuan",
    description: "AcadTrack dikembangkan oleh tim IT Universitas Pamulang sebagai solusi manajemen pembelajaran digital terpadu. Kami berkomitmen untuk terus berinovasi demi meningkatkan kualitas pendidikan.",
    extra: "Tim Pengembang IT — Universitas Pamulang"
  },
  "kebijakan-privasi": {
    title: "Kebijakan Privasi",
    category: "Legal",
    description: "Kebijakan privasi menjelaskan bagaimana AcadTrack mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi pengguna sesuai dengan regulasi perlindungan data yang berlaku.",
  },
  "syarat-ketentuan": {
    title: "Syarat & Ketentuan",
    category: "Legal",
    description: "Syarat dan ketentuan penggunaan platform AcadTrack yang harus dipatuhi oleh seluruh pengguna. Mencakup hak dan kewajiban pengguna serta ketentuan penggunaan yang bertanggung jawab.",
  },
  "kebijakan-sekolah": {
    title: "Kebijakan Sekolah",
    category: "Legal",
    description: "Kebijakan akademik Universitas Pamulang yang berlaku bagi seluruh civitas akademika dalam penggunaan platform digital dan fasilitas pembelajaran.",
  },
  kontak: {
    title: "Kontak",
    category: "Legal",
    description: "Hubungi tim AcadTrack untuk bantuan teknis, pertanyaan, atau saran pengembangan platform.",
    extra: "Email: support@acadtrack.unpam.ac.id • Telepon: (021) 7499892 • Senin–Jumat, 08.00–17.00 WIB"
  },
  statistik: {
    title: "Statistik Platform",
    category: "Legal",
    description: "Data penggunaan platform AcadTrack secara keseluruhan yang diperbarui secara berkala untuk transparansi kepada seluruh pemangku kepentingan.",
    extra: "1.200+ Mahasiswa Aktif • 80+ Dosen • 5.000+ Jurnal Terkelola • 99.9% Uptime"
  },
};

/* ── Hooks ─────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

export default function LandingPage() {
  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(new Set());
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [footerModal, setFooterModal] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Stats section inView for count-up
  const statsSection = useInView(0.3);
  const mahasiswaCount = useCountUp(1200, 1600, statsSection.visible);
  const dosenCount     = useCountUp(80,   1400, statsSection.visible);
  const jurnalCount    = useCountUp(5000, 1800, statsSection.visible);

  // Section fade-in refs
  const heroRef    = useInView();
  const fiturRef   = useInView();
  const testiRef   = useInView();
  const faqRef     = useInView();

  useEffect(() => {
    setMounted(true);
    setTheme("light");
  }, []);

  useEffect(() => {
    const SECTION_IDS = ["fitur", "testimoni", "faq", "newsletter"];
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 10);
      setShowTop(sy > 400);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(100, Math.round((sy / docH) * 100)) : 0);
      const scrollY = sy + 140;
      let current = "";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) { setNewsletterSent(true); setNewsletterEmail(""); }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndexes(prev => { const s = new Set(prev); s.has(index) ? s.delete(index) : s.add(index); return s; });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#020817] text-[#1e293b] dark:text-[#f1f5f9] font-['Poppins',sans-serif] transition-colors duration-300">

      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 z-[70] h-[3px] bg-[#2563eb] transition-none pointer-events-none" style={{ width: `${scrollProgress}%` }} />

      {/* BACK TO TOP */}
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#2563eb] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1d4ed8] hover:scale-110 active:scale-95 transition-all"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Inject Fonts + Icon Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-clash { font-family: 'Clash Display', sans-serif; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes icon-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0px #3b82f6); }
          50% { filter: brightness(1.3) drop-shadow(0 0 8px #3b82f6); }
        }
        @keyframes icon-wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-14deg); }
          40% { transform: rotate(14deg); }
          60% { transform: rotate(-9deg); }
          80% { transform: rotate(9deg); }
        }
        @keyframes icon-trend {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5px, -5px); }
        }
        @keyframes infinity-spin {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
        .anim-spin-slow { animation: spin-slow 7s linear infinite; }
        .anim-pulse-scale { animation: pulse-scale 2.2s ease-in-out infinite; }
        .anim-float { animation: icon-float 3s ease-in-out infinite; }
        .anim-glow { animation: icon-glow 2.5s ease-in-out infinite; }
        .anim-wiggle { animation: icon-wiggle 3.5s ease-in-out infinite; }
        .anim-trend { animation: icon-trend 2.5s ease-in-out infinite; }
        .anim-infinity { animation: infinity-spin 4s ease-in-out infinite; }

        html { scroll-behavior: smooth; }

        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,99,235,0.35); }
          50%       { box-shadow: 0 4px 32px rgba(37,99,235,0.7); }
        }
        .anim-cta-glow { animation: cta-glow 2.4s ease-in-out infinite; }

        .feat-icon { transition: transform 0.25s ease; }
        .feat-card:hover .feat-icon { transform: scale(1.18) rotate(8deg); }
      `}} />

      {/* HEADER */}
      <header className={cn(
        "px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#f4f6f8]/90 dark:bg-[#020817]/90 backdrop-blur-md transition-all duration-300 border-b border-transparent dark:border-white/10",
        scrolled && "shadow-md border-b border-[#e2e8f0] dark:border-white/10 backdrop-blur-xl"
      )}>
        <button onClick={scrollToTop} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-[#2563eb] font-bold text-3xl font-clash italic mr-1">S</span>
          <div className="flex flex-col leading-none">
            <span className="text-[#0f172a] dark:text-white font-bold text-xl tracking-tight leading-none">Acad<span className="text-[#f59e0b]">Track</span></span>
            <span className="text-[8px] font-semibold text-[#64748b] dark:text-[#94a3b8]">Smart, Innovative, Future-ready</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {([
            { id: "fitur",     label: "Fitur",      visible: true },
            { id: "testimoni", label: "Testimoni",  visible: true },
            { id: "faq",       label: "FAQ",        visible: true },
          ] as { id: string; label: string; visible: boolean }[]).filter(n => n.visible).map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "text-sm font-semibold transition-colors relative",
                activeSection === id
                  ? "text-[#2563eb]"
                  : "text-[#475569] dark:text-[#cbd5e1] hover:text-[#0f172a] dark:hover:text-white"
              )}
            >
              {label}
              {activeSection === id && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
              )}
            </a>
          ))}
          <div className="w-px h-4 bg-[#e2e8f0] dark:bg-white/10" />
          <Link href="/bantuan" className="flex items-center gap-2 text-[#475569] dark:text-[#cbd5e1] hover:text-[#0f172a] dark:hover:text-white text-sm font-semibold transition-colors">
            <HelpCircle size={18} />
            Bantuan
          </Link>
          <Link href="/auth/login">
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-md transition-colors">
              Masuk
            </button>
          </Link>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#cbd5e1] shadow-sm hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors"
          >
            {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#cbd5e1]"
          >
            {mounted && resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileMenu(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#cbd5e1]"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#f4f6f8] dark:bg-[#020817]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] dark:border-white/10">
            <span className="font-bold text-lg text-[#0f172a] dark:text-white">Menu</span>
            <button onClick={() => setMobileMenu(false)} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2e8f0] dark:border-white/10 text-[#475569] dark:text-[#94a3b8]">
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-6">
            {([
              { href: "#fitur",     label: "Fitur",     visible: true  },
              { href: "#testimoni", label: "Testimoni", visible: true },
              { href: "#faq",       label: "FAQ",       visible: true  },
            ] as { href: string; label: string; visible: boolean }[]).filter(n => n.visible).map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMobileMenu(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-semibold text-[#0f172a] dark:text-white hover:bg-[#e2e8f0] dark:hover:bg-white/10 transition-colors">
                {label}
              </a>
            ))}
            <div className="h-px bg-[#e2e8f0] dark:bg-white/10 my-2" />
            {[
              { href: "/bantuan", label: "Bantuan" },
              { href: "/bantuan/panduan", label: "Panduan Pengguna" },
              { href: "/auth/login", label: "Masuk ke Platform" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileMenu(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-semibold text-[#0f172a] dark:text-white hover:bg-[#e2e8f0] dark:hover:bg-white/10 transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* HERO SECTION */}
      <section ref={heroRef.ref} className={cn("max-w-[1200px] mx-auto px-6 pt-16 pb-24 relative transition-all duration-700", heroRef.visible ? "fade-in-up opacity-100" : "opacity-0")}>
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-transparent border border-[#cbd5e1] rounded-full py-1.5 px-4 mb-6">
              <Globe size={16} className="text-[#2563eb]" />
              <span className="text-xs font-semibold text-[#334155] dark:text-[#cbd5e1]">Platform E-Learning Resmi Universitas Pamulang</span>
            </div>

            <h1 className="text-5xl md:text-[56px] font-clash text-[#0f172a] dark:text-white leading-[1.1] mb-6">
              AcadTrack<br/>
              <span className="text-[#2563eb]">Platform<br/>Pembelajaran<br/>Digital.</span>
            </h1>

            <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed mb-8 max-w-md">
              Sistem manajemen pembelajaran terintegrasi untuk mahasiswa dan dosen dengan fitur jurnal harian, tugas online, kuis, dan penilaian real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/auth/login" className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 text-center anim-cta-glow">
                Mulai Sekarang
              </Link>
              <Link href="/bantuan/panduan" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent hover:bg-[#e2e8f0]/50 dark:hover:bg-[#1e293b] text-[#1e3a8a] dark:text-[#60a5fa] font-semibold px-8 py-3.5 rounded-full transition-colors">
                <HelpCircle size={18} />
                Lihat Panduan
              </Link>
            </div>
          </div>

          {/* Right: Images and Badges */}
          <div className="relative h-[500px] flex justify-center items-center">
            {/* Main Image */}
            <div className="relative w-[340px] h-[440px] rounded-3xl overflow-hidden shadow-2xl z-10">
              <div className="absolute inset-0 bg-[#cbd5e1]">
                <img
                  src="/Unpam-Victor.jpeg"
                  alt="School Building"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge — Kelola Jurnal */}
            <div className="absolute top-[10%] -left-[10%] z-20 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-gray-100 dark:border-[#334155]">
                <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="anim-pulse-scale" />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white text-[15px]">Kelola Jurnal</div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8] font-medium">Kelola jurnal belajar harian</div>
                </div>
              </div>
            </div>

            {/* Floating Badge — GraduationCap */}
            <div className="absolute top-[25%] -right-[5%] z-20 animate-bounce" style={{animationDuration: '2s'}}>
              <div className="w-16 h-16 bg-[#2563eb] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <GraduationCap size={32} />
              </div>
            </div>

            {/* Floating Badge — All In One */}
            <div className="absolute bottom-[15%] -right-[15%] z-20 animate-bounce" style={{animationDuration: '2.4s'}}>
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl py-3 px-5 shadow-xl flex flex-col items-center justify-center border border-gray-100 dark:border-[#334155] text-center w-36">
                <div className="text-[#2563eb] mb-1">
                  <InfinityIcon size={32} strokeWidth={2.5} />
                </div>
                <div className="font-bold text-[#0f172a] dark:text-white text-[14px]">All In One</div>
                <div className="text-[9px] text-[#64748b] dark:text-[#94a3b8] font-medium leading-tight mt-1">Semua kebutuhan akademik terpusat</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ECOSYSTEM SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Image with Badges */}
          <div className="relative h-[550px] flex justify-center items-center order-2 lg:order-1">
            {/* Main Image */}
            <div className="relative w-[380px] h-[480px] rounded-[32px] overflow-hidden shadow-2xl z-10">
              <div className="absolute inset-0 bg-[#e2e8f0]">
                 <img
                  src="/Unpam-Victor.jpeg"
                  alt="Student learning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge — Quiz */}
            <div className="absolute top-[5%] -left-[5%] z-20">
              <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-center text-center w-36 border border-gray-100 dark:border-[#334155]">
                <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-xl flex items-center justify-center mb-3">
                  <ClipboardList size={24} className="anim-wiggle" />
                </div>
                <div className="font-clash text-xl font-bold text-[#0f172a] dark:text-white">Quiz</div>
                <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8] font-medium leading-tight mt-1">Kerjakan tugas dan Quiz</div>
              </div>
            </div>

            {/* Floating Badge — Light Bulb */}
            <div className="absolute top-[20%] right-[0%] z-20 anim-float" style={{animationDuration: '2.5s'}}>
              <div className="w-20 h-20 bg-[#2563eb] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="anim-glow">
                  <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7v1"/>
                  <path d="M4 12h1"/><path d="M19 12h1"/>
                  <path d="M12 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                </svg>
              </div>
            </div>

            {/* Floating Badge — Review Belajar */}
            <div className="absolute bottom-[10%] -right-[15%] z-20 w-[240px]">
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-4 border border-gray-100 dark:border-[#334155]">
                <div className="text-[#1e3a8a]">
                  <TrendingUp size={36} strokeWidth={2.5} className="anim-trend" />
                </div>
                <div>
                  <div className="font-clash text-lg font-bold text-[#0f172a] dark:text-white leading-tight">Review Belajar</div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8] font-medium">Nilai pembelajaran harian</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content & Stats */}
          <div className="order-1 lg:order-2">
            <h2 className="text-[44px] font-clash text-[#0f172a] dark:text-white leading-[1.1] mb-4">
              Ekosistem<br/>
              Pembelajaran<br/>
              Yang Kuat
            </h2>
            <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed mb-10 max-w-md">
              Platform terintegrasi yang mendukung seluruh proses pembelajaran dari perencanaan hingga evaluasi dalam satu sistem.
            </p>

            <div ref={statsSection.ref} className="space-y-4">
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#334155] flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center">
                  <Users size={28} className="anim-float" />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white text-xl">{mahasiswaCount.toLocaleString("id-ID")}+</div>
                  <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium">Mahasiswa Aktif</div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#334155] flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center">
                  <UserCheck size={28} className="anim-float" style={{animationDelay: '0.4s'}} />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white text-xl">{dosenCount}+</div>
                  <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium">Dosen Pengguna</div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#334155] flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center">
                  <BookMarked size={28} className="anim-float" style={{animationDelay: '0.8s'}} />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white text-xl">{jurnalCount.toLocaleString("id-ID")}+</div>
                  <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium">Jurnal Terkelola</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR SECTION */}
      <section id="fitur" ref={fiturRef.ref} className={cn("max-w-[1100px] mx-auto px-6 py-20 transition-all duration-700", fiturRef.visible ? "fade-in-up opacity-100" : "opacity-0")}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-3">Fitur Unggulan</h2>
          <p className="text-[#475569] dark:text-[#94a3b8] text-[15px]">Klik fitur untuk melihat informasi lengkap</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            { key: "jurnal-harian",   icon: BookOpen,      title: "Jurnal Harian",     desc: "Catat aktivitas pembelajaran harian secara terstruktur dan otomatis." },
            { key: "jurnal-dosen",    icon: BookMarked,     title: "Jurnal Dosen",      desc: "Rekap kegiatan pengajaran, pembimbingan, dan penelitian dosen." },
            { key: "jurnal-pkl",      icon: Briefcase,      title: "Jurnal PKL",        desc: "Kelola jurnal Praktik Kerja Lapangan mahasiswa secara digital." },
            { key: "tugas-online",    icon: ClipboardList,  title: "Tugas Online",      desc: "Buat, distribusikan, dan kelola tugas online dengan berbagai format." },
            { key: "kuis-interaktif", icon: Zap,            title: "Kuis Interaktif",   desc: "Kuis dengan berbagai tipe soal dan penilaian otomatis real-time." },
            { key: "panduan-pengguna",icon: HelpCircle,     title: "Panduan Pengguna",  desc: "Dokumentasi lengkap penggunaan seluruh fitur AcadTrack." },
          ] as { key: string; icon: React.ElementType; title: string; desc: string }[]).map(({ key, icon: Icon, title, desc }) => (
            <Link
              key={key}
              href={`/bantuan#${key}`}
              className="feat-card group bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-5 flex items-start gap-4 hover:border-[#2563eb]/50 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 transition-colors overflow-hidden">
                <Icon size={20} className="feat-icon text-[#2563eb]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-[#0f172a] dark:text-white mb-1 flex items-center gap-1">
                  {title}
                  <ChevronRight size={14} className="text-[#94a3b8] group-hover:text-[#2563eb] transition-colors ml-auto shrink-0" />
                </div>
                <div className="text-[12px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONI SECTION */}
      <section id="testimoni" ref={testiRef.ref} className={cn("max-w-[1100px] mx-auto px-6 py-20 transition-all duration-700", testiRef.visible ? "fade-in-up opacity-100" : "opacity-0")}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-3">Apa Kata Mereka?</h2>
          <p className="text-[#475569] dark:text-[#94a3b8] text-[15px]">Pengalaman nyata dari pengguna AcadTrack</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { initials: "EK", name: "Eki Kurniawan", role: "Mahasiswa — Teknik Informatika", stars: 5, text: "AcadTrack benar-benar membantu saya mengatur semua tugas kuliah. Fitur notifikasi deadline sangat berguna, saya tidak pernah telat lagi mengumpulkan tugas!" },
            { initials: "AR", name: "Andra Rafi Irgi", role: "Mahasiswa — Sistem Informasi", stars: 5, text: "Tugas kelompok jadi jauh lebih mudah dikoordinasikan. Bisa diskusi dan upload langsung di satu platform, tidak perlu WhatsApp sana-sini lagi." },
            { initials: "BS", name: "Dr. Budi Santoso", role: "Dosen — Analisis Sistem Informasi", stars: 5, text: "Rekap penilaian mahasiswa jadi sangat efisien. Saya bisa memantau progress seluruh kelas sekaligus dari satu dashboard yang informatif." },
            { initials: "RP", name: "Dr. Raka Pratama, M.Kom.", role: "Dosen — Wali Akademik", stars: 4, text: "Platform yang intuitif dan responsif. Fitur jurnal dosen membantu saya mendokumentasikan kegiatan mengajar dengan rapi untuk keperluan laporan BKD." },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-[#e2e8f0] dark:border-[#334155] shadow-sm flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} className={s < t.stars ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#e2e8f0] fill-[#e2e8f0]"} />
                ))}
              </div>
              <p className="text-[13.5px] text-[#475569] dark:text-[#94a3b8] leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#f1f5f9] dark:border-[#334155]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-[12px] font-bold shrink-0">{t.initials}</div>
                <div>
                  <div className="text-[13px] font-semibold text-[#0f172a] dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" ref={faqRef.ref} className={cn("max-w-[1000px] mx-auto px-6 py-20 text-center transition-all duration-700", faqRef.visible ? "fade-in-up opacity-100" : "opacity-0")}>
        <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-12">Pertanyaan Umum</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left">
          {/* Left Column */}
          <div className="space-y-4">
            {faqs.slice(0, 3).map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[15px] text-[#0f172a] dark:text-white">{faq.question}</span>
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#020817] flex items-center justify-center text-[#64748b] dark:text-[#94a3b8] shrink-0">
                    <ChevronDown size={18} className={cn("transition-transform duration-200", openFaqIndexes.has(idx) ? "rotate-180" : "")} />
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openFaqIndexes.has(idx) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-5 pt-0 text-[14px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed border-t border-[#f1f5f9] dark:border-[#334155] mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {faqs.slice(3, 5).map((faq, idx) => {
              const actualIdx = idx + 3;
              return (
                <div
                  key={actualIdx}
                  className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(actualIdx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-[15px] text-[#0f172a] dark:text-white">{faq.question}</span>
                    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#020817] flex items-center justify-center text-[#64748b] dark:text-[#94a3b8] shrink-0">
                      <ChevronDown size={18} className={cn("transition-transform duration-200", openFaqIndexes.has(actualIdx) ? "rotate-180" : "")} />
                    </div>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openFaqIndexes.has(actualIdx) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="p-5 pt-0 text-[14px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed border-t border-[#f1f5f9] dark:border-[#334155] mt-2">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}

            <a
              href="mailto:info@unpam.ac.id"
              className="w-full flex items-center justify-between p-5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-2xl transition-colors shadow-md"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} />
                <span className="font-medium text-[14px]">Kirim email untuk pertanyaan lain</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3b82f6] shrink-0">
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section id="newsletter" className="max-w-[720px] mx-auto px-6 py-10 mb-4">
        <div className="relative bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-[24px] p-10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-[50px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Send size={22} className="text-white" />
            </div>
            <h2 className="text-[26px] font-clash text-white mb-2">Tetap Update</h2>
            <p className="text-white/70 text-[14px] mb-7 max-w-sm mx-auto leading-relaxed">
              Daftar dan dapatkan pengumuman fitur terbaru, tips penggunaan, serta info akademik langsung ke email kamu.
            </p>
            {newsletterSent ? (
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-[13.5px] font-semibold px-6 py-3 rounded-full">
                <span className="text-[#4ade80]">✓</span> Terima kasih! Kamu sudah terdaftar.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Masukkan email kamu…"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full px-5 py-2.5 text-[13.5px] outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-[#1e3a8a] font-semibold px-6 py-2.5 rounded-full text-[13.5px] hover:bg-white/90 transition-colors shadow-md shrink-0"
                >
                  Daftar
                </button>
              </form>
            )}
            <p className="text-white/40 text-[11px] mt-4">Tidak ada spam. Bisa berhenti kapan saja.</p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="relative mt-20">
        <div className="absolute inset-x-0 bottom-0 top-[60%] md:top-1/2 bg-[#0f172a] z-0" />
        <section className="relative z-10 max-w-[1200px] mx-auto px-6">
          <div className="bg-[#2563eb] rounded-[24px] p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">

            <div className="relative z-10 md:w-3/5">
              <div className="inline-flex items-center gap-2 bg-white rounded-full py-1.5 px-4 mb-6 text-[#1e293b]">
                <Globe size={16} className="text-[#2563eb]" />
                <span className="text-xs font-semibold">Platform Resmi Universitas Pamulang</span>
              </div>

              <h2 className="text-[32px] md:text-[40px] font-clash text-white leading-[1.2] mb-4">
                Akses Platform<br/>Pembelajaran<br/>
                <span className="text-[#facc15]">Digital Universitas Pamulang</span>
              </h2>

              <p className="text-white/90 text-[14px] leading-relaxed mb-6 max-w-md">
                Nikmati kemudahan proses belajar mengajar dengan sistem terintegrasi yang dikhususkan untuk keluarga besar Universitas Pamulang.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white text-[13px]">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  Akses materi pembelajaran kapan saja, di mana saja
                </li>
                <li className="flex items-center gap-3 text-white text-[13px]">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  Kelola jurnal harian dengan sistem terintegrasi
                </li>
                <li className="flex items-center gap-3 text-white text-[13px]">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  Pantau perkembangan nilai secara real-time
                </li>
              </ul>

              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <button className="bg-white hover:bg-gray-50 text-[#2563eb] font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md">
                    Masuk ke Platform
                  </button>
                </Link>
                <Link href="/bantuan/panduan" className="flex items-center gap-2 text-white font-semibold text-sm hover:text-white/80 transition-colors">
                  <HelpCircle size={16} />
                  Panduan Penggunaan
                </Link>
              </div>
            </div>

            <div className="relative z-10 md:w-2/5 h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/Unpam-Victor.jpeg"
                alt="School Campus"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="bg-[#0f172a]">
        <footer className="max-w-[1200px] mx-auto px-6 pt-20 pb-6 border-t border-[#1e293b]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            {/* Column 1 — Brand */}
            <div className="md:col-span-1">
              <button
                onClick={() => setFooterModal("brand")}
                className="flex items-center mb-6 hover:opacity-75 transition-opacity"
              >
                <span className="text-[#3b82f6] font-bold text-3xl font-clash italic mr-1">S</span>
                <div className="flex flex-col leading-none">
                  <span className="text-white font-bold text-xl tracking-tight leading-none">Acad<span className="text-[#facc15]">Track</span></span>
                  <span className="text-[8px] font-semibold text-[#94a3b8]">Smart, Innovative, Future-ready</span>
                </div>
              </button>
              <p className="text-[#94a3b8] text-[13px] leading-relaxed mb-6 pr-4">
                Platform E-Learning khusus Universitas Pamulang untuk manajemen pembelajaran digital yang terintegrasi.
              </p>
              <div className="flex items-center gap-3">
                {([
                  { key: "twitter", href: "https://twitter.com", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg> },
                  { key: "instagram", href: "https://instagram.com", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                  { key: "facebook", href: "https://facebook.com", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg> },
                  { key: "youtube", href: "https://youtube.com", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg> },
                ] as { key: string; href: string; svg: React.ReactNode }[]).map(({ key, href, svg }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={FOOTER_INFO[key]?.title}
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
                {(["jurnal-harian", "jurnal-dosen", "jurnal-pkl", "tugas-online", "kuis-interaktif"] as const).map((key) => (
                  <li key={key}>
                    <Link href={`/bantuan#${key}`} className="text-[#94a3b8] hover:text-white text-[13px] transition-colors text-left hover:translate-x-1 inline-block transition-transform">
                      {FOOTER_INFO[key].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Bantuan */}
            <div>
              <h4 className="text-white font-bold text-[14px] mb-6">Bantuan</h4>
              <ul className="space-y-3">
                {(["panduan-pengguna", "faq", "video-tutorial", "blog-tips", "tentang-kami"] as const).map((key) => (
                  <li key={key}>
                    <Link href={`/bantuan#${key}`} className="text-[#94a3b8] hover:text-white text-[13px] transition-colors text-left hover:translate-x-1 inline-block transition-transform">
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
                {(["kebijakan-privasi", "syarat-ketentuan", "kebijakan-sekolah", "kontak", "statistik"] as const).map((key) => (
                  <li key={key}>
                    <Link href={`/bantuan#${key}`} className="text-[#94a3b8] hover:text-white text-[13px] transition-colors text-left hover:translate-x-1 inline-block transition-transform">
                      {FOOTER_INFO[key].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-[#64748b] text-[12px]">Hak Cipta Dilindungi • AcadTrack Universitas Pamulang © 2026</p>
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
                <p className="text-[#64748b] text-[12px]">{FOOTER_INFO[footerModal].extra}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
