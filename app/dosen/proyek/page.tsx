"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, CheckCircle2, Paperclip, Upload, Star, Plus, RotateCcw, Eye } from "lucide-react";
import { getKelompokList, type Kelompok } from "@/lib/kelompokStore";
import {
  getTugasKelompokList, createTugasKelompok, addProjComment, setTugasStatus,
  type TugasKelompok,
} from "@/lib/proyekStore";

/* ── Constants ─────────────────────────────── */
const STATUS_INFO: Record<TugasKelompok["status"], { label: string; cls: string }> = {
  aktif:       { label: "Aktif",        cls: "bg-[#0d9488]/15 text-[#0d9488]"   },
  dikumpulkan: { label: "Dikumpulkan",  cls: "bg-[#7c3aed]/15 text-[#7c3aed]"  },
  revisi:      { label: "Perlu Revisi", cls: "bg-rose-500/15 text-rose-500"     },
  selesai:     { label: "Selesai",      cls: "bg-[#15803d]/15 text-[#15803d]"   },
};

const MEMBER_GRADIENTS = [
  "from-amber-400 to-purple-500",
  "from-rose-400 to-purple-500",
  "from-teal-400 to-green-400",
  "from-amber-400 to-rose-400",
];

/* ── Review Modal ───────────────────────────── */
function ReviewModal({ tugas, kelompokList, onClose, onRefresh }: {
  tugas: TugasKelompok;
  kelompokList: Kelompok[];
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [tab, setTab]                 = useState<"submissions" | "comment" | "nilai">("submissions");
  const [commentText, setCommentText] = useState("");
  const [catatanRevisi, setCatatan]   = useState("");
  const [nilai, setNilai]             = useState("");
  const [actionDone, setActionDone]   = useState<"revisi" | "selesai" | null>(null);
  const commentsEndRef                = useRef<HTMLDivElement>(null);

  const group = kelompokList.find(g => g.id === tugas.groupId || g.name === tugas.groupName);

  useEffect(() => {
    if (tab === "comment") commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tab, tugas.comments.length]);

  function handleSendComment() {
    const text = commentText.trim();
    if (!text) return;
    addProjComment(tugas.id, { author: "Dr. Budi Santoso", role: "dosen", text });
    onRefresh();
    setCommentText("");
  }

  function handleRevisi() {
    if (!catatanRevisi.trim()) return;
    setTugasStatus(tugas.id, "revisi", { catatanRevisi: catatanRevisi.trim() });
    onRefresh();
    setActionDone("revisi");
  }

  function handleSelesai() {
    const n = parseInt(nilai);
    if (isNaN(n) || n < 0 || n > 100) return;
    setTugasStatus(tugas.id, "selesai", { nilaiAkhir: n });
    onRefresh();
    setActionDone("selesai");
  }

  const canReview = tugas.status === "dikumpulkan";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-paper border border-border rounded-[18px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] w-full max-w-[860px] max-h-[82vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_INFO[tugas.status].cls}`}>
                  {STATUS_INFO[tugas.status].label}
                </span>
                <span className="text-[11px] text-muted bg-cream border border-border px-2 py-0.5 rounded-full">{tugas.course}</span>
                <span className="text-[11px] text-muted bg-cream border border-border px-2 py-0.5 rounded-full">👥 {tugas.groupName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tugas.createdBy === "dosen" ? "bg-forest/15 text-forest" : "bg-gold/15 text-gold"}`}>
                  {tugas.createdBy === "dosen" ? "Dibuat Dosen" : "Dibuat Mahasiswa"}
                </span>
              </div>
              <div className="text-[18px] font-bold text-ink">{tugas.title}</div>
              {tugas.description && <p className="text-[12px] text-muted mt-1">{tugas.description}</p>}
            </div>
            <button onClick={onClose} className="text-muted hover:text-ink p-1.5 hover:bg-cream rounded-lg transition-colors shrink-0">
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <div className="bg-cream border border-border rounded-xl px-3 py-2.5">
              <div className="text-[10px] text-muted uppercase tracking-wide">Deadline</div>
              <div className="text-[13px] font-bold text-ink">
                {new Date(tugas.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
            <div className="bg-cream border border-border rounded-xl px-3 py-2.5">
              <div className="text-[10px] text-muted uppercase tracking-wide">Pengumpulan</div>
              <div className="text-[13px] font-bold text-[#7c3aed]">{tugas.submissions.length} file</div>
            </div>
            <div className="bg-cream border border-border rounded-xl px-3 py-2.5">
              <div className="text-[10px] text-muted uppercase tracking-wide">Anggota</div>
              <div className="text-[13px] font-bold text-[#0d9488]">{group?.members.length ?? "-"} orang</div>
            </div>
          </div>

          {tugas.status === "selesai" && tugas.nilaiAkhir !== undefined && (
            <div className="mt-3 bg-[#15803d]/10 border border-[#15803d]/25 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <Star size={16} className="text-amber-500 shrink-0" />
              <span className="text-[12.5px] text-[#15803d] font-semibold">Nilai: {tugas.nilaiAkhir} — Tugas telah selesai.</span>
            </div>
          )}
          {tugas.status === "revisi" && tugas.catatanRevisi && (
            <div className="mt-3 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-2.5">
              <div className="text-[10px] font-semibold text-rose-500 uppercase tracking-wide mb-0.5">Catatan Revisi</div>
              <p className="text-[12px] text-ink">{tugas.catatanRevisi}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-6 pt-3 pb-0 shrink-0 border-b border-border">
          {([
            { id: "submissions", label: "Pengumpulan", emoji: "📎", badge: tugas.submissions.length },
            { id: "comment",     label: "Diskusi",     emoji: "💬", badge: tugas.comments.length    },
            { id: "nilai",       label: "Review & Nilai", emoji: "✏️", badge: 0 },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium transition-all border-b-2 -mb-px ${
                tab === t.id
                  ? "text-forest border-forest bg-forest/5 rounded-t-lg"
                  : "text-muted border-transparent hover:text-ink"
              }`}
            >
              {t.emoji} {t.label}
              {t.badge > 0 && <span className="bg-forest/15 text-forest text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── PENGUMPULAN ── */}
          {tab === "submissions" && (
            <div className="p-6 flex flex-col gap-4">
              {tugas.submissions.length === 0 ? (
                <div className="bg-cream border border-border rounded-xl p-10 text-center text-muted">
                  <Upload size={28} className="mx-auto mb-2 opacity-40" />
                  <div className="text-[13px]">Belum ada file yang dikumpulkan.</div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {tugas.submissions.map((s, si) => (
                    <div key={s.id ?? si} className="bg-cream border border-border rounded-xl px-5 py-4 flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.type === "link" ? "bg-[#0d9488]/15 text-[#0d9488]" : "bg-[#15803d]/15 text-[#15803d]"}`}>
                        {s.type === "link" ? <Paperclip size={15} /> : <CheckCircle2 size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {s.type === "link" ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#0d9488] hover:underline truncate block">{s.url ?? s.fileName}</a>
                        ) : (
                          <div className="text-[13px] font-medium text-ink">{s.fileName}</div>
                        )}
                        {s.note && <div className="text-[11px] text-muted italic mt-0.5">&quot;{s.note}&quot;</div>}
                        <div className="text-[11px] text-muted mt-0.5">{s.submittedBy} · {s.submittedAt} · {s.fileSize}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {group && group.members.length > 0 && (
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-[0.1em] mb-2.5">Anggota Kelompok</div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.members.map((m, mi) => (
                      <div key={mi} className="bg-cream border border-border rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${MEMBER_GRADIENTS[mi % MEMBER_GRADIENTS.length]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                          {m.nama.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium text-ink truncate">{m.nama}</div>
                          <div className="font-mono text-[10px] text-muted">{m.nim}</div>
                        </div>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${m.role === "Leader" ? "bg-amber-400/15 text-amber-600" : "bg-purple-500/10 text-purple-600"}`}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DISKUSI ── */}
          {tab === "comment" && (
            <div className="flex flex-col" style={{ minHeight: "320px" }}>
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
                {tugas.comments.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted/50">
                    <MessageSquare size={32} className="mb-2 opacity-40" />
                    <span className="text-[12px]">Belum ada diskusi.</span>
                  </div>
                )}
                {tugas.comments.map((c, ci) => {
                  const isDosen = c.role === "dosen";
                  return (
                    <div key={c.id ?? ci} className={`flex gap-2.5 ${isDosen ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${isDosen ? "bg-gradient-to-br from-[#166534] to-[#0d9488]" : "bg-gradient-to-br from-amber-400 to-orange-400"}`}>
                        {c.author.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className={`max-w-[480px] flex flex-col ${isDosen ? "items-end" : "items-start"}`}>
                        <div className={`flex items-center gap-1.5 mb-1 ${isDosen ? "flex-row-reverse" : ""}`}>
                          <span className="text-[11px] font-semibold text-ink">{c.author}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${isDosen ? "bg-forest/15 text-forest" : "bg-amber-400/15 text-amber-600"}`}>
                            {isDosen ? "Saya" : "Mahasiswa"}
                          </span>
                        </div>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${isDosen ? "bg-forest/10 text-ink rounded-tr-sm" : "bg-cream text-ink rounded-tl-sm border border-border"}`}>
                          {c.text}
                        </div>
                        <span className="text-[10px] text-muted mt-1">{c.time}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={commentsEndRef} />
              </div>
              <div className="px-5 py-3 border-t border-border bg-paper shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendComment(); }}}
                    placeholder="Tulis pesan atau feedback…"
                    rows={2}
                    className="flex-1 bg-cream border border-border rounded-xl px-3 py-2.5 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-forest transition-colors resize-none"
                  />
                  <button onClick={handleSendComment} disabled={!commentText.trim()} className="w-9 h-9 bg-forest hover:bg-forest/90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0">
                    <Send size={14} />
                  </button>
                </div>
                <div className="text-[10px] text-muted mt-1.5">Enter untuk kirim · Shift+Enter baris baru</div>
              </div>
            </div>
          )}

          {/* ── REVIEW & NILAI ── */}
          {tab === "nilai" && (
            <div className="p-6 flex flex-col gap-5">
              {actionDone === "revisi" && (
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3 flex items-center gap-2">
                  <RotateCcw size={14} className="text-rose-500 shrink-0" />
                  <span className="text-[12.5px] text-rose-600 font-medium">Revisi telah dikirim ke mahasiswa.</span>
                </div>
              )}
              {actionDone === "selesai" && (
                <div className="bg-[#15803d]/10 border border-[#15803d]/25 rounded-xl px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#15803d] shrink-0" />
                  <span className="text-[12.5px] text-[#15803d] font-medium">Tugas disetujui dan nilai telah diberikan.</span>
                </div>
              )}

              {!canReview && !actionDone && (
                <div className="bg-cream border border-border rounded-xl p-6 text-center text-muted">
                  <Eye size={28} className="mx-auto mb-2 opacity-40" />
                  <div className="text-[13px] font-medium text-ink mb-1">Belum dapat di-review</div>
                  <div className="text-[12px]">
                    {tugas.status === "aktif" || tugas.status === "revisi"
                      ? "Tunggu mahasiswa mengumpulkan tugas terlebih dahulu."
                      : "Tugas ini sudah selesai dinilai."}
                  </div>
                </div>
              )}

              {canReview && !actionDone && (
                <>
                  {/* Minta Revisi */}
                  <div className="bg-cream border border-border rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <RotateCcw size={15} className="text-rose-500 shrink-0" />
                      <div className="text-[13px] font-semibold text-ink">Minta Revisi</div>
                    </div>
                    <div className="text-[12px] text-muted">Tugas akan dikembalikan ke mahasiswa dengan catatan perbaikan.</div>
                    <textarea
                      value={catatanRevisi}
                      onChange={e => setCatatan(e.target.value)}
                      placeholder="Tuliskan hal yang perlu diperbaiki…"
                      rows={3}
                      className="w-full bg-paper border border-border rounded-xl px-3 py-2.5 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-rose-400 transition-colors resize-none"
                    />
                    <button
                      onClick={handleRevisi}
                      disabled={!catatanRevisi.trim()}
                      className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={14} /> Kirim Revisi
                    </button>
                  </div>

                  {/* Setujui & Nilai */}
                  <div className="bg-cream border border-border rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Star size={15} className="text-amber-500 shrink-0" />
                      <div className="text-[13px] font-semibold text-ink">Setujui & Beri Nilai</div>
                    </div>
                    <div className="text-[12px] text-muted">Tugas disetujui dan akan masuk ke penilaian akhir.</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] text-muted uppercase tracking-wide mb-1.5 block">Nilai (0–100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={nilai}
                          onChange={e => setNilai(e.target.value)}
                          placeholder="85"
                          className="w-full bg-paper border border-border rounded-xl px-3 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none focus:border-forest transition-colors"
                        />
                      </div>
                      {nilai && !isNaN(parseInt(nilai)) && (
                        <div className={`mt-5 text-[28px] font-bold ${parseInt(nilai) >= 80 ? "text-[#15803d]" : parseInt(nilai) >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                          {parseInt(nilai) >= 80 ? "A" : parseInt(nilai) >= 70 ? "B" : parseInt(nilai) >= 60 ? "C" : "D"}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSelesai}
                      disabled={!nilai || isNaN(parseInt(nilai)) || parseInt(nilai) < 0 || parseInt(nilai) > 100}
                      className="bg-[#15803d] hover:bg-[#166534] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} /> Setujui & Simpan Nilai
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 border-t border-border shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-muted">
            Dibuat: <span className="text-ink font-medium">{tugas.createdAt}</span>
            <span className="mx-1.5 opacity-40">·</span>
            {tugas.submissions.length} pengumpulan · {tugas.comments.length} pesan
          </div>
          <button onClick={onClose} className="bg-forest hover:bg-forest/90 text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ── Create Modal (Dosen) ───────────────────── */
function CreateTugasDosenModal({ kelompokList, onClose, onAdd }: {
  kelompokList: Kelompok[];
  onClose: () => void;
  onAdd: () => void;
}) {
  const [title, setTitle]             = useState("");
  const [desc, setDesc]               = useState("");
  const [deadline, setDeadline]       = useState("");
  const [selectedCourse, setCourse]   = useState("");
  const [selectedGroupId, setGroupId] = useState("");

  const courses        = [...new Set(kelompokList.map(g => g.course))].sort();
  const filteredGroups = selectedCourse ? kelompokList.filter(g => g.course === selectedCourse) : [];
  const group          = filteredGroups.find(g => g.id === selectedGroupId) ?? filteredGroups[0] ?? null;

  function handleCourseChange(course: string) {
    setCourse(course);
    const first = kelompokList.find(g => g.course === course);
    setGroupId(first?.id ?? "");
  }

  if (kelompokList.length === 0) return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-paper border border-border rounded-[16px] p-8 text-center max-w-sm w-full shadow-xl">
        <div className="text-3xl mb-3">👥</div>
        <div className="text-[15px] font-semibold text-ink mb-2">Belum ada kelompok</div>
        <p className="text-[13px] text-muted mb-4">Buat kelompok di tab Kelompok terlebih dahulu.</p>
        <button onClick={onClose} className="bg-forest text-white px-5 py-2 rounded-lg text-[13px] font-semibold">Tutup</button>
      </div>
    </div>
  );

  function handleSubmit() {
    if (!title.trim() || !deadline || !group || !selectedCourse) return;
    createTugasKelompok({
      title: title.trim(),
      description: desc.trim(),
      course: selectedCourse,
      deadline,
      groupId: group.id,
      groupName: group.name,
      createdBy: "dosen",
    });
    onAdd();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-paper border border-border rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-[480px]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="text-[15px] font-bold text-ink">Beri Tugas ke Kelompok</div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="text-[11px] text-muted uppercase tracking-[0.08em] mb-1.5 block">Judul Tugas</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Laporan Analisis Sistem…" className="w-full bg-cream border border-border rounded-xl px-3 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none focus:border-forest transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-[0.08em] mb-1.5 block">Deskripsi / Instruksi <span className="normal-case text-muted/60">(opsional)</span></label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Jelaskan instruksi tugas…" rows={2} className="w-full bg-cream border border-border rounded-xl px-3 py-2.5 text-[13px] text-ink placeholder:text-muted outline-none focus:border-forest transition-colors resize-none" />
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-[0.08em] mb-1.5 block">Mata Kuliah</label>
            <select
              value={selectedCourse}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full bg-cream border border-border rounded-xl px-3 py-2.5 text-[13px] text-ink outline-none focus:border-forest transition-colors"
            >
              <option value="">— Pilih mata kuliah —</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-[0.08em] mb-1.5 block">
              Kelompok <span className="text-forest normal-case">
                {selectedCourse ? `(${filteredGroups.length} kelompok di mata kuliah ini)` : "(pilih mata kuliah dulu)"}
              </span>
            </label>
            <select
              value={group?.id ?? ""}
              onChange={e => setGroupId(e.target.value)}
              disabled={!selectedCourse || filteredGroups.length === 0}
              className="w-full bg-cream border border-border rounded-xl px-3 py-2.5 text-[13px] text-ink outline-none focus:border-forest transition-colors disabled:opacity-50"
            >
              {filteredGroups.length === 0
                ? <option value="">Tidak ada kelompok untuk mata kuliah ini</option>
                : filteredGroups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.members.length} anggota)</option>)
              }
            </select>
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-[0.08em] mb-1.5 block">Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-cream border border-border rounded-xl px-3 py-2.5 text-[13px] text-ink outline-none focus:border-forest transition-colors" />
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-border text-muted hover:text-ink py-2.5 rounded-xl text-[13px] font-medium transition-colors">Batal</button>
          <button onClick={handleSubmit} disabled={!title.trim() || !deadline || !selectedCourse || !group} className="flex-1 bg-forest hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-[13px] font-semibold transition-colors">
            Beri Tugas
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────── */
export default function DosenProyekPage() {
  const [tugasList, setTugasList]         = useState<TugasKelompok[]>([]);
  const [kelompokList, setKelompokList]   = useState<Kelompok[]>([]);
  const [selectedTugas, setSelectedTugas] = useState<TugasKelompok | null>(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [filterStatus, setFilterStatus]  = useState<TugasKelompok["status"] | "semua">("semua");

  function refresh() {
    setTugasList(getTugasKelompokList());
    if (selectedTugas) {
      const updated = getTugasKelompokList().find(t => t.id === selectedTugas.id);
      if (updated) setSelectedTugas(updated);
    }
  }

  useEffect(() => {
    setTugasList(getTugasKelompokList());
    setKelompokList(getKelompokList());
  }, []);

  const filtered = tugasList.filter(t =>
    filterStatus === "semua" || t.status === filterStatus
  );

  const counts = {
    semua:       tugasList.length,
    aktif:       tugasList.filter(t => t.status === "aktif").length,
    dikumpulkan: tugasList.filter(t => t.status === "dikumpulkan").length,
    revisi:      tugasList.filter(t => t.status === "revisi").length,
    selesai:     tugasList.filter(t => t.status === "selesai").length,
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[26px] text-ink leading-tight">
            Tugas <span className="text-forest">Kelompok</span>
          </div>
          <p className="text-[12px] text-muted mt-0.5">Beri tugas · Review pengumpulan · Minta revisi · Beri nilai</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-forest text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-forest/90 transition-colors flex items-center gap-1.5"
        >
          <Plus size={15} /> Beri Tugas
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {([
          { key: "semua",       label: "Semua"        },
          { key: "aktif",       label: "Aktif"        },
          { key: "dikumpulkan", label: "Dikumpulkan"  },
          { key: "revisi",      label: "Perlu Revisi" },
          { key: "selesai",     label: "Selesai"      },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all border ${
              filterStatus === f.key
                ? "bg-forest text-white border-forest"
                : "bg-cream border-border text-muted hover:text-ink hover:border-muted"
            }`}
          >
            {f.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filterStatus === f.key ? "bg-white/20 text-white" : "bg-border text-muted"}`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {tugasList.length === 0 && (
        <div className="bg-cream border border-border rounded-[14px] p-10 text-center text-muted">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-[14px] font-medium text-ink mb-1">Belum ada tugas kelompok</div>
          <div className="text-[13px] mb-4">Klik &quot;Beri Tugas&quot; untuk memberikan tugas ke kelompok mahasiswa.</div>
          <button onClick={() => setShowCreate(true)} className="bg-forest text-white px-5 py-2 rounded-lg text-[13px] font-semibold">
            + Beri Tugas Kelompok
          </button>
        </div>
      )}

      {tugasList.length > 0 && filtered.length === 0 && (
        <div className="bg-cream border border-border rounded-[14px] p-8 text-center text-muted text-[13px]">
          Tidak ada tugas dengan status tersebut.
        </div>
      )}

      {/* Task list */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map(t => {
            const si = STATUS_INFO[t.status];
            const dl = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / 86400000);
            const dlCls = dl < 0 ? "text-rose-500" : dl <= 3 ? "text-amber-500" : "text-muted";
            const needsReview = t.status === "dikumpulkan";
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTugas(t)}
                className={`bg-cream border rounded-[14px] px-5 py-4 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${
                  needsReview ? "border-[#7c3aed]/30 bg-[#7c3aed]/5" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${si.cls}`}>{si.label}</span>
                      <span className="text-[10px] text-muted">{t.course}</span>
                      <span className="text-[10px] text-muted">👥 {t.groupName}</span>
                      {t.createdBy === "dosen" && <span className="text-[10px] font-semibold text-forest bg-forest/10 px-1.5 py-0.5 rounded-full">Dari Saya</span>}
                      {needsReview && <span className="text-[10px] font-semibold text-[#7c3aed] bg-[#7c3aed]/10 px-1.5 py-0.5 rounded-full animate-pulse">Perlu Review</span>}
                    </div>
                    <div className="text-[14.5px] font-semibold text-ink">{t.title}</div>
                    {t.description && <p className="text-[12px] text-muted mt-0.5 line-clamp-1">{t.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-mono text-[12px] font-semibold ${dlCls}`}>
                      {dl < 0 ? `+${Math.abs(dl)}d` : dl === 0 ? "Hari ini" : `H-${dl}`}
                    </div>
                    <div className="text-[10px] text-muted mt-0.5">{new Date(t.deadline).toLocaleDateString("id-ID", { day:"2-digit", month:"short" })}</div>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted">
                  <span>📎 {t.submissions.length} pengumpulan</span>
                  <span>💬 {t.comments.length} pesan</span>
                  {t.nilaiAkhir !== undefined && <span className="text-[#15803d] font-semibold">★ {t.nilaiAkhir}</span>}
                  {t.catatanRevisi && <span className="text-rose-500">⚠ Ada catatan revisi</span>}
                  <span className="ml-auto opacity-50">Klik untuk review →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTugas && (
        <ReviewModal
          tugas={selectedTugas}
          kelompokList={kelompokList}
          onClose={() => setSelectedTugas(null)}
          onRefresh={refresh}
        />
      )}

      {showCreate && (
        <CreateTugasDosenModal
          kelompokList={kelompokList}
          onClose={() => setShowCreate(false)}
          onAdd={refresh}
        />
      )}
    </div>
  );
}
