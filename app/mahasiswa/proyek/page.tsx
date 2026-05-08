"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Paperclip, Send, MessageSquare, CheckCircle2, Clock, AlertCircle, Star, Plus, Layers } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import { getKelompokList, type Kelompok } from "@/lib/kelompokStore";
import {
  getTugasKelompokList, createTugasKelompok, addProjSubmission, addProjComment,
  type TugasKelompok,
} from "@/lib/proyekStore";

/* ── Constants ─────────────────────────────── */
const STATUS_INFO: Record<TugasKelompok["status"], { label: string; cls: string; dot: string }> = {
  aktif:       { label: "Aktif",        cls: "bg-mhs-teal/15 text-mhs-teal",     dot: "bg-mhs-teal"    },
  dikumpulkan: { label: "Dikumpulkan",  cls: "bg-mhs-purple/15 text-mhs-purple", dot: "bg-mhs-purple"  },
  revisi:      { label: "Perlu Revisi", cls: "bg-mhs-rose/15 text-mhs-rose",     dot: "bg-mhs-rose"    },
  selesai:     { label: "Selesai",      cls: "bg-mhs-green/15 text-mhs-green",   dot: "bg-mhs-green"   },
};

const MEMBER_GRADIENTS = [
  "from-mhs-amber to-mhs-purple",
  "from-mhs-rose to-mhs-purple",
  "from-mhs-teal to-mhs-green",
  "from-mhs-amber to-mhs-rose",
  "from-mhs-purple to-mhs-teal",
];

