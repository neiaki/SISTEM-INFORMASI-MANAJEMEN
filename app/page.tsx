"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Globe,
  BookOpen,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Users,
  UserCheck,
  HelpCircle,
  Sun,
  Moon,
  MessageCircle,
  ArrowRight,
  X,
  Briefcase,
  Zap,
  ChevronRight,
  Menu,
  ArrowUp,
  Send,
  Infinity as InfinityIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimoniSection } from "@/components/landing/TestimoniSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";




export default function LandingPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroParallax, setHeroParallax] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<
    { x: number; color: string; delay: number; dur: number }[]
  >([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const heroRef  = useInView();
  const fiturRef = useInView();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const SECTION_IDS = ["fitur", "testimoni", "faq", "newsletter"];
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 10);
      setShowTop(sy > 400);
      setHeroParallax(Math.min(sy * 0.12, 50));
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        docH > 0 ? Math.min(100, Math.round((sy / docH) * 100)) : 0
      );
      setShowStickyCta(sy > 700 && sy < docH - 500);
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

  useEffect(() => {
    if (!mobileMenu) return;
    const el = mobileMenuRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenu(false);
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("keydown", onKey);
    first?.focus();
    return () => el.removeEventListener("keydown", onKey);
  }, [mobileMenu]);

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      const colors = [
        "#2563eb",
        "#f59e0b",
        "#10b981",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
      ];
      setConfettiParticles(
        Array.from({ length: 24 }, (_, i) => ({
          x: 10 + i * 3.5,
          color: colors[i % colors.length],
          delay: (i % 8) * 0.05,
          dur: 0.7 + (i % 4) * 0.1,
        }))
      );
      setNewsletterSent(true);
      setNewsletterEmail("");
      setTimeout(() => setConfettiParticles([]), 1500);
    }
  };

  const getScoreBadgeClass = (score: number) => {
    if (score > 75) return "bg-[#dcfce7] text-[#16a34a]";
    if (score >= 50) return "bg-[#fef3c7] text-[#d97706]";
    return "bg-[#fee2e2] text-[#dc2626]";
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#020817] text-[#1e293b] dark:text-[#f1f5f9] font-['Poppins',sans-serif] transition-colors duration-300 overflow-x-clip">
      {/* SCROLL PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 z-[70] h-[3px] bg-[#2563eb] transition-none pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* BACK TO TOP */}
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#2563eb] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1d4ed8] hover:scale-110 active:scale-95 transition-all btn-rpl"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* STICKY CTA BAR — mobile only */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0f172a]/95 backdrop-blur-md border-t border-white/10 px-5 py-3 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-sm">
              Mulai dengan AcadTrack
            </div>
            <div className="text-white/50 text-[11px]">
              Manajemen Tugas &amp; Proyek Kuliah
            </div>
          </div>
          <Link href="/auth/login">
            <button className="bg-[#2563eb] text-white font-semibold px-5 py-2 rounded-full text-[13px] btn-rpl">
              Masuk
            </button>
          </Link>
        </div>
      )}

      {/* HEADER */}
      <header
        className={cn(
          "px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#f4f6f8]/90 dark:bg-[#020817]/90 backdrop-blur-md transition-all duration-300 border-b border-transparent dark:border-white/10",
          scrolled &&
            "shadow-md border-b border-[#e2e8f0] dark:border-white/10 backdrop-blur-xl"
        )}
      >
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Kembali ke atas halaman"
        >
          <span className="text-[#2563eb] font-bold text-3xl font-clash italic mr-1" title="Scholar">
            S
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[#0f172a] dark:text-white font-bold text-xl tracking-tight leading-none">
              Acad<span className="text-[#f59e0b]">Track</span>
            </span>
            <span className="text-[8px] font-semibold text-[#64748b] dark:text-[#94a3b8]">
              Scholar · Academic · Tracker
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {(
            [
              { id: "fitur", label: "Fitur", visible: true },
              { id: "testimoni", label: "Testimoni", visible: true },
              { id: "faq", label: "FAQ", visible: true },
            ] as { id: string; label: string; visible: boolean }[]
          )
            .filter((n) => n.visible)
            .map(({ id, label }) => (
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
          <Link
            href="/bantuan"
            className="flex items-center gap-2 text-[#475569] dark:text-[#cbd5e1] hover:text-[#0f172a] dark:hover:text-white text-sm font-semibold transition-colors"
          >
            <HelpCircle size={18} />
            Bantuan
          </Link>
          <Link href="/auth/login">
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-md transition-colors btn-rpl">
              Masuk
            </button>
          </Link>
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label={
              resolvedTheme === "dark"
                ? "Ganti ke tema terang"
                : "Ganti ke tema gelap"
            }
            suppressHydrationWarning
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#cbd5e1] shadow-sm hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label={
              resolvedTheme === "dark"
                ? "Ganti ke tema terang"
                : "Ganti ke tema gelap"
            }
            suppressHydrationWarning
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#cbd5e1]"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>
          <button
            onClick={() => setMobileMenu(true)}
            aria-label="Buka menu navigasi"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#cbd5e1]"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenu && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-[60] flex flex-col bg-[#f4f6f8] dark:bg-[#020817]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] dark:border-white/10">
            <span className="font-bold text-lg text-[#0f172a] dark:text-white">
              Menu
            </span>
            <button
              onClick={() => setMobileMenu(false)}
              aria-label="Tutup menu"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2e8f0] dark:border-white/10 text-[#475569] dark:text-[#94a3b8]"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-6">
            {(
              [
                { href: "#fitur", label: "Fitur", visible: true },
                { href: "#testimoni", label: "Testimoni", visible: true },
                { href: "#faq", label: "FAQ", visible: true },
              ] as { href: string; label: string; visible: boolean }[]
            )
              .filter((n) => n.visible)
              .map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenu(false)}
                  className="px-4 py-3 rounded-xl text-[15px] font-semibold text-[#0f172a] dark:text-white hover:bg-[#e2e8f0] dark:hover:bg-white/10 transition-colors"
                >
                  {label}
                </a>
              ))}
            <div className="h-px bg-[#e2e8f0] dark:bg-white/10 my-2" />
            {[
              { href: "/bantuan", label: "Bantuan" },
              { href: "/bantuan/panduan", label: "Panduan Pengguna" },
              { href: "/auth/login", label: "Masuk ke Platform" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenu(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-semibold text-[#0f172a] dark:text-white hover:bg-[#e2e8f0] dark:hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* HERO SECTION */}
      <section
        ref={heroRef.ref}
        className={cn(
          "max-w-[1200px] mx-auto px-6 pt-16 pb-24 relative transition-all duration-700",
          heroRef.visible ? "fade-in-up opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
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
                href="/bantuan/panduan"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] text-[#1e3a8a] dark:text-[#60a5fa] font-semibold px-6 py-3 rounded-full transition-colors hover:shadow-md btn-rpl"
              >
                <BookOpen size={16} />
                Layanan Panduan
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-5">
              {["Tidak perlu instalasi", "Akses via browser", "Untuk Mahasiswa & Dosen Unpam"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                    <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Campus Image and Badges */}
          <div className="relative h-[500px] flex justify-center items-center">
            {/* Main Image */}
            <div
              className="relative w-[340px] h-[440px] rounded-3xl overflow-hidden shadow-2xl z-10"
              style={{
                transform: `translateY(${heroParallax}px)`,
                transition: "transform 0.1s linear",
              }}
            >
              <Image
                src="/Unpam-Victor.jpeg"
                alt="Universitas Pamulang"
                fill
                sizes="340px"
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Badge — Submit Tugas */}
            <div className="hidden sm:block absolute top-[10%] -left-[10%] z-20 anim-float">
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-gray-100 dark:border-[#334155]">
                <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white text-[15px]">
                    Submit Tugas
                  </div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8] font-medium">
                    Langsung dari dashboard
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge — GraduationCap */}
            <div
              className="hidden sm:block absolute top-[25%] -right-[5%] z-20 anim-float"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-[#2563eb] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <GraduationCap size={32} />
              </div>
            </div>

            {/* Floating Badge — All In One */}
            <div
              className="hidden sm:block absolute bottom-[15%] -right-[15%] z-20 anim-float"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl py-3 px-5 shadow-xl flex flex-col items-center justify-center border border-gray-100 dark:border-[#334155] text-center w-36">
                <div className="text-[#2563eb] mb-1">
                  <InfinityIcon size={32} strokeWidth={2.5} />
                </div>
                <div className="font-bold text-[#0f172a] dark:text-white text-[14px]">
                  All In One
                </div>
                <div className="text-[9px] text-[#64748b] dark:text-[#94a3b8] font-medium leading-tight mt-1">
                  Semua kebutuhan akademik terpusat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ECOSYSTEM SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: UI Mockup + Badges */}
          <div className="relative h-[550px] flex justify-center items-center order-2 lg:order-1">
            {/* Main card — task list mockup */}
            <div className="relative w-[340px] rounded-2xl overflow-hidden shadow-2xl border border-[#e2e8f0] dark:border-[#334155] z-10">
              <div className="bg-[#1e3a8a] px-4 py-3 flex items-center justify-between">
                <div className="text-white font-bold text-[13px] font-clash">
                  Daftar Tugas
                </div>
                <div className="text-white/70 text-[11px]">
                  Pemweb — Semester 5
                </div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] p-3 space-y-2">
                {[
                  { title: "Tugas 1 — HTML Dasar",   status: "Selesai", deadline: "3 Apr",  done: true  },
                  { title: "Tugas 2 — CSS Layout",   status: "Selesai", deadline: "10 Apr", done: true  },
                  { title: "UTS Pemrograman Web",    status: "Aktif",   deadline: "Besok",  done: false },
                  { title: "Tugas 3 — JavaScript",   status: "Aktif",   deadline: "18 Mei", done: false },
                  { title: "Proyek Akhir",           status: "Aktif",   deadline: "10 Jun", done: false },
                ].map(({ title, status, deadline, done }) => (
                  <div key={title} className="flex items-center gap-3 bg-[#f8fafc] dark:bg-[#0f172a] rounded-xl p-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#dcfce7]" : "bg-[#dbeafe]"}`}>
                      {done ? (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-[#0f172a] dark:text-white truncate">{title}</div>
                      <div className="text-[9px] text-[#64748b] dark:text-[#94a3b8]">Deadline: {deadline}</div>
                    </div>
                    <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${done ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#dbeafe] text-[#2563eb]"}`}>
                      {status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Badge — Kelompok */}
            <div className="absolute top-[-3%] -left-[12%] z-20">
              <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-center text-center w-36 border border-gray-100 dark:border-[#334155]">
                <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-xl flex items-center justify-center mb-3">
                  <Users size={24} className="anim-wiggle" />
                </div>
                <div className="font-clash text-xl font-bold text-[#0f172a] dark:text-white">
                  Kelompok
                </div>
                <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8] font-medium leading-tight mt-1">
                  Proyek tim terorganisir
                </div>
              </div>
            </div>

            {/* Floating Badge — Rekap */}
            <div className="absolute bottom-[10%] -right-[10%] z-20 w-[220px]">
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-4 border border-gray-100 dark:border-[#334155]">
                <div className="text-[#1e3a8a]">
                  <TrendingUp size={36} strokeWidth={2.5} className="anim-trend" />
                </div>
                <div>
                  <div className="font-clash text-lg font-bold text-[#0f172a] dark:text-white leading-tight">
                    Rekap Tugas
                  </div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8] font-medium">
                    Otomatis per matkul
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content & Stats */}
          <div className="order-1 lg:order-2">
            <h2 className="text-[44px] font-clash text-[#0f172a] dark:text-white leading-[1.1] mb-4">
              Ekosistem
              <br />
              Akademik
              <br />
              Yang Terpadu
            </h2>
            <p className="text-[#475569] dark:text-[#94a3b8] text-[15px] leading-relaxed mb-10 max-w-md">
              Platform terintegrasi yang menghubungkan mahasiswa dan dosen
              dalam satu sistem manajemen tugas yang efisien.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Users,
                  label: "Mahasiswa & Dosen",
                  sub: "Satu platform untuk semua peran akademik",
                },
                {
                  icon: ClipboardList,
                  label: "Tugas Terkelola",
                  sub: "Buat, distribusikan, dan pantau per mata kuliah",
                },
                {
                  icon: TrendingUp,
                  label: "Rekap Otomatis",
                  sub: "Laporan progres siap kapan saja",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#334155] flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={28} />
                  </div>
                  <div>
                    <div className="font-bold text-[#0f172a] dark:text-white text-[15px]">
                      {label}
                    </div>
                    <div className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium">
                      {sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALUR KERJA SECTION */}
      <div className="bg-white dark:bg-[#0d1117]">
        <section className="max-w-[1100px] mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-3">
              Alur Kerja Platform
            </h2>
            <p className="text-[#475569] dark:text-[#94a3b8] text-[15px]">
              Dari pembuatan tugas hingga laporan — semua otomatis
            </p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-[52px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-[2px] bg-gradient-to-r from-[#2563eb]/20 via-[#2563eb] to-[#2563eb]/20 pointer-events-none" />
            {(
              [
                {
                  step: "01",
                  icon: BookOpen,
                  title: "Dosen Buat Tugas",
                  desc: "Dosen membuat tugas baru, mengatur deadline, dan mendistribusikan ke mata kuliah yang dipilih.",
                },
                {
                  step: "02",
                  icon: ClipboardList,
                  title: "Mahasiswa Kumpulkan",
                  desc: "Mahasiswa submit file dan komentar sebelum deadline. Status pengumpulan terlihat real-time.",
                },
                {
                  step: "03",
                  icon: MessageCircle,
                  title: "Dosen Review",
                  desc: "Dosen membuka rekap, melihat seluruh submission, dan memberikan komentar atau catatan penilaian.",
                },
                {
                  step: "04",
                  icon: TrendingUp,
                  title: "Laporan Otomatis",
                  desc: "Platform merekap progres per mata kuliah secara otomatis — siap ekspor untuk keperluan akademik.",
                },
              ] as {
                step: string;
                icon: React.ElementType;
                title: string;
                desc: string;
              }[]
            ).map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-6 z-10">
                  <div className="w-[104px] h-[104px] bg-white dark:bg-[#1e293b] rounded-full flex items-center justify-center shadow-[0_0_0_8px_#eef2ff] dark:shadow-[0_0_0_8px_rgba(37,99,235,0.08)] border-2 border-[#e2e8f0] dark:border-[#334155] group-hover:border-[#2563eb]/60 transition-all duration-300">
                    <Icon size={36} className="text-[#2563eb]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#2563eb] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {step}
                  </span>
                </div>
                <h3 className="font-clash text-[17px] text-[#0f172a] dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed max-w-[180px]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FITUR SECTION */}
      <section
        id="fitur"
        ref={fiturRef.ref}
        className="max-w-[1100px] mx-auto px-6 py-20"
      >
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            fiturRef.visible ? "fade-in-up opacity-100" : "opacity-0"
          )}
        >
          <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-3">
            Fitur Unggulan
          </h2>
          <p className="text-[#475569] dark:text-[#94a3b8] text-[15px]">
            Klik fitur untuk melihat informasi lengkap
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              {
                key: "tugas-online",
                icon: ClipboardList,
                title: "Manajemen Tugas",
                desc: "Dosen buat dan kelola tugas per mata kuliah; mahasiswa lihat status, prioritas, dan deadline.",
              },
              {
                key: "jurnal-pkl",
                icon: Briefcase,
                title: "Pengumpulan File",
                desc: "Mahasiswa submit file dan komentar langsung di platform — tidak perlu email atau WhatsApp.",
              },
              {
                key: "jurnal-dosen",
                icon: MessageCircle,
                title: "Review & Komentar",
                desc: "Dosen beri komentar per submission; mahasiswa bisa melihat feedback langsung di dashboard.",
              },
              {
                key: "kuis-interaktif",
                icon: TrendingUp,
                title: "Rekap Pengumpulan",
                desc: "Dosen lihat rekap siapa sudah/belum kumpul per tugas dengan filter dan statistik lengkap.",
              },
              {
                key: "jurnal-harian",
                icon: Users,
                title: "Tugas Kelompok",
                desc: "Buat kelompok manual atau acak otomatis; anggota bisa koordinasi dan submit bersama.",
              },
              {
                key: "panduan-pengguna",
                icon: Zap,
                title: "Notifikasi Deadline",
                desc: "Reminder otomatis sebelum deadline agar tidak ada tugas yang terlewat.",
              },
            ] as {
              key: string;
              icon: React.ElementType;
              title: string;
              desc: string;
            }[]
          ).map(({ key, icon: Icon, title, desc }, idx) => (
            <Link
              key={key}
              href={`/bantuan#${key}`}
              className={cn(
                "feat-card group bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-5 flex items-start gap-4 hover:border-[#2563eb]/50 hover:shadow-md transition-all duration-500",
                fiturRef.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              )}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 transition-colors overflow-hidden">
                <Icon size={20} className="feat-icon text-[#2563eb]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-[#0f172a] dark:text-white mb-1 flex items-center gap-1">
                  {title}
                  <ChevronRight
                    size={14}
                    className="text-[#94a3b8] group-hover:text-[#2563eb] transition-colors ml-auto shrink-0"
                  />
                </div>
                <div className="text-[12px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
                  {desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UNTUK SIAPA SECTION */}
      <div className="bg-white dark:bg-[#0d1117]">
        <section className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-3">
              Untuk Siapa AcadTrack?
            </h2>
            <p className="text-[#475569] dark:text-[#94a3b8] text-[15px]">
              Platform yang dirancang untuk seluruh civitas akademika
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px] mx-auto">
            {(
              [
                {
                  icon: GraduationCap,
                  gradient: "from-[#2563eb] to-[#3b82f6]",
                  title: "Mahasiswa",
                  subtitle: "Kelola tugas kuliah lebih efektif",
                  perks: [
                    "Submit tugas & file langsung dari dashboard",
                    "Pantau deadline dan status pengumpulan",
                    "Koordinasi proyek kelompok dengan mudah",
                    "Lihat komentar & feedback dosen real-time",
                  ],
                },
                {
                  icon: UserCheck,
                  gradient: "from-[#059669] to-[#10b981]",
                  title: "Dosen",
                  subtitle: "Manajemen kelas yang terorganisir",
                  perks: [
                    "Buat & distribusikan tugas ke mata kuliah",
                    "Rekap pengumpulan otomatis per tugas",
                    "Beri komentar dan review submission",
                    "Kelola kelompok mahasiswa dengan RNG fair",
                  ],
                },
              ] as {
                icon: React.ElementType;
                gradient: string;
                title: string;
                subtitle: string;
                perks: string[];
              }[]
            ).map(({ icon: Icon, gradient, title, subtitle, perks }) => (
              <div
                key={title}
                className="group bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-7 hover:shadow-xl flex flex-col transition-shadow"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}
                >
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-clash text-[#0f172a] dark:text-white mb-1">
                  {title}
                </h3>
                <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mb-5">
                  {subtitle}
                </p>
                <ul className="space-y-2.5 flex-1">
                  {perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-[13px] text-[#475569] dark:text-[#94a3b8]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#dcfce7] dark:bg-green-950/50 flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          width="8"
                          height="6"
                          viewBox="0 0 8 6"
                          fill="none"
                        >
                          <path
                            d="M1 3L3 5L7 1"
                            stroke="#16a34a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/auth/login?role=${title.toLowerCase()}`}
                  className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#2563eb] hover:gap-3 transition-all"
                >
                  Masuk sebagai {title}{" "}
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* TESTIMONI SECTION */}
      <TestimoniSection />

      {/* FAQ SECTION */}
      <FAQSection />

      {/* NEWSLETTER SECTION */}
      <section id="newsletter" className="max-w-[720px] mx-auto px-6 py-10 mb-4">
        <div className="relative bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-[24px] p-10 text-center overflow-hidden">
          {confettiParticles.map((p, i) => (
            <div
              key={i}
              className="confetti-p"
              style={{
                left: `${p.x}%`,
                top: "30%",
                background: p.color,
                animationName: "confetti-fall",
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                animationFillMode: "forwards",
              }}
            />
          ))}
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Send size={22} className="text-white" />
            </div>
            <h2 className="text-[26px] font-clash text-white mb-2">
              Tetap Update
            </h2>
            <p className="text-white/70 text-[14px] mb-7 max-w-sm mx-auto leading-relaxed">
              Daftar dan dapatkan pengumuman fitur terbaru, tips penggunaan,
              serta info akademik langsung ke email kamu.
            </p>
            {newsletterSent ? (
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-[13.5px] font-semibold px-6 py-3 rounded-full">
                <span className="text-[#4ade80]">✓</span> Terima kasih! Kamu
                sudah terdaftar.
              </div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
	                  onChange={(e) => setNewsletterEmail(e.target.value)}
	                  placeholder="Masukkan email kamu…"
	                  suppressHydrationWarning
	                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full px-5 py-2.5 text-[13.5px] outline-none focus:border-white/50 transition-colors"
	                />
                <button
                  type="submit"
                  className="bg-white text-[#1e3a8a] font-semibold px-6 py-2.5 rounded-full text-[13.5px] hover:bg-white/90 transition-colors shadow-md shrink-0 btn-rpl"
                >
                  Daftar
                </button>
              </form>
            )}
            <p className="text-white/40 text-[11px] mt-4">
              Tidak ada spam. Bisa berhenti kapan saja.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="relative mt-20">
        <div className="absolute inset-x-0 bottom-0 top-[60%] md:top-1/2 bg-[#0f172a] z-0" />
        <section className="relative z-10 max-w-[1200px] mx-auto px-6">
          <div className="bg-[#2563eb] rounded-[24px] p-12 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
            <div className="relative z-10 md:w-1/2">
              <div className="inline-flex items-center gap-2 bg-white rounded-full py-1.5 px-4 mb-7 text-[#1e293b]">
                <Globe size={16} className="text-[#2563eb]" />
                <span className="text-xs font-semibold">
                  Manajemen Tugas &amp; Proyek Kuliah
                </span>
              </div>

              <h2 className="text-[32px] md:text-[40px] font-clash text-white leading-[1.2] mb-6">
                Mulai Kelola Tugas
                <br />
                &amp; Proyek Kuliah
                <br />
                <span className="text-[#facc15]">Dengan AcadTrack</span>
              </h2>

              <p className="text-white/90 text-[14px] leading-relaxed mb-7 max-w-md">
                Platform manajemen tugas terintegrasi untuk mahasiswa dan dosen
                Universitas Pamulang — submit, review, dan rekap dalam satu
                tempat.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white text-[13px]">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
                  Submit tugas dan file langsung dari dashboard
                </li>
                <li className="flex items-center gap-3 text-white text-[13px]">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
                  Rekap pengumpulan otomatis per mata kuliah
                </li>
                <li className="flex items-center gap-3 text-white text-[13px]">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
                  Kelola kelompok dan proyek dengan mudah
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/auth/login">
                  <button className="bg-white hover:bg-gray-50 text-[#2563eb] font-semibold px-7 py-3 rounded-full text-sm transition-colors shadow-md flex items-center gap-2 btn-rpl">
                    <Zap size={15} />
                    Masuk ke Platform
                  </button>
                </Link>
                <Link href="/bantuan/panduan">
                  <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors flex items-center gap-2 btn-rpl">
                    <BookOpen size={15} />
                    Layanan Panduan
                  </button>
                </Link>
              </div>
            </div>

            {/* Daftar Tugas mockup */}
            <div className="relative z-10 md:w-[44%] w-full hidden md:flex items-center justify-center py-6">
              <div className="w-full max-w-[500px] rounded-[18px] overflow-hidden shadow-2xl border border-white/10">
                <div className="bg-[#1e3a8a] px-5 py-5 flex items-center justify-between">
                  <div className="text-white font-bold text-[17px] font-clash">
                    Daftar Tugas
                  </div>
                  <div className="text-white/70 text-[14px]">
                    Pemweb — Semester 5
                  </div>
                </div>
                <div className="bg-[#1e293b] p-4 space-y-3">
                  {[
                    { title: "Tugas 1 — HTML Dasar", score: 88, graded: true },
                    { title: "Tugas 2 — CSS Layout", score: 76, graded: true },
                    { title: "UTS Pemrograman Web", score: 72, graded: true },
                    { title: "Tugas 3 — JavaScript", score: 48, graded: true },
                    { title: "Proyek Akhir", score: null, graded: false },
                  ].map(({ title, score, graded }) => (
                    <div key={title} className="flex items-center gap-4 rounded-xl bg-[#0f172a] px-4 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${graded ? "bg-[#dcfce7]" : "bg-[#dbeafe]"}`}>
                        {graded ? (
                          <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true">
                            <path d="M1 5L4.5 8.5L11 1" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#2563eb]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[15px] font-semibold text-white">{title}</div>
                      </div>
                      <div className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] font-semibold ${score !== null ? getScoreBadgeClass(score) : "bg-[#334155] text-[#94a3b8]"}`}>
                          {score !== null ? score : "—"}
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
