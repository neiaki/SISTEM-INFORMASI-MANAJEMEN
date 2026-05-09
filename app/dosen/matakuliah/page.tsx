"use client";

import React, { useState } from "react";
import { X, User, CheckCircle2, Clock, AlertCircle, Paperclip, MessageSquare } from "lucide-react";

/* ── Types ───────────────────────────────────── */
type TaskStatus = "selesai" | "sedang dikerjakan" | "menunggu review" | "belum mulai";

type SubmissionComment = { author: string; role: "dosen" | "mahasiswa"; text: string; time: string };

type TaskSubmission = {
  nim: string;
  nama: string;
  kelompok?: string;
  submittedAt?: string;
  fileName?: string;
  nilai?: number;
  comments?: SubmissionComment[];
};

type CourseTask = {
  id: string; title: string; deadline: string;
  type: "individu" | "kelompok";
  submissions: TaskSubmission[];
};

type StudentEnrollment = { nim: string; nama: string; statuses: Record<string, TaskStatus> };

type Course = {
  icon: string; name: string; code: string; semester: string; sks: string;
  students: number; progress: number;
  accent: string; iconBg: string; bar: string;
  tasks: CourseTask[];
  enrollment: StudentEnrollment[];
};

/* ── Style helpers ───────────────────────────── */
const STATUS_CLS: Record<string, string> = {
  "selesai":           "bg-green-500/15 text-green-400",
  "sedang dikerjakan": "bg-teal/15 text-teal",
  "menunggu review":   "bg-purple-400/15 text-purple-400",
  "belum mulai":       "bg-ink-2/15 text-muted",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  "selesai":           <CheckCircle2 size={10} />,
  "sedang dikerjakan": <Clock size={10} />,
  "menunggu review":   <Clock size={10} />,
  "belum mulai":       <AlertCircle size={10} />,
};

