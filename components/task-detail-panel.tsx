"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Paperclip, X, Send, Upload, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import { addSubmission, addComment, markCompleted, type TaskEntry } from "@/lib/taskStore";
import type { SeedData } from "@/data/sim-data";

export type MhsTask = SeedData["mahasiswa"]["tasks"][0];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/* ── Helpers ─────────────────────────────────── */
const MK_COLORS = [
  "bg-[#e11d48]/10 text-[#e11d48]",
  "bg-[#0284c7]/10 text-[#0284c7]",
  "bg-[#7c3aed]/10 text-[#7c3aed]",
  "bg-[#d97706]/10 text-[#d97706]",
  "bg-[#15803d]/10 text-[#15803d]",
  "bg-[#0891b2]/10 text-[#0891b2]",
];

export function mkColor(course: string) {
  const idx = [...course].reduce((a, c) => a + c.charCodeAt(0), 0) % MK_COLORS.length;
  return MK_COLORS[idx];
}

export function deadlineInfo(dateStr: string, isSelesai = false) {
  if (isSelesai) return { label: "Selesai", cls: "bg-mhs-green/15 text-mhs-green" };
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0)   return { label: `${Math.abs(diff)} hari telat`, cls: "bg-mhs-rose/15 text-mhs-rose" };
  if (diff === 0) return { label: "Hari ini",                     cls: "bg-mhs-rose/15 text-mhs-rose" };
  if (diff <= 3)  return { label: `H-${diff}`,                    cls: "bg-mhs-rose/15 text-mhs-rose" };
  if (diff <= 7)  return { label: `H-${diff}`,                    cls: "bg-mhs-amber/15 text-mhs-amber" };
  return               { label: `H-${diff}`,                      cls: "bg-mhs-teal/10 text-mhs-teal" };
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Component ───────────────────────────────── */
const STATUS_CLS: Record<string, string> = {
  "selesai":           "bg-mhs-green/15 text-mhs-green",
  "sedang dikerjakan": "bg-mhs-teal/15 text-mhs-teal",
  "menunggu review":   "bg-mhs-purple/15 text-mhs-purple",
  "belum mulai":       "bg-mhs-muted/15 text-mhs-muted",
};