/* ── Workflow Track ─────────────────────────── */
function WorkflowTrack({ status }: { status: TugasKelompok["status"] }) {
  const steps = [
    { key: "aktif",       label: "Aktif",   icon: "⚡" },
    { key: "dikumpulkan", label: "Kumpul",  icon: "📤" },
    { key: "review",      label: "Review",  icon: "👁" },
    { key: "selesai",     label: "Selesai", icon: "✅" },
  ];
  const order: Record<string, number> = { aktif: 0, dikumpulkan: 1, revisi: 2, selesai: 3 };
  const cur = order[status] ?? 0;

  return (
    <div className="flex items-center">
      {steps.map((step, si) => {
        const stepOrd = si;
        const isDone    = cur > stepOrd;
        const isActive  = (step.key === "aktif" && status === "aktif") ||
                          (step.key === "dikumpulkan" && status === "dikumpulkan") ||
                          (step.key === "review" && status === "revisi") ||
                          (step.key === "selesai" && status === "selesai");
        const isRevisi  = step.key === "review" && status === "revisi";

        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all ${
                isDone   ? "bg-mhs-green border-mhs-green text-white" :
                isRevisi ? "bg-mhs-rose border-mhs-rose text-white" :
                isActive ? "bg-mhs-amber border-mhs-amber text-white shadow-[0_0_10px_rgba(251,191,36,0.4)]" :
                "bg-mhs-card border-mhs-border text-mhs-muted"
              }`}>
                {isDone ? "✓" : isRevisi ? "!" : step.icon}
              </div>
              <div className={`text-[9px] mt-1 text-center font-medium ${
                isDone ? "text-mhs-green" : isRevisi ? "text-mhs-rose" : isActive ? "text-mhs-amber" : "text-mhs-muted"
              }`}>
                {isRevisi ? "Revisi" : step.label}
              </div>
            </div>
            {si < steps.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-4 mx-0.5 rounded-full ${isDone ? "bg-mhs-green" : "bg-mhs-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Detail Modal ───────────────────────────── */
function TugasDetailModal({ tugas, kelompokList, onClose, onRefresh }: {
  tugas: TugasKelompok;
  kelompokList: Kelompok[];
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [tab, setTab]                   = useState<"detail" | "submit" | "comment">("detail");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitNote, setSubmitNote]     = useState("");
  const [submitDone, setSubmitDone]     = useState(false);
  const [linkUrl, setLinkUrl]           = useState("");
  const [linkNote, setLinkNote]         = useState("");
  const [linkDone, setLinkDone]         = useState(false);
  const [commentText, setCommentText]   = useState("");
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const group    = kelompokList.find(g => g.id === tugas.groupId || g.name === tugas.groupName);
  const canSubmit = tugas.status === "aktif" || tugas.status === "revisi";
  const daysLeft  = Math.ceil((new Date(tugas.deadline).getTime() - Date.now()) / 86400000);
  const dlCls     = daysLeft < 0 ? "text-mhs-rose" : daysLeft <= 3 ? "text-mhs-amber" : "text-mhs-teal";

  useEffect(() => {
    if (tab === "comment") commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tab, tugas.comments.length]);

  function handleFileSubmit() {
    if (!selectedFile) return;
    addProjSubmission(tugas.id, {
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      submittedBy: "Eki Kurniawan",
      note: submitNote,
      type: "file",
    });
    onRefresh();
    setSubmitDone(true);
    setSelectedFile(null);
    setSubmitNote("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleLinkSubmit() {
    const url = linkUrl.trim();
    if (!url) return;
    try { new URL(url); } catch { return; }
    addProjSubmission(tugas.id, {
      fileName: url.length > 50 ? url.slice(0, 50) + "…" : url,
      fileSize: "—",
      submittedBy: "Eki Kurniawan",
      note: linkNote,
      type: "link",
      url,
    });
    onRefresh();
    setLinkDone(true);
    setLinkUrl("");
    setLinkNote("");
  }

  function handleSendComment() {
    const text = commentText.trim();
    if (!text) return;
    addProjComment(tugas.id, { author: "Eki Kurniawan", role: "mahasiswa", text });
    onRefresh();
    setCommentText("");
  }

  const si = STATUS_INFO[tugas.status];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-mhs-surface border border-mhs-border rounded-[18px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] w-full max-w-[860px] max-h-[82vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-mhs-border shrink-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${si.cls}`}>{si.label}</span>
                <span className="text-[11px] text-mhs-muted bg-mhs-card border border-mhs-border px-2 py-0.5 rounded-full">{tugas.course}</span>
                <span className="text-[11px] text-mhs-muted bg-mhs-card border border-mhs-border px-2 py-0.5 rounded-full">👥 {tugas.groupName}</span>
                {tugas.createdBy === "dosen" && (
                  <span className="text-[10px] font-semibold text-mhs-purple bg-mhs-purple/10 px-2 py-0.5 rounded-full">Dari Dosen</span>
                )}
              </div>
              <div className="text-[18px] font-bold text-mhs-text">{tugas.title}</div>
              {tugas.description && <p className="text-[12px] text-mhs-muted mt-1">{tugas.description}</p>}
            </div>
            <button onClick={onClose} className="text-mhs-muted hover:text-mhs-text p-1.5 hover:bg-mhs-card rounded-lg transition-colors shrink-0">
              <X size={16} />
            </button>
          </div>

          <WorkflowTrack status={tugas.status} />

          {tugas.status === "revisi" && tugas.catatanRevisi && (
            <div className="mt-3 bg-mhs-rose/10 border border-mhs-rose/25 rounded-xl px-4 py-3">
              <div className="text-[10px] font-semibold text-mhs-rose uppercase tracking-wide mb-1">Catatan Revisi dari Dosen</div>
              <p className="text-[12.5px] text-mhs-text">{tugas.catatanRevisi}</p>
            </div>
          )}

          {tugas.status === "selesai" && tugas.nilaiAkhir !== undefined && (
            <div className="mt-3 bg-mhs-green/10 border border-mhs-green/25 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <Star size={18} className="text-mhs-amber shrink-0" />
              <div>
                <div className="text-[10px] text-mhs-muted uppercase tracking-wide">Nilai Akhir</div>
                <div className="text-[22px] font-bold text-mhs-green leading-none">{tugas.nilaiAkhir}</div>
              </div>
              <div className="ml-2 text-[12px] text-mhs-muted">Tugas telah dinilai oleh dosen.</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-6 pt-3 pb-0 shrink-0 border-b border-mhs-border">
          {([
            { id: "detail",  label: "Detail",      emoji: "📋", badge: 0 },
            { id: "submit",  label: "Pengumpulan", emoji: "📤", badge: tugas.submissions.length },
            { id: "comment", label: "Diskusi",     emoji: "💬", badge: tugas.comments.length },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium transition-all border-b-2 -mb-px ${
                tab === t.id
                  ? "text-mhs-amber border-mhs-amber bg-mhs-amber/5 rounded-t-lg"
                  : "text-mhs-muted border-transparent hover:text-mhs-text"
              }`}
            >
              {t.emoji} {t.label}
              {t.badge > 0 && (
                <span className="bg-mhs-green/20 text-mhs-green text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── DETAIL ── */}
          {tab === "detail" && (
            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-mhs-card border border-mhs-border rounded-xl px-4 py-3">
                  <div className="text-[10px] text-mhs-muted uppercase tracking-wide mb-1">Deadline</div>
                  <div className={`text-[16px] font-bold ${dlCls}`}>
                    {new Date(tugas.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${dlCls} opacity-80`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} hari telat` : daysLeft === 0 ? "Hari ini" : `H-${daysLeft}`}
                  </div>
                </div>
                <div className="bg-mhs-card border border-mhs-border rounded-xl px-4 py-3">
                  <div className="text-[10px] text-mhs-muted uppercase tracking-wide mb-1">Kelompok</div>
                  <div className="text-[16px] font-bold text-mhs-purple">{group?.members.length ?? "-"} anggota</div>
                  <div className="text-[11px] mt-0.5 text-mhs-muted truncate">{tugas.groupName}</div>
                </div>
                <div className="bg-mhs-card border border-mhs-border rounded-xl px-4 py-3">
                  <div className="text-[10px] text-mhs-muted uppercase tracking-wide mb-1">Pengumpulan</div>
                  <div className="text-[16px] font-bold text-mhs-teal">{tugas.submissions.length} file</div>
                  <div className="text-[11px] mt-0.5 text-mhs-muted">
                    {tugas.status === "dikumpulkan" ? "Menunggu review" : tugas.status === "selesai" ? "Selesai" : canSubmit ? "Belum dikumpulkan" : ""}
                  </div>
                </div>
              </div>

              {group && group.members.length > 0 && (
                <div>
                  <div className="text-[10px] text-mhs-muted uppercase tracking-[0.1em] mb-2.5">Anggota Tim</div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.members.map((m, mi) => (
                      <div key={mi} className="bg-mhs-card border border-mhs-border rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${MEMBER_GRADIENTS[mi % MEMBER_GRADIENTS.length]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                          {m.nama.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium text-mhs-text truncate">{m.nama}</div>
                          <div className="font-mono text-[10px] text-mhs-muted">{m.nim}</div>
                        </div>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${m.role === "Leader" ? "bg-mhs-amber/15 text-mhs-amber" : "bg-mhs-purple/10 text-mhs-purple"}`}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PENGUMPULAN ── */}
          {tab === "submit" && (
            <div className="p-6 flex flex-col gap-5">
              {tugas.status === "dikumpulkan" && (
                <div className="bg-mhs-purple/10 border border-mhs-purple/25 rounded-xl px-4 py-3 text-[12.5px] text-mhs-purple flex items-center gap-2">
                  <Clock size={14} className="shrink-0" /> Tugas sudah dikumpulkan, sedang menunggu review dosen.
                </div>
              )}
              {tugas.status === "selesai" && (
                <div className="bg-mhs-green/10 border border-mhs-green/25 rounded-xl px-4 py-3 text-[12.5px] text-mhs-green flex items-center gap-2">
                  <CheckCircle2 size={14} className="shrink-0" /> Tugas telah selesai dan dinilai.
                </div>
              )}

              {canSubmit && (
                <>
                  <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 flex flex-col gap-3">
                    <div className="text-[13px] font-semibold text-mhs-text flex items-center gap-2">
                      <Upload size={14} />
                      {tugas.status === "revisi" ? "Upload Revisi" : "Upload File"}
                    </div>
                    {submitDone && (
                      <div className="bg-mhs-green/10 border border-mhs-green/25 rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-mhs-green shrink-0" />
                        <span className="text-[12px] text-mhs-green font-medium">Berhasil dikumpulkan! Menunggu review dosen.</span>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" onChange={e => { const f = e.target.files?.[0]; if (f) { setSelectedFile(f); setSubmitDone(false); }}} className="hidden" id="tk-file" />
                    <label htmlFor="tk-file" className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-all ${selectedFile ? "border-mhs-green/40 bg-mhs-green/5" : "border-mhs-border hover:border-mhs-amber/50"}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selectedFile ? "bg-mhs-green/15 text-mhs-green" : "bg-mhs-bg text-mhs-muted"}`}>
                        {selectedFile ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                      </div>
                      <div className="min-w-0">
                        {selectedFile ? (
                          <><div className="text-[12.5px] font-medium text-mhs-text truncate">{selectedFile.name}</div><div className="text-[11px] text-mhs-muted">{(selectedFile.size/1024/1024).toFixed(2)} MB</div></>
                        ) : (
                          <><div className="text-[12.5px] font-medium text-mhs-text">Pilih file</div><div className="text-[11px] text-mhs-muted">PDF, DOCX, ZIP, dan lainnya</div></>
                        )}
                      </div>
                    </label>
                    <textarea value={submitNote} onChange={e => setSubmitNote(e.target.value)} placeholder="Catatan pengumpulan (opsional)…" rows={2} className="w-full bg-mhs-bg border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none" />
                    <button onClick={handleFileSubmit} disabled={!selectedFile} className="bg-mhs-amber hover:bg-mhs-amber-2 disabled:opacity-40 disabled:cursor-not-allowed text-mhs-on font-semibold py-2.5 rounded-xl text-[13px] transition-all flex items-center justify-center gap-2">
                      <Upload size={14} /> Kumpulkan
                    </button>
                  </div>

                  <div className="bg-mhs-card border border-mhs-border rounded-xl p-5 flex flex-col gap-3">
                    <div className="text-[13px] font-semibold text-mhs-text flex items-center gap-2"><Paperclip size={14} /> Lampirkan Link</div>
                    <div className="text-[11px] text-mhs-muted">Google Drive, GitHub, Figma, atau URL lainnya.</div>
                    {linkDone && (
                      <div className="bg-mhs-green/10 border border-mhs-green/25 rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-mhs-green shrink-0" />
                        <span className="text-[12px] text-mhs-green font-medium">Link berhasil dilampirkan!</span>
                      </div>
                    )}
                    <input type="url" value={linkUrl} onChange={e => { setLinkUrl(e.target.value); setLinkDone(false); }} placeholder="https://drive.google.com/..." className="w-full bg-mhs-bg border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors" />
                    <textarea value={linkNote} onChange={e => setLinkNote(e.target.value)} placeholder="Deskripsi link (opsional)…" rows={2} className="w-full bg-mhs-bg border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none" />
                    <button onClick={handleLinkSubmit} disabled={!linkUrl.trim()} className="bg-mhs-teal hover:bg-mhs-teal/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all flex items-center justify-center gap-2">
                      <Paperclip size={14} /> Lampirkan
                    </button>
                  </div>
                </>
              )}

              {tugas.submissions.length > 0 && (
                <div>
                  <div className="text-[10px] text-mhs-muted uppercase tracking-[0.1em] mb-2.5">Riwayat Pengumpulan</div>
                  <div className="flex flex-col gap-2">
                    {tugas.submissions.map((s, idx) => (
                      <div key={s.id ?? idx} className="bg-mhs-card border border-mhs-border rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.type === "link" ? "bg-mhs-teal/15 text-mhs-teal" : "bg-mhs-green/15 text-mhs-green"}`}>
                          {s.type === "link" ? <Paperclip size={12} /> : <CheckCircle2 size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {s.type === "link" ? (
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-mhs-teal hover:underline truncate block">{s.url ?? s.fileName}</a>
                          ) : (
                            <div className="text-[12px] font-medium text-mhs-text truncate">{s.fileName}</div>
                          )}
                          {s.note && <div className="text-[10px] text-mhs-muted italic mt-0.5">&quot;{s.note}&quot;</div>}
                          <div className="text-[10px] text-mhs-muted mt-0.5">{s.submittedBy} · {s.submittedAt} · {s.fileSize}</div>
                        </div>
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
                  <div className="flex flex-col items-center justify-center py-12 text-mhs-muted/50">
                    <MessageSquare size={32} className="mb-2 opacity-40" />
                    <span className="text-[12px]">Belum ada diskusi. Mulai percakapan!</span>
                  </div>
                )}
                {tugas.comments.map((c, ci) => {
                  const isMine = c.role === "mahasiswa";
                  return (
                    <div key={c.id ?? ci} className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${c.role === "dosen" ? "bg-gradient-to-br from-[#166534] to-[#0d9488]" : "bg-gradient-to-br from-mhs-amber to-mhs-amber-2"}`}>
                        {c.author.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className={`max-w-[480px] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                        <div className={`flex items-center gap-1.5 mb-1 ${isMine ? "flex-row-reverse" : ""}`}>
                          <span className="text-[11px] font-semibold text-mhs-text">{c.author}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.role === "dosen" ? "bg-mhs-teal/15 text-mhs-teal" : "bg-mhs-amber/15 text-mhs-amber"}`}>
                            {c.role === "dosen" ? "Dosen" : "Saya"}
                          </span>
                        </div>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${isMine ? "bg-mhs-amber/15 text-mhs-text rounded-tr-sm" : "bg-mhs-card text-mhs-text rounded-tl-sm border border-mhs-border"}`}>
                          {c.text}
                        </div>
                        <span className="text-[10px] text-mhs-muted mt-1">{c.time}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={commentsEndRef} />
              </div>
              <div className="px-5 py-3 border-t border-mhs-border bg-mhs-surface shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendComment(); }}}
                    placeholder="Tulis pesan diskusi…"
                    rows={2}
                    className="flex-1 bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none"
                  />
                  <button onClick={handleSendComment} disabled={!commentText.trim()} className="w-9 h-9 bg-mhs-amber hover:bg-mhs-amber-2 disabled:opacity-40 text-mhs-on rounded-xl flex items-center justify-center transition-all shrink-0">
                    <Send size={14} />
                  </button>
                </div>
                <div className="text-[10px] text-mhs-muted mt-1.5">Enter untuk kirim · Shift+Enter baris baru</div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 border-t border-mhs-border shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-mhs-muted">
            Dibuat oleh: <span className="text-mhs-text font-medium">{tugas.createdBy === "dosen" ? "Dosen" : "Mahasiswa"}</span>
            <span className="mx-1.5 opacity-40">·</span>
            <span>{tugas.createdAt}</span>
          </div>
          <button onClick={onClose} className="bg-mhs-amber hover:bg-mhs-amber-2 text-mhs-on px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ── Create Modal ───────────────────────────── */
function CreateTugasModal({ kelompokList, onClose, onAdd }: {
  kelompokList: Kelompok[];
  onClose: () => void;
  onAdd: () => void;
}) {
  const [title, setTitle]             = useState("");
  const [desc, setDesc]               = useState("");
  const [deadline, setDeadline]       = useState("");
  const [selectedCourse, setCourse]   = useState("");
  const [selectedGroupId, setGroupId] = useState("");

  const courses       = [...new Set(kelompokList.map(g => g.course))].sort();
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
      <div className="relative bg-mhs-surface border border-mhs-border rounded-[16px] p-8 text-center max-w-sm w-full shadow-xl">
        <div className="text-3xl mb-3">👥</div>
        <div className="text-[15px] font-semibold text-mhs-text mb-2">Belum ada kelompok</div>
        <p className="text-[13px] text-mhs-muted mb-4">Buat kelompok di tab Kelompok terlebih dahulu, lalu kembali ke sini.</p>
        <button onClick={onClose} className="bg-mhs-amber text-mhs-on px-5 py-2 rounded-lg text-[13px] font-semibold">Tutup</button>
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
      createdBy: "mahasiswa",
    });
    onAdd();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-mhs-surface border border-mhs-border rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-[480px]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-mhs-border">
          <div className="text-[15px] font-bold text-mhs-text">Buat Tugas Kelompok</div>
          <button onClick={onClose} className="text-mhs-muted hover:text-mhs-text transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5 block">Judul Tugas</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Laporan Analisis Sistem…" className="w-full bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[13px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5 block">Deskripsi <span className="normal-case text-mhs-muted/60">(opsional)</span></label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Jelaskan tugas ini…" rows={2} className="w-full bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[13px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none" />
          </div>
          <div>
            <label className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5 block">Mata Kuliah</label>
            <select
              value={selectedCourse}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[13px] text-mhs-text outline-none focus:border-mhs-amber transition-colors"
            >
              <option value="">— Pilih mata kuliah —</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5 block">
              Kelompok <span className="text-mhs-amber normal-case">
                {selectedCourse ? `(${filteredGroups.length} kelompok di mata kuliah ini)` : "(pilih mata kuliah dulu)"}
              </span>
            </label>
            <select
              value={group?.id ?? ""}
              onChange={e => setGroupId(e.target.value)}
              disabled={!selectedCourse || filteredGroups.length === 0}
              className="w-full bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[13px] text-mhs-text outline-none focus:border-mhs-amber transition-colors disabled:opacity-50"
            >
              {filteredGroups.length === 0
                ? <option value="">Tidak ada kelompok untuk mata kuliah ini</option>
                : filteredGroups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.members.length} anggota)</option>)
              }
            </select>
            {group && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.members.map((m, mi) => (
                  <div key={mi} className="flex items-center gap-1.5 bg-mhs-card border border-mhs-border rounded-lg px-2.5 py-1">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${MEMBER_GRADIENTS[mi % MEMBER_GRADIENTS.length]} flex items-center justify-center text-[8px] font-bold text-white`}>
                      {m.nama.slice(0, 2)}
                    </div>
                    <span className="text-[11px] text-mhs-text">{m.nama}</span>
                    <span className={`text-[9px] ${m.role === "Leader" ? "text-mhs-amber" : "text-mhs-muted"}`}>{m.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5 block">Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[13px] text-mhs-text outline-none focus:border-mhs-amber transition-colors" />
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-mhs-border text-mhs-muted hover:text-mhs-text py-2.5 rounded-xl text-[13px] font-medium transition-colors">Batal</button>
          <button onClick={handleSubmit} disabled={!title.trim() || !deadline || !selectedCourse || !group} className="flex-1 bg-mhs-amber hover:bg-mhs-amber-2 disabled:opacity-40 disabled:cursor-not-allowed text-mhs-on py-2.5 rounded-xl text-[13px] font-semibold transition-colors">
            Buat Tugas
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────── */
export default function ProyekPage() {
  const topbarQ = useSearch();
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

  const filtered = tugasList.filter(t => {
    const q = topbarQ.toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.course.toLowerCase().includes(q) || t.groupName.toLowerCase().includes(q);
    const matchFilter = filterStatus === "semua" || t.status === filterStatus;
    return matchQ && matchFilter;
  });

  const counts = {
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
          <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[26px] text-mhs-text leading-tight">
            Tugas <span className="text-mhs-amber">Kelompok</span>
          </div>
          <p className="text-[12px] text-mhs-muted mt-0.5">Buat &amp; kelola tugas kelompokmu · Kumpulkan · Tunggu review dosen</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-mhs-amber text-mhs-on px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-mhs-amber-2 transition-colors flex items-center gap-1.5"
        >
          <Plus size={15} /> Buat Tugas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {([
          { key: "aktif",       label: "Aktif",        icon: <Clock size={18} />,        cls: "text-mhs-teal",   bg: "bg-mhs-teal/8"   },
          { key: "dikumpulkan", label: "Dikumpulkan",  icon: <Upload size={18} />,       cls: "text-mhs-purple", bg: "bg-mhs-purple/8" },
          { key: "revisi",      label: "Perlu Revisi", icon: <AlertCircle size={18} />,  cls: "text-mhs-rose",   bg: "bg-mhs-rose/8"   },
          { key: "selesai",     label: "Selesai",      icon: <CheckCircle2 size={18} />, cls: "text-mhs-green",  bg: "bg-mhs-green/8"  },
        ] as const).map(s => (
          <button
            key={s.key}
            onClick={() => setFilterStatus(prev => prev === s.key ? "semua" : s.key)}
            className={`${s.bg} border rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-all ${
              filterStatus === s.key ? "border-current ring-1 ring-inset" : "border-mhs-border/60 hover:border-mhs-border"
            }`}
          >
            <span className={s.cls}>{s.icon}</span>
            <div>
              <div className={`font-serif text-[22px] leading-none ${s.cls}`}>{counts[s.key]}</div>
              <div className="text-[11px] text-mhs-muted mt-0.5">{s.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Alur workflow info */}
      {tugasList.length === 0 && (
        <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-8">
          <div className="text-[13px] font-semibold text-mhs-text mb-4 text-center">Alur Tugas Kelompok</div>
          <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
            {[
              { icon: "👥", label: "Buat Kelompok",    sub: "di tab Kelompok" },
              { icon: "📝", label: "Buat Tugas",       sub: "atau dari dosen" },
              { icon: "📤", label: "Kumpulkan",        sub: "upload file/link" },
              { icon: "👁",  label: "Review Dosen",    sub: "acc / revisi" },
              { icon: "✅", label: "Nilai",            sub: "tugas selesai" },
            ].map((step, si) => (
              <div key={si} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 text-center min-w-0 px-1">
                  <div className="w-10 h-10 rounded-full bg-mhs-surface border-2 border-mhs-border flex items-center justify-center text-[18px] mb-1.5">{step.icon}</div>
                  <div className="text-[11px] font-semibold text-mhs-text leading-tight">{step.label}</div>
                  <div className="text-[9.5px] text-mhs-muted mt-0.5">{step.sub}</div>
                </div>
                {si < 4 && <div className="text-mhs-muted/40 text-[18px] -mt-5 shrink-0">→</div>}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button onClick={() => setShowCreate(true)} className="bg-mhs-amber hover:bg-mhs-amber-2 text-mhs-on px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-colors">
              + Buat Tugas Kelompok Pertama
            </button>
          </div>
        </div>
      )}

      {/* Task cards */}
      {tugasList.length > 0 && filtered.length === 0 && (
        <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-10 text-center text-mhs-muted">
          <Layers size={28} className="mx-auto mb-2 opacity-40" />
          <div className="text-[13px]">Tidak ada tugas yang cocok.</div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map(t => {
            const si = STATUS_INFO[t.status];
            const dl = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / 86400000);
            const dlCls = dl < 0 ? "text-mhs-rose" : dl <= 3 ? "text-mhs-amber" : "text-mhs-muted";
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTugas(t)}
                className="bg-mhs-card border border-mhs-border rounded-[14px] px-5 py-4 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${si.cls}`}>{si.label}</span>
                      <span className="text-[10px] text-mhs-muted">{t.course}</span>
                      <span className="text-[10px] text-mhs-muted">👥 {t.groupName}</span>
                      {t.createdBy === "dosen" && <span className="text-[10px] font-semibold text-mhs-purple bg-mhs-purple/10 px-1.5 py-0.5 rounded-full">Dari Dosen</span>}
                    </div>
                    <div className="text-[14.5px] font-semibold text-mhs-text">{t.title}</div>
                    {t.description && <p className="text-[12px] text-mhs-muted mt-0.5 line-clamp-1">{t.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-mono text-[12px] font-semibold ${dlCls}`}>
                      {dl < 0 ? `+${Math.abs(dl)}d` : dl === 0 ? "Hari ini" : `H-${dl}`}
                    </div>
                    <div className="text-[10px] text-mhs-muted mt-0.5">{new Date(t.deadline).toLocaleDateString("id-ID", { day:"2-digit", month:"short" })}</div>
                  </div>
                </div>

                {/* Mini workflow */}
                <div className="mt-3 pt-3 border-t border-mhs-border/50">
                  <WorkflowTrack status={t.status} />
                </div>

                {t.status === "revisi" && t.catatanRevisi && (
                  <div className="mt-2 bg-mhs-rose/8 border border-mhs-rose/20 rounded-lg px-3 py-2 text-[11px] text-mhs-rose">
                    <span className="font-semibold">Revisi: </span>{t.catatanRevisi}
                  </div>
                )}

                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-mhs-muted">
                  {t.submissions.length > 0 && <span>📎 {t.submissions.length} file</span>}
                  {t.comments.length > 0 && <span>💬 {t.comments.length} pesan</span>}
                  {t.nilaiAkhir !== undefined && <span className="text-mhs-green font-semibold">★ {t.nilaiAkhir}</span>}
                  <span className="ml-auto opacity-50">Klik untuk detail →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTugas && (
        <TugasDetailModal
          tugas={selectedTugas}
          kelompokList={kelompokList}
          onClose={() => setSelectedTugas(null)}
          onRefresh={refresh}
        />
      )}

      {showCreate && (
        <CreateTugasModal
          kelompokList={kelompokList}
          onClose={() => setShowCreate(false)}
          onAdd={refresh}
        />
      )}
    </div>
  );
}
