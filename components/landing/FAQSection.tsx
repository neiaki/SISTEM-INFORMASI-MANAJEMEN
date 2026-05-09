"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";

const faqs = [
  {
    question: "Apa itu AcadTrack?",
    answer:
      "AcadTrack adalah platform manajemen tugas dan proyek perkuliahan untuk mahasiswa dan dosen Universitas Pamulang. Submit, review, rekap pengumpulan — semua dalam satu dashboard.",
  },
  {
    question: "Bagaimana mahasiswa mengumpulkan tugas?",
    answer:
      "Login ke AcadTrack, masuk ke menu Tugas, pilih tugas yang aktif, lalu upload file dan tambahkan komentar jika perlu. Status pengumpulan langsung terlihat oleh dosen secara real-time.",
  },
  {
    question: "Bagaimana dosen memberi nilai atau feedback?",
    answer:
      "Dosen membuka halaman Rekap, memilih tugas yang ingin direview, lalu dapat melihat seluruh submission mahasiswa dan memberikan komentar atau catatan penilaian langsung per submission.",
  },
  {
    question: "Apakah data pengumpulan tugas tersimpan?",
    answer:
      "Ya, semua submission dan komentar tersimpan dan dapat diakses kapan saja. Dosen dapat melihat rekap pengumpulan per tugas lengkap dengan timestamp dan komentar mahasiswa.",
  },
  {
    question: "Bisakah saya mengakses dari smartphone?",
    answer:
      "Tentu! AcadTrack dirancang responsif dan dapat diakses dari browser di smartphone, tablet, maupun komputer tanpa perlu install aplikasi tambahan.",
  },
  {
    question: "Apakah ada fitur manajemen kelompok?",
    answer:
      "Ya! Dosen dapat membuat kelompok manual atau acak otomatis (RNG fair). Mahasiswa dapat melihat anggota kelompok, mengirim undangan, dan mengelola keanggotaan dari dashboard.",
  },
];

export function FAQSection() {
  const faqRef = useInView();
  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    setOpenFaqIndexes((prev) => {
      const s = new Set(prev);
      s.has(index) ? s.delete(index) : s.add(index);
      return s;
    });
  };

  return (
    <div className="bg-white dark:bg-[#0d1117]">
      <section
        id="faq"
        ref={faqRef.ref}
        className={cn(
          "max-w-[1000px] mx-auto px-6 py-20 text-center transition-all duration-700",
          faqRef.visible ? "fade-in-up opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-4xl font-clash text-[#0f172a] dark:text-white">
            Pertanyaan Umum
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left">
          {/* Left Column — 3 items */}
          <div className="space-y-4">
            {faqs.slice(0, 3).map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[15px] text-[#0f172a] dark:text-white">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#020817] flex items-center justify-center text-[#64748b] dark:text-[#94a3b8] shrink-0">
                    <ChevronDown
                      size={18}
                      className={cn(
                        "transition-transform duration-200",
                        openFaqIndexes.has(idx) ? "rotate-180" : ""
                      )}
                    />
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openFaqIndexes.has(idx)
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-5 pt-0 text-[14px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed border-t border-[#f1f5f9] dark:border-[#334155] mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column — 3 items */}
          <div className="space-y-4">
            {faqs.slice(3).map((faq, idx) => {
              const actualIdx = idx + 3;
              return (
                <div
                  key={actualIdx}
                  className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(actualIdx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-[15px] text-[#0f172a] dark:text-white">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] dark:bg-[#020817] flex items-center justify-center text-[#64748b] dark:text-[#94a3b8] shrink-0">
                      <ChevronDown
                        size={18}
                        className={cn(
                          "transition-transform duration-200",
                          openFaqIndexes.has(actualIdx) ? "rotate-180" : ""
                        )}
                      />
                    </div>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openFaqIndexes.has(actualIdx)
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="p-5 pt-0 text-[14px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed border-t border-[#f1f5f9] dark:border-[#334155] mt-2">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA — full width below grid */}
        <div className="mt-4">
          <a
            href="mailto:info@unpam.ac.id"
            className="w-full flex items-center justify-between p-5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-2xl transition-colors shadow-md"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <span className="font-medium text-[14px]">
                Kirim email untuk pertanyaan lain
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3b82f6] shrink-0">
              <ArrowRight size={16} strokeWidth={2.5} />
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