export function TaskDetailPanel({
  task: initialTask,
  localData,
  onClose,
  onSubmitted,
  onCommented,
  submittedBy = "Febiyanto Rizki Qurbandi",
}: {
  task: MhsTask;
  localData: TaskEntry | undefined;
  onClose: () => void;
  onSubmitted: (taskId?: string) => void;
  onCommented: (taskId?: string) => void;
  submittedBy?: string;
}) {
  const { data: apiData, mutate: mutateTask } = useSWR(`/api/tugas/${initialTask.id}`, fetcher);
  const task = apiData?.task || initialTask;

  const [tab, setTab] = useState("submit");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitNote, setSubmitNote] = useState("");
  const [submitDone, setSubmitDone] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNote, setLinkNote] = useState("");
  const [linkDone, setLinkDone] = useState(false);
  const [commentText, setCommentText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const dl = deadlineInfo(task.deadline, task.status === "selesai");

  const dbComments = (task.comments || []).map((c: any) => ({
    id: c.id,
    author: c.mahasiswa?.nama || c.dosen?.nama || "Sistem",
    role: c.mahasiswa ? "mahasiswa" : c.dosen ? "dosen" : "sistem",
    text: c.text,
    time: new Date(c.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
  }));

  const dbSubs = (task.submissions || []).map((s: any) => ({
    id: s.id,
    fileName: s.fileName || s.url || "Lampiran",
    fileSize: s.fileSize || "—",
    submittedBy: s.mahasiswa?.nama || "Mahasiswa",
    note: s.note || "",
    submittedAt: new Date(s.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
    url: s.url,
    type: s.type,
  }));

  const allSubs     = [...dbSubs, ...(localData?.submissions || [])];
  const allComments = [...dbComments, ...(localData?.comments || [])];

  useEffect(() => {
    setSubmitDone(false);
    setSelectedFile(null);
    setSubmitNote("");
    setLinkUrl("");
    setLinkNote("");
    setLinkDone(false);
    setCommentText("");
    setTab("submit");
  }, [initialTask.id]);

  useEffect(() => {
    if (tab === "comment") commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tab, allComments.length]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }

  async function handleSubmit() {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Gagal mengunggah file");
      }

      const subRes = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTugas: task.id,
          fileName: selectedFile.name,
          fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
          note: submitNote,
          url: uploadData.url,
          type: "file",
        }),
      });

      if (!subRes.ok) {
        throw new Error("Gagal mengirim jawaban tugas");
      }

      mutateTask();
      setSubmitDone(true);
      setSelectedFile(null);
      setSubmitNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSubmitted(task.id);
    } catch (err) {
      console.error(err);
      addSubmission(task.id, task.title, task.course, {
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        submittedBy,
        note: submitNote,
        type: "file",
      });
      markCompleted(task.id);
      setSubmitDone(true);
      setSelectedFile(null);
      setSubmitNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSubmitted(task.id);
    }
  }

  async function handleSubmitLink() {
    const url = linkUrl.trim();
    if (!url) return;
    try { new URL(url); } catch { return; }

    try {
      const res = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTugas: task.id,
          fileName: url.length > 50 ? url.slice(0, 50) + "…" : url,
          fileSize: "—",
          note: linkNote,
          url,
          type: "link",
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim link tugas");
      }

      mutateTask();
      setLinkDone(true);
      setLinkUrl("");
      setLinkNote("");
      onSubmitted(task.id);
    } catch (err) {
      console.error(err);
      addSubmission(task.id, task.title, task.course, {
        fileName: url.length > 50 ? url.slice(0, 50) + "…" : url,
        fileSize: "—",
        submittedBy,
        note: linkNote,
        url,
        type: "link",
      });
      setLinkDone(true);
      setLinkUrl("");
      setLinkNote("");
      onSubmitted(task.id);
    }
  }

  async function handleSendComment() {
    const text = commentText.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/tugas/${task.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim komentar");
      }

      mutateTask();
      setCommentText("");
      onCommented(task.id);
    } catch (err) {
      console.error(err);
      addComment(task.id, task.title, task.course, {
        author: submittedBy,
        role: "mahasiswa",
        text,
      });
      setCommentText("");
      onCommented(task.id);
    }
  }

  const PRIORITY_CLS: Record<string, string> = {
    kritis: "bg-mhs-rose/15 text-mhs-rose",
    tinggi: "bg-mhs-rose/10 text-mhs-rose",
    sedang: "bg-mhs-amber/15 text-mhs-amber",
    rendah: "bg-mhs-green/10 text-mhs-green",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-mhs-surface border border-mhs-border rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.35)] w-full max-w-[820px] max-h-[88vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-mhs-border shrink-0 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${mkColor(task.course)}`}>{task.course}</span>
              {task.type === "kelompok" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-mhs-purple/10 text-mhs-purple">👥 Kelompok</span>
              )}
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLS[task.status] ?? "bg-mhs-muted/10 text-mhs-muted"}`}>
                {task.status}
              </span>
              {"priority" in task && (task as MhsTask & { priority?: string }).priority && (
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${PRIORITY_CLS[(task as MhsTask & { priority: string }).priority] ?? "bg-mhs-border text-mhs-muted"}`}>
                  {(task as MhsTask & { priority: string }).priority}
                </span>
              )}
            </div>
            <div className="text-[17px] font-bold text-mhs-text leading-snug">{task.title}</div>
          </div>
          <button onClick={onClose} className="text-mhs-muted hover:text-mhs-text transition-colors p-1.5 hover:bg-mhs-card rounded-lg shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Body — two column */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — task info */}
          <div className="w-[280px] shrink-0 border-r border-mhs-border flex flex-col overflow-y-auto">
            <div className="p-5 flex flex-col gap-4">

              {/* Deadline */}
              <div>
                <div className="text-[10px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5">Deadline</div>
                <div className={`inline-flex items-center gap-1.5 font-mono text-[12px] px-3 py-1.5 rounded-lg ${dl.cls}`}>
                  <span>{formatDate(task.deadline)}</span>
                  <span className="opacity-70">·</span>
                  <span className="font-semibold">{dl.label}</span>
                </div>
              </div>

              {/* Description / note */}
              {task.note && (
                <div>
                  <div className="text-[10px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5">Deskripsi</div>
                  <p className="text-[12.5px] text-mhs-text leading-relaxed bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5">
                    {task.note}
                  </p>
                </div>
              )}

              {/* Submission summary */}
              <div>
                <div className="text-[10px] text-mhs-muted uppercase tracking-[0.08em] mb-1.5">Pengumpulan</div>
                {allSubs.length === 0 ? (
                  <div className="bg-mhs-card border border-mhs-border rounded-xl px-3 py-3 text-[12px] text-mhs-muted text-center">
                    Belum ada file dikumpulkan
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {allSubs.map((s, i) => (
                      <div key={s.id || i} className="bg-mhs-card border border-mhs-border rounded-xl p-3 flex items-start gap-2">
                        <div className="w-7 h-7 rounded-lg bg-mhs-green/15 text-mhs-green flex items-center justify-center shrink-0">
                          <Paperclip size={12} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-medium text-mhs-text truncate">{s.fileName}</div>
                          <div className="text-[10px] text-mhs-muted mt-0.5">{s.submittedBy} · {s.submittedAt}</div>
                          {s.note && <div className="text-[10px] text-mhs-muted italic mt-0.5">"{s.note}"</div>}
                        </div>
                        <CheckCircle2 size={12} className="text-mhs-green shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment count */}
              <div className="flex items-center gap-2 text-[12px] text-mhs-muted">
                <MessageSquare size={13} />
                <span>{allComments.length} komentar</span>
              </div>
            </div>
          </div>

          {/* RIGHT — tabs */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="flex gap-0.5 px-4 pt-3 pb-0 shrink-0 border-b border-mhs-border">
              <button
                onClick={() => setTab("submit")}
                className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium transition-all border-b-2 -mb-px ${
                  tab === "submit"
                    ? "text-mhs-amber border-mhs-amber bg-mhs-amber/5 rounded-t-lg"
                    : "text-mhs-muted border-transparent hover:text-mhs-text"
                }`}
              >
                <Upload size={13} /> Kumpulkan
                {allSubs.length > 0 && (
                  <span className="bg-mhs-green/20 text-mhs-green text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {allSubs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("comment")}
                className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium transition-all border-b-2 -mb-px ${
                  tab === "comment"
                    ? "text-mhs-amber border-mhs-amber bg-mhs-amber/5 rounded-t-lg"
                    : "text-mhs-muted border-transparent hover:text-mhs-text"
                }`}
              >
                <MessageSquare size={13} /> Komentar
                {allComments.length > 0 && (
                  <span className="bg-mhs-muted/20 text-mhs-muted text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {allComments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("link")}
                className={`flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-medium transition-all border-b-2 -mb-px ${
                  tab === "link"
                    ? "text-mhs-amber border-mhs-amber bg-mhs-amber/5 rounded-t-lg"
                    : "text-mhs-muted border-transparent hover:text-mhs-text"
                }`}
              >
                <Paperclip size={13} /> Lampiran Link
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">

              {/* ── SUBMIT TAB ── */}
              {tab === "submit" && (
                <div className="p-5 flex flex-col gap-4">
                  {submitDone && (
                    <div className="bg-mhs-green/10 border border-mhs-green/25 rounded-xl px-4 py-3 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-mhs-green shrink-0" />
                      <span className="text-[12.5px] text-mhs-green font-medium">Tugas berhasil dikumpulkan!</span>
                    </div>
                  )}
                  <div className="bg-mhs-card border border-mhs-border rounded-xl p-4">
                    <div className="text-[12px] font-semibold text-mhs-text mb-3">
                      {allSubs.length > 0 ? "Kumpulkan Revisi" : "Kumpulkan Tugas"}
                    </div>
                    <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" id="file-upload-panel" />
                    <label
                      htmlFor="file-upload-panel"
                      className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-all mb-3 ${
                        selectedFile ? "border-mhs-green/40 bg-mhs-green/5" : "border-mhs-border hover:border-mhs-amber/50"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selectedFile ? "bg-mhs-green/15 text-mhs-green" : "bg-mhs-bg text-mhs-muted"}`}>
                        {selectedFile ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                      </div>
                      <div className="min-w-0">
                        {selectedFile ? (
                          <>
                            <div className="text-[12.5px] font-medium text-mhs-text truncate">{selectedFile.name}</div>
                            <div className="text-[11px] text-mhs-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                          </>
                        ) : (
                          <>
                            <div className="text-[12.5px] font-medium text-mhs-text">Pilih file</div>
                            <div className="text-[11px] text-mhs-muted">PDF, DOCX, ZIP, dll.</div>
                          </>
                        )}
                      </div>
                    </label>
                    <textarea
                      value={submitNote}
                      onChange={e => setSubmitNote(e.target.value)}
                      placeholder="Catatan pengumpulan (opsional)…"
                      rows={3}
                      className="w-full bg-mhs-bg border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none mb-3"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedFile}
                      className="w-full bg-mhs-amber hover:bg-mhs-amber-2 disabled:opacity-40 disabled:cursor-not-allowed text-mhs-on font-semibold py-2.5 rounded-xl text-[13px] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(217,119,6,0.35)] active:translate-y-0 flex items-center justify-center gap-2"
                    >
                      <Upload size={14} /> Kumpulkan Tugas
                    </button>
                  </div>
                </div>
              )}

              {/* ── LINK TAB ── */}
              {tab === "link" && (
                <div className="p-5 flex flex-col gap-4">
                  {linkDone && (
                    <div className="bg-mhs-green/10 border border-mhs-green/25 rounded-xl px-4 py-3 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-mhs-green shrink-0" />
                      <span className="text-[12.5px] text-mhs-green font-medium">Link berhasil dilampirkan!</span>
                    </div>
                  )}
                  <div className="bg-mhs-card border border-mhs-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="text-[12px] font-semibold text-mhs-text">Lampirkan Link Eksternal</div>
                    <div className="text-[11px] text-mhs-muted">
                      Google Drive, GitHub, Figma, OneDrive, atau URL lainnya.
                    </div>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-mhs-bg border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors"
                    />
                    <textarea
                      value={linkNote}
                      onChange={e => setLinkNote(e.target.value)}
                      placeholder="Deskripsi link (opsional)…"
                      rows={2}
                      className="w-full bg-mhs-bg border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none"
                    />
                    <button
                      onClick={handleSubmitLink}
                      disabled={!linkUrl.trim()}
                      className="w-full bg-mhs-teal hover:bg-mhs-teal/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all flex items-center justify-center gap-2"
                    >
                      <Paperclip size={14} /> Lampirkan Link
                    </button>
                  </div>

                  {/* Existing link attachments */}
                  {(allSubs as Array<{id: string; fileName: string; fileSize: string; note: string; submittedAt: string; url?: string; type?: string}>).filter(s => s.type === "link" || s.url).length > 0 && (
                    <div>
                      <div className="text-[12px] font-semibold text-mhs-text mb-2">Link Terlampir</div>
                      <div className="flex flex-col gap-2">
                        {(allSubs as Array<{id: string; fileName: string; fileSize: string; note: string; submittedAt: string; url?: string; type?: string}>).filter(s => s.type === "link" || s.url).map(s => (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-mhs-card border border-mhs-border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-mhs-teal transition-colors"
                          >
                            <Paperclip size={15} className="text-mhs-teal shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] text-mhs-teal truncate">{s.url ?? s.fileName}</div>
                              {s.note && <div className="text-[11px] text-mhs-muted mt-0.5">{s.note}</div>}
                              <div className="text-[10px] text-mhs-muted mt-0.5">{s.submittedAt}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── COMMENT TAB ── */}
              {tab === "comment" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                    {allComments.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-mhs-muted/50">
                        <MessageSquare size={32} className="mb-2 opacity-40" />
                        <span className="text-[12px]">Belum ada komentar</span>
                      </div>
                    )}
                    {allComments.map((c, i) => {
                      const isMine = c.role === "mahasiswa";
                      return (
                        <div key={c.id || i} className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : ""}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${
                            c.role === "dosen" ? "bg-gradient-to-br from-forest to-teal" : "bg-gradient-to-br from-mhs-amber to-mhs-amber-2"
                          }`}>
                            {c.author.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <div className={`max-w-[320px] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                            <div className={`flex items-center gap-1.5 mb-1 ${isMine ? "flex-row-reverse" : ""}`}>
                              <span className="text-[11px] font-semibold text-mhs-text">{c.author}</span>
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.role === "dosen" ? "bg-forest/15 text-forest" : "bg-mhs-amber/15 text-mhs-amber"}`}>
                                {c.role === "dosen" ? "Dosen" : "Saya"}
                              </span>
                            </div>
                            <div className={`rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                              isMine
                                ? "bg-mhs-amber/15 text-mhs-text rounded-tr-sm"
                                : "bg-mhs-card text-mhs-text rounded-tl-sm border border-mhs-border"
                            }`}>
                              {c.text}
                            </div>
                            <span className="text-[10px] text-mhs-muted mt-1">{c.time}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={commentsEndRef} />
                  </div>
                  <div className="px-4 py-3 border-t border-mhs-border bg-mhs-surface shrink-0">
                    <div className="flex gap-2 items-end">
                      <textarea
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
                        placeholder="Tulis komentar…"
                        rows={2}
                        className="flex-1 bg-mhs-card border border-mhs-border rounded-xl px-3 py-2.5 text-[12.5px] text-mhs-text placeholder:text-mhs-muted outline-none focus:border-mhs-amber transition-colors resize-none"
                      />
                      <button
                        onClick={handleSendComment}
                        disabled={!commentText.trim()}
                        className="w-9 h-9 bg-mhs-amber hover:bg-mhs-amber-2 disabled:opacity-40 text-mhs-on rounded-xl flex items-center justify-center transition-all shrink-0"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                    <div className="text-[10px] text-mhs-muted mt-1.5">Enter untuk kirim · Shift+Enter untuk baris baru</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
