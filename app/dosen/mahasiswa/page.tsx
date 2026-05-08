"use client";

import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import { STUDENTS, STATUS_MAP, AVG_CLS, BAR_CLS, getInitials, type Student } from "@/lib/students-data";

/* ── Per-course metadata ─────────────────────── */
type CourseCard = {
  name: string;
  icon: string;
  iconBg: string;
  accent: string;
  bar: string;
  students: Student[];
};

const COURSE_META: Record<string, { icon: string; iconBg: string; accent: string; bar: string }> = {
  "Analisis SI":                   { icon: "📊", iconBg: "bg-forest/10",  accent: "text-forest", bar: "from-forest to-teal"           },
  "Basis Data":                    { icon: "🗃️", iconBg: "bg-teal/10",    accent: "text-teal",   bar: "from-teal to-[#2a9d8f]"        },
  "PPL":                           { icon: "⚙️", iconBg: "bg-gold/10",    accent: "text-gold",   bar: "from-gold to-[#f39c12]"        },
  "Keamanan Sistem":               { icon: "🔐", iconBg: "bg-rose/10",    accent: "text-rose",   bar: "from-rose to-[#e74c3c]"        },
  "SI Enterprise":                 { icon: "🏢", iconBg: "bg-purple-500/10", accent: "text-purple-400", bar: "from-purple-500 to-purple-400" },
  "Interaksi Manusia & Komputer":  { icon: "🖥️", iconBg: "bg-[#0891b2]/10", accent: "text-[#0891b2]", bar: "from-[#0891b2] to-[#06b6d4]" },
};
const DEFAULT_META = { icon: "📚", iconBg: "bg-forest/10", accent: "text-forest", bar: "from-forest to-teal" };

/* build sorted unique course list */
const allCourseNames = [...new Set(STUDENTS.flatMap(s => s.courses))].sort();
const COURSE_CARDS: CourseCard[] = allCourseNames.map(name => ({
  name,
  ...(COURSE_META[name] ?? DEFAULT_META),
  students: STUDENTS.filter(s => s.courses.includes(name)).sort((a, b) => a.nama.localeCompare(b.nama)),
}));

const MOCK_TASKS = [
  { title: "Laporan Analisis Kebutuhan Sistem", deadline: "2026-04-10", status: "selesai",           nilai: "87" },
  { title: "ERD Database & Relasi Tabel",       deadline: "2026-04-20", status: "sedang dikerjakan", nilai: "-"  },
  { title: "Desain UI/UX Prototype Aplikasi",   deadline: "2026-05-01", status: "belum mulai",       nilai: "-"  },
];
const STATUS_CLS: Record<string, string> = {
  "selesai":           "bg-forest/10 text-forest",
  "sedang dikerjakan": "bg-teal/10 text-teal",
  "belum mulai":       "bg-border text-muted",
};

