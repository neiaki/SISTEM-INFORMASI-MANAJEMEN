"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";

const testimonials = [
  {
    initials: "EK",
    name: "Febiyanto Rizki Qurbandi",
    role: "Mahasiswa — Teknik Informatika, Semester 5",
    stars: 5,
    text: "Deadline UTS Pemrograman Web tinggal 2 jam. Saya langsung buka AcadTrack, upload file ZIP-nya, tulis komentar singkat — selesai dalam 3 menit. Tidak perlu email dosen atau cari grup WA kelas.",
  },
  {
    initials: "AR",
    name: "Andra Rafi Irgi",
    role: "Mahasiswa — Sistem Informasi, Semester 6",
    stars: 5,
    text: "Proyek akhir kelompok kami berisi 5 orang. Dulu koordinasi lewat WA berantakan. Sekarang kami buat proyek di AcadTrack, bagi tugas per anggota, dan semua update terlihat di satu tempat.",
  },
  {
    initials: "BS",
    name: "Dr. Budi Santoso",
    role: "Dosen — Analisis Sistem Informasi",
    stars: 5,
    text: "Biasanya saya harus tanya satu per satu ke mahasiswa soal pengumpulan. Sekarang buka AcadTrack, halaman Rekap langsung menunjukkan siapa sudah dan belum kumpul — lengkap dengan timestamp dan file-nya.",
  },
  {
    initials: "RP",
    name: "Dr. Raka Pratama, M.Kom.",
    role: "Dosen — Wali Akademik, 3 Mata Kuliah",
    stars: 4,
    text: "Sebelum ada AcadTrack, feedback ke mahasiswa lewat email satu per satu. Sekarang buka submission, baca file, langsung tulis komentar di platform. Mahasiswa bisa baca dan balas komentar saya langsung.",
  },
];

const CAROUSEL_ITEMS = testimonials.length;

export function TestimoniSection() {
  const testiRef = useInView();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    if (carouselPaused) return;
    const t = setInterval(
      () => setCarouselIdx((i) => (i + 1) % CAROUSEL_ITEMS),
      4000
    );
    return () => clearInterval(t);
  }, [carouselPaused]);

  const t = testimonials[carouselIdx];

  return (
    <section
      id="testimoni"
      ref={testiRef.ref}
      className={cn(
        "max-w-[700px] mx-auto px-6 py-20 transition-all duration-700",
        testiRef.visible ? "fade-in-up opacity-100" : "opacity-0"
      )}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white mb-3">
          Apa Kata Mereka?
        </h2>
        <p className="text-[#475569] dark:text-[#94a3b8] text-[15px]">
          Skenario nyata dari pengguna AcadTrack
        </p>
      </div>
      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Testimoni pengguna AcadTrack"
        className="relative"
        onMouseEnter={() => setCarouselPaused(true)}
        onMouseLeave={() => setCarouselPaused(false)}
      >
        <div
          key={carouselIdx}
          className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 border border-[#e2e8f0] dark:border-[#334155] shadow-sm flex flex-col gap-5"
          style={{ animation: "fadeInUp 0.4s ease forwards" }}
        >
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                size={16}
                className={
                  s < t.stars
                    ? "text-[#f59e0b] fill-[#f59e0b]"
                    : "text-[#e2e8f0] fill-[#e2e8f0]"
                }
              />
            ))}
          </div>
          <p className="text-[15px] text-[#475569] dark:text-[#94a3b8] leading-relaxed">
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="flex items-center gap-3 pt-3 border-t border-[#f1f5f9] dark:border-[#334155]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
              {t.initials}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#0f172a] dark:text-white">
                {t.name}
              </div>
              <div className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                {t.role}
              </div>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCarouselIdx(i);
                setCarouselPaused(true);
                setTimeout(() => setCarouselPaused(false), 6000);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === carouselIdx
                  ? "w-6 h-2.5 bg-[#2563eb]"
                  : "w-2.5 h-2.5 bg-[#cbd5e1] dark:bg-[#334155] hover:bg-[#93c5fd]"
              )}
              aria-label={`Testimoni ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