const AVATAR_GRADIENTS = [
  "from-forest to-teal", "from-teal to-[#2a9d8f]", "from-gold to-[#f39c12]",
  "from-rose to-[#e74c3c]", "from-forest to-gold", "from-teal to-rose",
  "from-purple-500 to-rose", "from-forest to-purple-500",
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

/* ── Mock data ───────────────────────────────── */
const COURSES: Course[] = [
  {
    icon: "💻", name: "Pemrograman Lanjut", code: "IF3204",
    semester: "Semester 4", sks: "3 SKS",
    students: 36, progress: 78,
    accent: "text-forest", iconBg: "bg-forest/10", bar: "from-forest to-teal",
    tasks: [
      {
        id: "pl-1", title: "Implementasi OOP", deadline: "2026-04-10", type: "individu",
        submissions: [
          { nim: "221011400114", nama: "ALDI AL KAHFI",      submittedAt: "10 Apr 2026, 14.30 WIB", fileName: "oop-aldi.zip",        nilai: 88,
            comments: [{ author: "Dr. Budi", role: "dosen", text: "Bagus, tapi encapsulation perlu diperbaiki.", time: "11 Apr, 09.15" }] },
          { nim: "231011450403", nama: "ANDRA RAFI IRGI",    submittedAt: "10 Apr 2026, 23.55 WIB", fileName: "tugas1-andra.pdf" },
          { nim: "231011400651", nama: "BAGUS ICHA SAPUTRA", submittedAt: "09 Apr 2026, 22.10 WIB", fileName: "oop-bagus.zip",        nilai: 92 },
          { nim: "231011450408", nama: "DESTRAN ZAKIAN",     submittedAt: "10 Apr 2026, 11.00 WIB", fileName: "implementasi-oop.zip", nilai: 85 },
          { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",      submittedAt: "08 Apr 2026, 16.45 WIB", fileName: "oop-eki.pdf",          nilai: 95,
            comments: [
              { author: "Dr. Budi",     role: "dosen",     text: "Sangat baik! Polymorphism diimplementasikan dengan benar.", time: "09 Apr, 08.00" },
              { author: "FEBIYANTO RIZKI QURBANDI", role: "mahasiswa", text: "Terima kasih pak, akan saya perbaiki bagian inheritance.", time: "09 Apr, 09.30" },
            ] },
          { nim: "231011450319", nama: "FAJAR NUGRAHA",      submittedAt: "10 Apr 2026, 09.30 WIB", fileName: "tugas-oop-fajar.zip",
            comments: [{ author: "Dr. Budi", role: "dosen", text: "Sudah dikumpul, tunggu review.", time: "11 Apr, 10.00" }] },
          { nim: "231011400835", nama: "GILANG RAMADHAN",    submittedAt: "10 Apr 2026, 23.59 WIB", fileName: "oop-gilang.pdf" },
        ],
      },
      {
        id: "pl-2", title: "Design Pattern", deadline: "2026-04-28", type: "individu",
        submissions: [
          { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI", submittedAt: "26 Apr 2026, 15.00 WIB", fileName: "design-pattern-eki.pdf", nilai: 90 },
          { nim: "231011450319", nama: "FAJAR NUGRAHA", submittedAt: "27 Apr 2026, 20.00 WIB", fileName: "dp-fajar.zip" },
        ],
      },
      { id: "pl-3", title: "Thread & Concurrency",   deadline: "2026-05-05", type: "individu",  submissions: [] },
      { id: "pl-4", title: "Generics & Collections", deadline: "2026-05-12", type: "individu",  submissions: [] },
      { id: "pl-5", title: "Exception Handling",     deadline: "2026-05-19", type: "individu",  submissions: [] },
      {
        id: "pl-6", title: "Mini Project Final", deadline: "2026-06-01", type: "kelompok",
        submissions: [
          { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI", kelompok: "Kelompok Alfa", submittedAt: "01 Jun 2026, 10.00 WIB", fileName: "miniproject-alfa.zip" },
          { nim: "231011400651", nama: "BAGUS ICHA SAPUTRA", kelompok: "Kelompok Beta", submittedAt: "31 Mei 2026, 23.00 WIB", fileName: "miniproject-beta.zip" },
        ],
      },
    ],
    enrollment: [
      { nim: "221011400114", nama: "ALDI AL KAHFI",      statuses: { "pl-1": "selesai", "pl-2": "sedang dikerjakan", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "belum mulai" } },
      { nim: "231011450403", nama: "ANDRA RAFI IRGI",    statuses: { "pl-1": "menunggu review", "pl-2": "belum mulai", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "belum mulai" } },
      { nim: "231011400651", nama: "BAGUS ICHA SAPUTRA", statuses: { "pl-1": "selesai", "pl-2": "sedang dikerjakan", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "sedang dikerjakan" } },
      { nim: "231011450408", nama: "DESTRAN ZAKIAN",     statuses: { "pl-1": "selesai", "pl-2": "belum mulai", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "belum mulai" } },
      { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",      statuses: { "pl-1": "selesai", "pl-2": "selesai", "pl-3": "sedang dikerjakan", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "sedang dikerjakan" } },
      { nim: "231011450319", nama: "FAJAR NUGRAHA",      statuses: { "pl-1": "selesai", "pl-2": "menunggu review", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "belum mulai" } },
      { nim: "231011400835", nama: "GILANG RAMADHAN",    statuses: { "pl-1": "selesai", "pl-2": "sedang dikerjakan", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "sedang dikerjakan" } },
      { nim: "221011400227", nama: "HENDRA SAPUTRA",     statuses: { "pl-1": "belum mulai", "pl-2": "belum mulai", "pl-3": "belum mulai", "pl-4": "belum mulai", "pl-5": "belum mulai", "pl-6": "belum mulai" } },
    ],
  },
  {
    icon: "🗃️", name: "Basis Data", code: "IF3106",
    semester: "Semester 4", sks: "3 SKS",
    students: 40, progress: 55,
    accent: "text-teal", iconBg: "bg-teal/10", bar: "from-teal to-[#2a9d8f]",
    tasks: [
      {
        id: "bd-1", title: "ERD Sistem Akademik", deadline: "2026-04-15", type: "individu",
        submissions: [
          { nim: "221011400114", nama: "ALDI AL KAHFI",      submittedAt: "14 Apr 2026, 20.00 WIB", fileName: "erd-aldi.pdf",   nilai: 78 },
          { nim: "231011450408", nama: "DESTRAN ZAKIAN",     submittedAt: "15 Apr 2026, 08.30 WIB", fileName: "erd-destran.pdf", nilai: 82 },
          { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",      submittedAt: "13 Apr 2026, 14.00 WIB", fileName: "erd-eki.pdf",    nilai: 91,
            comments: [{ author: "Dr. Sari", role: "dosen", text: "ERD sudah bagus, relasi many-to-many perlu cardinalitynya.", time: "14 Apr, 09.00" }] },
          { nim: "231011450319", nama: "FAJAR NUGRAHA",      submittedAt: "15 Apr 2026, 11.00 WIB", fileName: "erd-fajar.pdf" },
          { nim: "231011400835", nama: "GILANG RAMADHAN",    submittedAt: "14 Apr 2026, 18.45 WIB", fileName: "erd-gilang.pdf", nilai: 75 },
        ],
      },
      { id: "bd-2", title: "Normalisasi 3NF",    deadline: "2026-04-30", type: "individu", submissions: [
        { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI", submittedAt: "28 Apr 2026, 13.00 WIB", fileName: "normalisasi-eki.pdf", nilai: 88 },
        { nim: "231011450408", nama: "DESTRAN ZAKIAN", submittedAt: "29 Apr 2026, 22.00 WIB", fileName: "3nf-destran.pdf" },
      ]},
      { id: "bd-3", title: "Query SQL Lanjutan", deadline: "2026-05-07", type: "individu", submissions: [] },
      { id: "bd-4", title: "Stored Procedure",   deadline: "2026-05-14", type: "individu", submissions: [] },
      { id: "bd-5", title: "Optimasi Indeks",    deadline: "2026-05-28", type: "kelompok", submissions: [] },
    ],
    enrollment: [
      { nim: "221011400114", nama: "ALDI AL KAHFI",      statuses: { "bd-1": "selesai", "bd-2": "sedang dikerjakan", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "231011450403", nama: "ANDRA RAFI IRGI",    statuses: { "bd-1": "sedang dikerjakan", "bd-2": "belum mulai", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "231011400651", nama: "BAGUS ICHA SAPUTRA", statuses: { "bd-1": "menunggu review", "bd-2": "belum mulai", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "231011450408", nama: "DESTRAN ZAKIAN",     statuses: { "bd-1": "selesai", "bd-2": "sedang dikerjakan", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",      statuses: { "bd-1": "selesai", "bd-2": "selesai", "bd-3": "sedang dikerjakan", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "231011450319", nama: "FAJAR NUGRAHA",      statuses: { "bd-1": "selesai", "bd-2": "menunggu review", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "231011400835", nama: "GILANG RAMADHAN",    statuses: { "bd-1": "selesai", "bd-2": "sedang dikerjakan", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
      { nim: "221011400308", nama: "LUTHFI HAKIM",       statuses: { "bd-1": "belum mulai", "bd-2": "belum mulai", "bd-3": "belum mulai", "bd-4": "belum mulai", "bd-5": "belum mulai" } },
    ],
  },
  {
    icon: "⚙️", name: "Rekayasa Perangkat Lunak", code: "IF3308",
    semester: "Semester 5", sks: "3 SKS",
    students: 38, progress: 37,
    accent: "text-gold", iconBg: "bg-gold/10", bar: "from-gold to-[#f39c12]",
    tasks: [
      { id: "rpl-1", title: "Sprint Planning", deadline: "2026-04-25", type: "kelompok", submissions: [
        { nim: "231011400835", nama: "GILANG RAMADHAN", kelompok: "Kelompok A", submittedAt: "24 Apr 2026, 17.00 WIB", fileName: "sprint-plan-a.pdf", nilai: 87,
          comments: [{ author: "Dr. Rina", role: "dosen", text: "Sprint goal sudah jelas, backlog perlu diprioritaskan.", time: "25 Apr, 10.00" }] },
      ]},
      { id: "rpl-2", title: "Review Kode",     deadline: "2026-05-05", type: "individu", submissions: [] },
      { id: "rpl-3", title: "Testing & QA",    deadline: "2026-05-15", type: "kelompok", submissions: [] },
      { id: "rpl-4", title: "Dokumentasi SRS", deadline: "2026-05-25", type: "individu", submissions: [] },
    ],
    enrollment: [
      { nim: "231011450408", nama: "DESTRAN ZAKIAN",  statuses: { "rpl-1": "sedang dikerjakan", "rpl-2": "belum mulai", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
      { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",   statuses: { "rpl-1": "belum mulai",        "rpl-2": "belum mulai", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
      { nim: "231011450319", nama: "FAJAR NUGRAHA",   statuses: { "rpl-1": "sedang dikerjakan",  "rpl-2": "belum mulai", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
      { nim: "231011400835", nama: "GILANG RAMADHAN", statuses: { "rpl-1": "selesai",            "rpl-2": "sedang dikerjakan", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
      { nim: "221011400227", nama: "HENDRA SAPUTRA",  statuses: { "rpl-1": "belum mulai",        "rpl-2": "belum mulai", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
      { nim: "231011450512", nama: "INDRA PERMANA",   statuses: { "rpl-1": "sedang dikerjakan",  "rpl-2": "belum mulai", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
      { nim: "231011400943", nama: "JOKO SANTOSO",    statuses: { "rpl-1": "belum mulai",        "rpl-2": "belum mulai", "rpl-3": "belum mulai", "rpl-4": "belum mulai" } },
    ],
  },
  {
    icon: "🔐", name: "Keamanan Sistem Informasi", code: "IF3410",
    semester: "Semester 6", sks: "2 SKS",
    students: 42, progress: 19,
    accent: "text-rose", iconBg: "bg-rose/10", bar: "from-rose to-[#e74c3c]",
    tasks: [
      { id: "ksi-1", title: "Analisis Kerentanan", deadline: "2026-05-01", type: "individu", submissions: [
        { nim: "231011450601", nama: "KEVIN ALVARO",  submittedAt: "30 Apr 2026, 20.00 WIB", fileName: "kerentanan-kevin.pdf" },
        { nim: "231011450512", nama: "INDRA PERMANA", submittedAt: "01 Mei 2026, 07.45 WIB", fileName: "analisis-indra.pdf",
          comments: [{ author: "Dr. Wahyu", role: "dosen", text: "Analisis OWASP sudah lengkap.", time: "02 Mei, 08.30" }] },
      ]},
      { id: "ksi-2", title: "Kriptografi Dasar",   deadline: "2026-05-12", type: "individu", submissions: [] },
      { id: "ksi-3", title: "Penetration Testing", deadline: "2026-05-26", type: "kelompok", submissions: [] },
    ],
    enrollment: [
      { nim: "221011400114", nama: "ALDI AL KAHFI",   statuses: { "ksi-1": "belum mulai",       "ksi-2": "belum mulai", "ksi-3": "belum mulai" } },
      { nim: "231011450601", nama: "KEVIN ALVARO",    statuses: { "ksi-1": "sedang dikerjakan",  "ksi-2": "belum mulai", "ksi-3": "belum mulai" } },
      { nim: "221011400308", nama: "LUTHFI HAKIM",    statuses: { "ksi-1": "belum mulai",        "ksi-2": "belum mulai", "ksi-3": "belum mulai" } },
      { nim: "231011450512", nama: "INDRA PERMANA",   statuses: { "ksi-1": "menunggu review",    "ksi-2": "belum mulai", "ksi-3": "belum mulai" } },
      { nim: "231011400943", nama: "JOKO SANTOSO",    statuses: { "ksi-1": "belum mulai",        "ksi-2": "belum mulai", "ksi-3": "belum mulai" } },
      { nim: "221011400227", nama: "HENDRA SAPUTRA",  statuses: { "ksi-1": "belum mulai",        "ksi-2": "belum mulai", "ksi-3": "belum mulai" } },
    ],
  },
];

/* ── Submission Tracker ──────────────────────── */
function TaskSubmissionView({
  course, task, onSwitchTask,
}: {
  course: Course;
  task: CourseTask;
  onSwitchTask: (id: string) => void;
}) {
  const [grades, setGrades]         = useState<Record<string, string>>(
    Object.fromEntries(task.submissions.map(s => [s.nim, s.nilai?.toString() ?? ""]))
  );
  const [expandedNim, setExpandedNim] = useState<string | null>(null);
  const [saved, setSaved]           = useState(false);

  const submittedNims   = new Set(task.submissions.map(s => s.nim));
  const sortedSubs      = [...task.submissions].sort((a, b) => {
    const kg = (a.kelompok ?? "").localeCompare(b.kelompok ?? "");
    return kg !== 0 ? kg : a.nama.localeCompare(b.nama);
  });
  const notSubmitted    = course.enrollment
    .filter(e => !submittedNims.has(e.nim))
    .sort((a, b) => a.nama.localeCompare(b.nama));
  const submittedCount = task.submissions.length;
  const totalCount     = course.enrollment.length;
  const pct            = Math.round((submittedCount / totalCount) * 100);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Task tab pills */}
      <div className="px-5 pt-3 flex gap-1.5 flex-wrap border-b border-border shrink-0 bg-paper">
        {course.tasks.map(t => (
          <button
            key={t.id}
            onClick={() => onSwitchTask(t.id)}
            className={`px-3 py-1.5 rounded-t-md text-[11.5px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              t.id === task.id
                ? "text-forest border-forest bg-forest/5"
                : "text-muted border-transparent hover:text-ink hover:bg-cream"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-border/60 shrink-0 bg-cream/20">
        <div>
          <div className="text-[13.5px] font-bold text-ink">
            {task.title}
            <span className="text-muted font-normal"> — {course.name}</span>
          </div>
          <div className="text-[11px] text-muted mt-0.5">
            Deadline: {new Date(task.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
            {" · "}{totalCount} Mahasiswa
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[14px] font-bold text-ink font-mono">{submittedCount}/{totalCount}</span>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            pct >= 80 ? "bg-green-400/15 text-green-400" :
            pct >= 50 ? "bg-gold/15 text-gold" : "bg-rose/15 text-rose"
          }`}>
            {pct}% terkumpul
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[12.5px] border-collapse">
          <thead className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm">
            <tr>
              {["Mahasiswa", "NIM", "Waktu Kumpul", "File", "Status", "Nilai", "Komentar"].map(h => (
                <th key={h} className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted uppercase tracking-[0.06em] border-b border-border/60">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Submitted rows — sorted by kelompok then nama A-Z */}
            {sortedSubs.map((s, si) => {
              const isExpanded = expandedNim === s.nim;
              return (
                <React.Fragment key={s.nim}>
                  <tr className="border-b border-border/40 hover:bg-cream/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${AVATAR_GRADIENTS[si % AVATAR_GRADIENTS.length]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                          {s.nama.split(" ").slice(0, 2).map(w => w[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-ink truncate">
                            {s.nama}{s.kelompok ? <span className="text-muted font-normal"> ({s.kelompok})</span> : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted whitespace-nowrap">{s.nim}</td>
                    <td className="py-3 px-4 text-[11.5px] text-muted whitespace-nowrap">{s.submittedAt}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-teal text-[11.5px] whitespace-nowrap">
                        <Paperclip size={12} className="shrink-0" />
                        {s.fileName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-400/15 text-green-400 whitespace-nowrap">
                        Sudah Kumpul
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number" min={0} max={100}
                        value={grades[s.nim] ?? ""}
                        onChange={e => setGrades(prev => ({ ...prev, [s.nim]: e.target.value }))}
                        placeholder="—"
                        className="w-14 bg-cream border border-border rounded-lg px-2 py-1 text-[12px] text-ink text-center outline-none focus:border-forest transition-colors"
                      />
                    </td>
                    <td className="py-3 px-4">
                      {s.comments && s.comments.length > 0 ? (
                        <button
                          onClick={() => setExpandedNim(isExpanded ? null : s.nim)}
                          className="flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors"
                        >
                          <MessageSquare size={12} />
                          {s.comments.length}
                          <span className="ml-0.5">{isExpanded ? "▲" : "▼"}</span>
                        </button>
                      ) : (
                        <span className="text-muted/40">—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded comments */}
                  {isExpanded && s.comments && (
                    <tr className="border-b border-border/40 bg-forest/3">
                      <td colSpan={7} className="px-6 py-3">
                        <div className="flex flex-col gap-2">
                          {s.comments.map((c, ci) => (
                            <div key={ci} className="flex items-start gap-2.5 text-[11.5px]">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${
                                c.role === "dosen" ? "bg-forest/15 text-forest" : "bg-teal/15 text-teal"
                              }`}>
                                {c.role === "dosen" ? "Dosen" : "Mhs"}
                              </span>
                              <span className="font-semibold text-ink shrink-0">{c.author}:</span>
                              <span className="text-muted flex-1">{c.text}</span>
                              <span className="text-[10px] text-muted/60 shrink-0 whitespace-nowrap">{c.time}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {/* Not submitted rows */}
            {notSubmitted.map((s, si) => (
              <tr key={`ns-${s.nim}`} className="border-b border-border/40 hover:bg-cream/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cream-2 flex items-center justify-center text-[10px] font-bold text-muted shrink-0">
                      {s.nama.split(" ").slice(0, 2).map(w => w[0]).join("")}
                    </div>
                    <span className="font-semibold text-muted">{s.nama}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-muted whitespace-nowrap">{s.nim}</td>
                <td className="py-3 px-4 text-[11.5px] font-semibold text-rose">Belum Kumpul</td>
                <td className="py-3 px-4 text-muted/40">—</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-rose/15 text-rose whitespace-nowrap">
                    Belum Kumpul
                  </span>
                </td>
                <td className="py-3 px-4 text-muted/40">—</td>
                <td className="py-3 px-4 text-muted/40">—</td>
              </tr>
            ))}

            {task.submissions.length === 0 && notSubmitted.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted/50 text-[12px]">
                  Belum ada data mahasiswa untuk tugas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action bar */}
      <div className="px-5 py-3 border-t border-border shrink-0 flex items-center gap-3 bg-paper">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg text-[12.5px] transition-all ${
            saved
              ? "bg-green-400 text-white"
              : "bg-green-500 hover:bg-green-400 text-white hover:-translate-y-0.5"
          }`}
        >
          💾 {saved ? "Tersimpan!" : "Simpan Semua Nilai"}
        </button>
        <button className="flex items-center gap-2 border border-border text-muted hover:text-ink hover:border-ink px-4 py-2 rounded-lg text-[12.5px] transition-colors">
          📊 Ekspor Excel
        </button>
        <button className="flex items-center gap-2 border border-border text-muted hover:text-ink hover:border-ink px-4 py-2 rounded-lg text-[12.5px] transition-colors">
          🔔 Kirim Notifikasi ke Mahasiswa
        </button>
      </div>
    </div>
  );
}

/* ── Course Panel Modal ───────────────────────── */
function CoursePanel({ course, onClose }: { course: Course; onClose: () => void }) {
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [expandedNim, setExpandedNim]   = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const activeTask = course.tasks.find(t => t.id === activeTaskId) ?? null;

  const filtered = course.enrollment
    .filter(s => {
      const matchSearch = !search ||
        s.nama.toLowerCase().includes(search.toLowerCase()) ||
        s.nim.includes(search);
      const matchStatus = filterStatus === "semua" ||
        (activeTask
          ? s.statuses[activeTask.id] === filterStatus
          : Object.values(s.statuses).some(st => st === filterStatus));
      return matchSearch && matchStatus;
    })
    .sort((a, b) => a.nama.localeCompare(b.nama));

  const countWith = (status: string) =>
    activeTask
      ? course.enrollment.filter(s => s.statuses[activeTask.id] === status).length
      : course.enrollment.filter(s => Object.values(s.statuses).some(st => st === status)).length;

  /* wider modal when showing submission tracker */
  const modalW = activeTask ? "max-w-[1100px]" : "max-w-[960px]";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />

      <div className={`relative bg-paper border border-border rounded-[18px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] w-full ${modalW} max-h-[82vh] flex flex-col overflow-hidden transition-all duration-300`}>

        {/* Header — always visible */}
        <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl ${course.iconBg} flex items-center justify-center text-[22px] shrink-0`}>
                {course.icon}
              </div>
              <div>
                <div className="text-[17px] font-bold text-ink">{course.name}</div>
                <div className="text-[12px] text-muted mt-0.5">{course.code} · {course.semester} · {course.sks}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTask && (
                <button
                  onClick={() => setActiveTaskId(null)}
                  className="text-[11px] text-muted hover:text-ink border border-border hover:border-ink px-3 py-1.5 rounded-lg transition-colors"
                >
                  ← Semua Tugas
                </button>
              )}
              <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1.5 hover:bg-cream rounded-lg">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="w-full h-1.5 bg-cream-2 rounded-full overflow-hidden mb-1.5">
            <div className={`h-full bg-gradient-to-r ${course.bar} rounded-full`} style={{ width: `${course.progress}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-muted">
            <span>{course.progress}% progres kelas</span>
            <span>{course.tasks.length} tugas · {course.enrollment.length} mahasiswa terdaftar</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Submission tracker mode ── */}
          {activeTask && (
            <TaskSubmissionView
              course={course}
              task={activeTask}
              onSwitchTask={(id) => setActiveTaskId(id)}
            />
          )}

          {/* ── Default two-column mode ── */}
          {!activeTask && (
            <>
              {/* LEFT — task list */}
              <div className="w-[280px] shrink-0 border-r border-border flex flex-col overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-border/60 shrink-0">
                  <div className="text-[10px] text-muted uppercase tracking-[0.08em] font-semibold">Daftar Tugas</div>
                  <div className="text-[10px] text-muted mt-1">Klik tugas untuk lihat pengumpulan</div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
                  {course.tasks.map((t, i) => {
                    const doneForTask = course.enrollment.filter(s => s.statuses[t.id] === "selesai").length;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setActiveTaskId(t.id); setFilterStatus("semua"); setExpandedNim(null); }}
                        className="w-full text-left flex items-start gap-2.5 rounded-lg px-3 py-2.5 bg-cream hover:bg-cream-2 border border-transparent hover:border-border transition-all group"
                      >
                        <span className="font-mono text-[10px] text-muted/60 w-4 shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-medium text-ink group-hover:text-forest transition-colors leading-snug">{t.title}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${t.type === "kelompok" ? "bg-purple-400/15 text-purple-400" : "bg-teal/15 text-teal"}`}>
                              {t.type}
                            </span>
                            <span className="font-mono text-[10px] text-muted">{formatDate(t.deadline)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex-1 h-1 bg-cream-2 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${course.bar} rounded-full`}
                                style={{ width: `${Math.round((doneForTask / course.enrollment.length) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] text-muted shrink-0">{t.submissions.length} kumpul</span>
                          </div>
                        </div>
                        <span className="text-muted/40 group-hover:text-forest text-[12px] shrink-0 mt-1 transition-colors">›</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT — student table */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 pt-3.5 pb-3 border-b border-border/60 shrink-0 flex items-center gap-2 flex-wrap">
                  {[
                    { id: "semua",             label: `Semua · ${course.enrollment.length}` },
                    { id: "selesai",           label: `Selesai · ${countWith("selesai")}` },
                    { id: "sedang dikerjakan", label: `Dikerjakan · ${countWith("sedang dikerjakan")}` },
                    { id: "menunggu review",   label: `Review · ${countWith("menunggu review")}` },
                    { id: "belum mulai",       label: `Belum · ${countWith("belum mulai")}` },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilterStatus(f.id)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        filterStatus === f.id ? "bg-forest text-cream" : "bg-cream-2 text-muted hover:text-ink"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                  <div className="relative ml-auto">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-[11px]">🔍</span>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Cari nama / NIM…"
                      className="bg-cream border border-border rounded-lg pl-7 pr-3 py-1.5 text-[11.5px] text-ink placeholder:text-muted outline-none focus:border-forest transition-colors w-44"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted/50">
                      <User size={28} className="mb-2 opacity-40" />
                      <span className="text-[12px]">Tidak ada mahasiswa ditemukan</span>
                    </div>
                  ) : (
                    <table className="w-full text-[12px] border-collapse">
                      <thead className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm">
                        <tr>
                          <th className="text-left py-2.5 px-4 text-[9.5px] font-semibold text-muted uppercase tracking-[0.06em] border-b border-border/60 whitespace-nowrap">Mahasiswa</th>
                          <th className="text-left py-2.5 px-3 text-[9.5px] font-semibold text-muted uppercase tracking-[0.06em] border-b border-border/60 whitespace-nowrap">NIM</th>
                          {course.tasks.map(t => (
                            <th key={t.id} className="py-2.5 px-2 text-[9px] font-semibold text-muted uppercase tracking-[0.05em] border-b border-border/60 text-center min-w-[70px] max-w-[90px]">
                              <div className="truncate leading-tight" title={t.title}>{t.title.split(" ").slice(0, 3).join(" ")}</div>
                              <div className="font-mono text-[8px] text-muted/60 normal-case">{formatDate(t.deadline)}</div>
                            </th>
                          ))}
                          <th className="text-right py-2.5 px-4 text-[9.5px] font-semibold text-muted uppercase tracking-[0.06em] border-b border-border/60 whitespace-nowrap">Progres</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((s, si) => {
                          const doneCount = Object.values(s.statuses).filter(st => st === "selesai").length;
                          const pct       = Math.round((doneCount / course.tasks.length) * 100);
                          return (
                            <tr key={s.nim} className="border-b border-border/40 last:border-0 hover:bg-forest/[0.03] transition-colors">
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[si % AVATAR_GRADIENTS.length]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                                    {s.nama.split(" ").slice(0, 2).map(w => w[0]).join("")}
                                  </div>
                                  <span className="font-semibold text-ink text-[12px] truncate max-w-[130px]">{s.nama}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[10.5px] text-muted whitespace-nowrap">{s.nim}</td>
                              {course.tasks.map(t => {
                                const status = s.statuses[t.id] ?? "belum mulai";
                                const dot: Record<string, string> = {
                                  "selesai":           "bg-green-400/20 text-green-400",
                                  "sedang dikerjakan": "bg-gold/20 text-gold",
                                  "menunggu review":   "bg-blue-400/20 text-blue-400",
                                  "belum mulai":       "bg-cream-2 text-muted/50",
                                };
                                const icon: Record<string, string> = {
                                  "selesai": "✓", "sedang dikerjakan": "⚡", "menunggu review": "👁", "belum mulai": "—",
                                };
                                return (
                                  <td key={t.id} className="py-2.5 px-2 text-center">
                                    <span className={`inline-flex items-center justify-center text-[9.5px] font-bold w-6 h-6 rounded-full ${dot[status]}`} title={status}>
                                      {icon[status]}
                                    </span>
                                  </td>
                                );
                              })}
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 justify-end">
                                  <div className="w-16 h-1.5 bg-cream-2 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${course.bar} rounded-full`} style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className={`font-mono text-[10px] font-semibold ${doneCount === course.tasks.length ? "text-green-400" : "text-muted"}`}>
                                    {doneCount}/{course.tasks.length}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────── */
export default function DosenMatakuliahPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const totalStudents = COURSES.reduce((a, c) => a + c.students, 0);
  const avgProgress   = Math.round(COURSES.reduce((a, c) => a + c.progress, 0) / COURSES.length);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
        <div className="font-serif text-[24px] text-ink">Mata Kuliah yang Diampu</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Mata Kuliah", val: COURSES.length,  icon: "📚", accent: "text-forest", bg: "bg-forest/8" },
          { label: "Total Mahasiswa",   val: totalStudents,   icon: "🎓", accent: "text-teal",   bg: "bg-teal/8"   },
          { label: "Rata-rata Progres", val: `${avgProgress}%`, icon: "📈", accent: "text-gold", bg: "bg-gold/8" },
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

      <div className="grid grid-cols-2 gap-4">
        {COURSES.map((c, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedCourse(c)}
            className="bg-paper border-[1.5px] border-border rounded-[14px] p-5 shadow-[0_1px_6px_rgba(26,26,20,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,26,20,0.12)] transition-all duration-200 cursor-pointer"
          >
            <div className="flex gap-3.5 items-start mb-4">
              <div className={`w-[46px] h-[46px] rounded-xl ${c.iconBg} flex items-center justify-center text-[24px] shrink-0`}>
                {c.icon}
              </div>
              <div>
                <div className="font-semibold text-ink text-[15px]">{c.name}</div>
                <div className="text-[12px] text-muted mt-0.5">{c.code} · {c.semester} · {c.sks}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
              {[
                { label: "Mahasiswa", val: c.students       },
                { label: "Tugas",     val: c.tasks.length   },
                { label: "Progres",   val: `${c.progress}%` },
              ].map((stat, i) => (
                <div key={i} className="bg-cream rounded-lg py-2.5 px-2">
                  <div className={`font-serif text-[20px] leading-none ${c.accent}`}>{stat.val}</div>
                  <div className="text-[11px] text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-muted mb-1.5">Klik untuk lihat pengumpulan &amp; nilai</div>
            <div className="w-full h-1.5 bg-cream-2 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full`} style={{ width: `${c.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <CoursePanel course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}