function StudentDetailPanel({ student, onClose }: { student: Student; onClose: () => void }) {
  const st = STATUS_MAP[student.status];
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative bg-paper border border-border rounded-[18px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] w-full max-w-[540px] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${student.avatarGrad} flex items-center justify-center text-[15px] font-bold text-white shrink-0`}>
            {getInitials(student.nama)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-ink text-[15px]">{student.nama}</div>
            <div className="text-[12px] text-muted mt-0.5">NIM {student.nim} · Angkatan {student.angkatan}</div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink p-1.5 rounded-lg hover:bg-cream transition-colors">
            <X size={16} />
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-border">
          <div className="bg-cream rounded-xl py-3 text-center">
            <div className="font-serif text-[22px] text-forest">{student.done}/{student.total}</div>
            <div className="text-[10px] text-muted mt-0.5">Tugas Selesai</div>
          </div>
          <div className="bg-cream rounded-xl py-3 text-center">
            <div className={`font-serif text-[22px] ${AVG_CLS[student.status]}`}>{student.avg.toFixed(1)}</div>
            <div className="text-[10px] text-muted mt-0.5">Rata-rata Nilai</div>
          </div>
          <div className="bg-cream rounded-xl py-3 text-center">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
            <div className="text-[10px] text-muted mt-1.5">Status</div>
          </div>
        </div>
        {/* Tugas list */}
        <div className="px-6 py-4">
          <div className="text-[11px] text-muted uppercase tracking-wider mb-3">Riwayat Tugas (Preview)</div>
          <div className="flex flex-col gap-2">
            {MOCK_TASKS.map((t, i) => (
              <div key={i} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-ink truncate">{t.title}</div>
                  <div className="text-[11px] text-muted mt-0.5">Deadline: {t.deadline}</div>
                </div>
                <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_CLS[t.status] ?? "bg-border text-muted"}`}>
                  {t.status}
                </span>
                {t.nilai !== "-" && (
                  <span className="font-mono text-[12px] font-semibold text-forest w-8 text-right">{t.nilai}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border">
          <button onClick={onClose} className="w-full bg-cream border border-border text-ink py-2 rounded-lg text-[13px] font-semibold hover:bg-cream-2 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal ───────────────────────────────────── */
function CourseStudentModal({ card, onClose }: { card: CourseCard; onClose: () => void }) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const avgGrade   = (card.students.reduce((a, s) => a + s.avg, 0) / card.students.length).toFixed(1);
  const totalDone  = card.students.reduce((a, s) => a + s.done, 0);
  const totalTasks = card.students.reduce((a, s) => a + s.total, 0);
  const needAttn   = card.students.filter(s => s.status === "perlu_perhatian").length;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />

      <div className="relative bg-paper border border-border rounded-[18px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] w-full max-w-[1100px] max-h-[82vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center text-[22px] shrink-0`}>
                {card.icon}
              </div>
              <div>
                <div className="text-[17px] font-bold text-ink">{card.name}</div>
                <div className="text-[12px] text-muted mt-0.5">{card.students.length} mahasiswa terdaftar</div>
              </div>
            </div>
            <button onClick={onClose} className="text-muted hover:text-ink p-1.5 hover:bg-cream rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Mahasiswa",       val: card.students.length, accent: card.accent },
              { label: "Rata-rata Nilai", val: avgGrade,             accent: card.accent },
              { label: "Tugas Selesai",   val: `${totalDone}/${totalTasks}`, accent: "text-teal" },
              { label: "Perlu Perhatian", val: needAttn,             accent: "text-rose"  },
            ].map((s, i) => (
              <div key={i} className="bg-cream rounded-xl px-3 py-2.5 text-center">
                <div className={`font-serif text-[20px] leading-none ${s.accent}`}>{s.val}</div>
                <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedStudent && (
          <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm">
              <tr>
                {["Mahasiswa", "NIM", "Angkatan", "Mata Kuliah", "Tugas Selesai", "Rata-rata Nilai", "Status", ""].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-[10.5px] font-semibold text-muted uppercase tracking-[0.06em] border-b border-border/60 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {card.students.map(s => {
                const st  = STATUS_MAP[s.status];
                const pct = Math.round((s.done / s.total) * 100);
                return (
                  <tr key={s.nim} onClick={() => setSelectedStudent(s)} className="border-b border-border/50 last:border-0 hover:bg-forest/[0.03] transition-colors cursor-pointer group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.avatarGrad} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                          {getInitials(s.nama)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-ink whitespace-nowrap">{s.nama}</div>
                          <div className="text-[11px] text-muted truncate max-w-[180px]">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[12px] text-muted whitespace-nowrap">{s.nim}</td>
                    <td className="py-3.5 px-4 text-[12px] text-muted whitespace-nowrap">{s.angkatan}</td>
                    <td className="py-3.5 px-4 text-[12px] text-muted max-w-[160px]">
                      <span className="line-clamp-2 leading-snug">{s.coursesLabel}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-cream-2 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${BAR_CLS[s.status]} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-mono text-[12px] text-ink-2">{s.done}/{s.total}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono text-[14px] font-semibold whitespace-nowrap ${AVG_CLS[s.status]}`}>
                      {s.avg.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="py-3.5 px-2 text-muted">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────── */
export default function DosenMahasiswaPage() {
  const topbarQ                          = useSearch();
  const [selected, setSelected]          = useState<CourseCard | null>(null);
  const [showNeedAttention, setShowNeedAttention] = useState(false);

  const totalStudents = STUDENTS.length;
  const avgAll        = (STUDENTS.reduce((a, s) => a + s.avg, 0) / totalStudents).toFixed(1);
  const needAttention = STUDENTS.filter(s => s.status === "perlu_perhatian").length;
  const topStudent    = [...STUDENTS].sort((a, b) => b.avg - a.avg)[0];

  const filteredCards = (topbarQ
    ? COURSE_CARDS.filter(c => c.name.toLowerCase().includes(topbarQ.toLowerCase()))
    : COURSE_CARDS
  ).filter(c => !showNeedAttention || c.students.some(s => s.status === "perlu_perhatian"));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[24px] text-ink">Data Mahasiswa</div>
        </div>
        <button className="bg-paper text-ink-2 border-[1.5px] border-border hover:text-forest hover:border-forest px-4 py-2 rounded-lg text-[13px] font-semibold transition-all">
          📊 Ekspor Excel
        </button>
      </div>

      {/* MINI STATS */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Mahasiswa",   val: totalStudents,  icon: "🎓", accent: "text-forest", bg: "bg-forest/8" },
          { label: "Rata-rata Nilai",   val: avgAll,         icon: "⭐", accent: "text-gold",   bg: "bg-gold/8"   },
          { label: "Perlu Perhatian",   val: needAttention,  icon: "⚠️", accent: "text-rose",   bg: "bg-rose/8"   },
          { label: "Nilai Tertinggi",   val: topStudent.avg, icon: "🏆", accent: "text-teal",   bg: "bg-teal/8"   },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border border-border/60 rounded-xl px-4 py-3 flex items-center gap-3`}>
            <span className="text-[22px]">{s.icon}</span>
            <div>
              <div className={`font-serif text-[24px] leading-none ${s.accent}`}>{s.val}</div>
              <div className="text-[11px] text-muted mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER CHIP */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowNeedAttention(v => !v)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-medium border-[1.5px] transition-all ${
            showNeedAttention
              ? "bg-rose/10 text-rose border-rose/40"
              : "bg-paper text-muted border-border hover:border-rose/40 hover:text-rose"
          }`}
        >
          ⚠️ Perlu Perhatian
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${showNeedAttention ? "bg-rose/20 text-rose" : "bg-border text-muted"}`}>
            {needAttention}
          </span>
        </button>
        {showNeedAttention && (
          <span className="text-[12px] text-muted">Menampilkan mata kuliah dengan mahasiswa yang perlu perhatian</span>
        )}
      </div>

      {/* COURSE CARDS */}
      <div className="grid grid-cols-3 gap-4">
        {filteredCards.map((card, idx) => {
          const avgGrade  = (card.students.reduce((a, s) => a + s.avg, 0) / card.students.length).toFixed(1);
          const avgDone   = Math.round(card.students.reduce((a, s) => a + (s.done / s.total) * 100, 0) / card.students.length);
          const needAttn  = card.students.filter(s => s.status === "perlu_perhatian").length;

          return (
            <div
              key={idx}
              onClick={() => setSelected(card)}
              className="bg-paper border-[1.5px] border-border rounded-[14px] p-5 shadow-[0_1px_6px_rgba(26,26,20,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,26,20,0.12)] transition-all duration-200 cursor-pointer"
            >
              <div className="flex gap-3 items-start mb-4">
                <div className={`w-[42px] h-[42px] rounded-xl ${card.iconBg} flex items-center justify-center text-[22px] shrink-0`}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink text-[15px] leading-snug">{card.name}</div>
                  <div className="text-[11px] text-muted mt-0.5">{card.students.length} mahasiswa</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {[
                  { label: "Mahasiswa",     val: card.students.length },
                  { label: "Rata-rata",     val: avgGrade             },
                  { label: "Perlu Atensi",  val: needAttn             },
                ].map((stat, i) => (
                  <div key={i} className="bg-cream rounded-lg py-2 px-1">
                    <div className={`font-serif text-[18px] leading-none ${i === 2 && needAttn > 0 ? "text-rose" : card.accent}`}>
                      {stat.val}
                    </div>
                    <div className="text-[10px] text-muted mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-muted mb-1.5">Klik untuk lihat daftar mahasiswa</div>
              <div className="w-full h-1.5 bg-cream-2 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${card.bar} rounded-full`} style={{ width: `${avgDone}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="bg-paper border border-border rounded-[14px] p-12 text-center text-muted">
          Tidak ada mata kuliah cocok dengan &quot;{topbarQ}&quot;.
        </div>
      )}

      {selected && (
        <CourseStudentModal card={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
