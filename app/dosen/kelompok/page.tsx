"use client";

import { useState, useEffect } from "react";
import { X, Shuffle, Plus, Check, Trash2, Users, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/lib/search-context";

type Member = { nim: string; nama: string; role: string; joinedAt: string };
type Group = {
  id: string;
  name: string;
  course: string;
  maxSize: number;
  createdBy: string;
  mode: "mahasiswa" | "dosen_manual" | "dosen_random";
  members: Member[];
  createdAt: string;
};

const COURSES = ["Analisis SI", "Keamanan Sistem", "SI Enterprise", "PPL", "Interaksi Manusia & Komputer"];

const ALL_STUDENTS = [
  { nim: "221011400114", nama: "ALDI AL KAHFI" },
  { nim: "231011450403", nama: "Andi Pratama" },
  { nim: "231011400651", nama: "Budi Santoso" },
  { nim: "231011450408", nama: "Candra Wiguna" },
  { nim: "231011450284", nama: "Hendra Saputra" },
  { nim: "231011450319", nama: "FAJAR NUGRAHA" },
  { nim: "231011400835", nama: "GILANG RAMADHAN" },
  { nim: "221011400227", nama: "HENDRA SAPUTRA" },
  { nim: "231011450512", nama: "INDRA PERMANA" },
  { nim: "231011400943", nama: "JOKO SANTOSO" },
  { nim: "231011450601", nama: "KEVIN ALVARO" },
  { nim: "221011400308", nama: "LUTHFI HAKIM" },
];

const AVATAR_COLORS = [
  "from-forest to-teal",
  "from-gold to-forest",
  "from-teal to-blue-400",
  "from-rose to-gold",
  "from-forest to-blue-500",
];

const SEED_GROUPS: Group[] = [
  {
    id: "grp-dosen-seed-1",
    name: "Kelompok 1",
    course: "Analisis SI",
    maxSize: 4,
    createdBy: "dosen",
    mode: "dosen_manual",
    members: [
      { nim: "221011400114", nama: "ALDI AL KAHFI", role: "Leader", joinedAt: "2026-04-01" },
      { nim: "231011450403", nama: "Andi Pratama", role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011400651", nama: "Budi Santoso", role: "Anggota", joinedAt: "2026-04-01" },
    ],
    createdAt: "2026-04-01",
  },
  {
    id: "grp-dosen-seed-2",
    name: "Kelompok 2",
    course: "Analisis SI",
    maxSize: 4,
    createdBy: "dosen",
    mode: "dosen_manual",
    members: [
      { nim: "231011450408", nama: "Candra Wiguna", role: "Leader", joinedAt: "2026-04-01" },
      { nim: "231011450284", nama: "Hendra Saputra", role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450319", nama: "FAJAR NUGRAHA", role: "Anggota", joinedAt: "2026-04-01" },
    ],
    createdAt: "2026-04-01",
  },
];

const today = () => new Date().toISOString().slice(0, 10);

/* ── Edit Group Modal ──────────────────────────── */
function EditGroupModal({
  group,
  onClose,
  onSave,
}: {
  group: Group;
  onClose: () => void;
  onSave: (updated: Group) => void;
}) {
  const [name, setName] = useState(group.name);
  const [maxSize, setMaxSize] = useState(String(group.maxSize));
  const [members, setMembers] = useState<Member[]>([...group.members]);

  const addable = ALL_STUDENTS.filter((s) => !members.some((m) => m.nim === s.nim));
  const isAtLimit = members.length >= parseInt(maxSize);

  const removeMember = (nim: string) => {
    setMembers((prev) => {
      const next = prev.filter((m) => m.nim !== nim);
      if (next.length > 0 && !next.some((m) => m.role === "Leader")) {
        next[0] = { ...next[0], role: "Leader" };
      }
      return next;
    });
  };

  const addMember = (s: { nim: string; nama: string }) => {
    if (isAtLimit) return;
    setMembers((prev) => [...prev, { nim: s.nim, nama: s.nama, role: "Anggota", joinedAt: today() }]);
  };

  const handleSave = () => {
    if (!name || members.length === 0) return;
    onSave({ ...group, name, maxSize: parseInt(maxSize), members });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 pt-20 pb-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-paper border border-border rounded-[18px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] w-full max-w-[720px] max-h-[82vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border shrink-0 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-bold text-ink">Edit Kelompok</div>
            <div className="text-[12px] text-muted mt-0.5">{group.course}</div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink p-1.5 hover:bg-cream rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Name + MaxSize */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Nama Kelompok</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Maks Anggota</label>
              <select
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} orang</option>
                ))}
              </select>
            </div>
          </div>

          {/* Two columns: current + addable */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current members */}
            <div>
              <div className="text-[11px] text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Anggota Saat Ini</span>
                <span className={cn("font-semibold text-[12px]", members.length > parseInt(maxSize) ? "text-rose-500" : "text-forest")}>
                  {members.length}/{maxSize}
                </span>
              </div>
              <div className="space-y-1.5 border border-border rounded-lg p-2 min-h-[120px]">
                {members.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted text-[12px]">Belum ada anggota</div>
                ) : (
                  members.map((m, mi) => (
                    <div key={m.nim} className="flex items-center gap-2 bg-cream rounded-lg px-2.5 py-2">
                      <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-white shrink-0", AVATAR_COLORS[mi % AVATAR_COLORS.length])}>
                        {m.nama.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-ink truncate">{m.nama}</div>
                        {m.role === "Leader" && <div className="text-[9px] text-forest font-bold">Leader</div>}
                      </div>
                      <button onClick={() => removeMember(m.nim)} className="text-muted hover:text-rose-500 transition-colors shrink-0 p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {members.length > parseInt(maxSize) && (
                <div className="mt-1.5 text-[11px] text-rose-500 font-semibold">
                  ⚠️ Anggota melebihi batas — naikkan Maks Anggota atau hapus beberapa.
                </div>
              )}
            </div>

            {/* Add members */}
            <div>
              <div className="text-[11px] text-muted uppercase tracking-wider mb-2">Tambah Anggota</div>
              <div className="space-y-1 border border-border rounded-lg p-2 max-h-[240px] overflow-y-auto">
                {addable.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted text-[12px]">Semua mahasiswa sudah masuk</div>
                ) : (
                  addable.map((s, i) => (
                    <button
                      key={s.nim}
                      onClick={() => addMember(s)}
                      disabled={isAtLimit}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
                    >
                      <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-white shrink-0", AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                        {s.nama.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-ink truncate">{s.nama}</div>
                        <div className="text-[10px] text-muted">{s.nim}</div>
                      </div>
                      <Plus size={12} className="text-forest shrink-0" />
                    </button>
                  ))
                )}
              </div>
              {isAtLimit && addable.length > 0 && (
                <div className="mt-1.5 text-[11px] text-rose-500 font-semibold">Batas maks anggota tercapai</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-muted hover:text-ink border border-border rounded-lg transition-colors">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={members.length === 0 || !name}
            className="px-5 py-2 bg-forest text-white rounded-lg text-[13px] font-semibold hover:bg-forest/90 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <Check size={14} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DosenKelompokPage() {
  const topbarQ = useSearch();
  const [tab, setTab] = useState<"list" | "manual" | "random">("list");
  const [groups, setGroups] = useState<Group[]>([]);
  const [toast, setToast] = useState("");

  // Manual form
  const [mCourse, setMCourse] = useState("");
  const [mName, setMName] = useState("");
  const [mMaxSize, setMMaxSize] = useState("4");
  const [mSelected, setMSelected] = useState<string[]>([]);

  // Random config
  const [rCourse, setRCourse] = useState("");
  const [rMode, setRMode] = useState<"bySize" | "byCount">("bySize");
  const [rValue, setRValue] = useState("4");
  const [rPreview, setRPreview] = useState<Group[] | null>(null);

  // List filter
  const [filterCourse, setFilterCourse] = useState("all");

  // Edit modal
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  useEffect(() => {
    const g = localStorage.getItem("sim_kelompok");
    setGroups(g ? JSON.parse(g) : SEED_GROUPS);
  }, []);

  const persist = (g: Group[]) => {
    setGroups(g);
    localStorage.setItem("sim_kelompok", JSON.stringify(g));
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const dosenGroups = groups.filter(
    (g) => g.mode === "dosen_manual" || g.mode === "dosen_random"
  );

  const filtered = dosenGroups
    .filter((g) => filterCourse === "all" || g.course === filterCourse)
    .filter((g) => !topbarQ || g.name.toLowerCase().includes(topbarQ.toLowerCase()) || g.course.toLowerCase().includes(topbarQ.toLowerCase()) || g.members.some(m => m.nama.toLowerCase().includes(topbarQ.toLowerCase())));

  const groupedByCourse = COURSES.reduce<Record<string, Group[]>>((acc, c) => {
    const list = filtered.filter((g) => g.course === c);
    if (list.length) acc[c] = list;
    return acc;
  }, {});

  const toggleMSelect = (nim: string) =>
    setMSelected((p) => {
      if (p.includes(nim)) return p.filter((n) => n !== nim);
      if (p.length >= parseInt(mMaxSize)) return p;
      return [...p, nim];
    });

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mCourse || mSelected.length === 0) return;
    const members: Member[] = mSelected.map((nim, i) => ({
      nim,
      nama: ALL_STUDENTS.find((s) => s.nim === nim)!.nama,
      role: i === 0 ? "Leader" : "Anggota",
      joinedAt: today(),
    }));
    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: mName,
      course: mCourse,
      maxSize: parseInt(mMaxSize),
      createdBy: "dosen",
      mode: "dosen_manual",
      members,
      createdAt: today(),
    };
    persist([...groups, newGroup]);
    setMName("");
    setMCourse("");
    setMSelected([]);
    flash(`Kelompok "${newGroup.name}" berhasil dibuat!`);
  };

  const handleRandomize = () => {
    if (!rCourse) return;
    const students = shuffle(ALL_STUDENTS);
    const size = parseInt(rValue);
    const generated: Group[] = [];

    if (rMode === "bySize") {
      let i = 0;
      let grpNum = 1;
      while (i < students.length) {
        const chunk = students.slice(i, i + size);
        generated.push({
          id: `grp-rnd-${Date.now()}-${grpNum}`,
          name: `Kelompok ${grpNum}`,
          course: rCourse,
          maxSize: size,
          createdBy: "dosen",
          mode: "dosen_random",
          members: chunk.map((s, mi) => ({
            nim: s.nim,
            nama: s.nama,
            role: mi === 0 ? "Leader" : "Anggota",
            joinedAt: today(),
          })),
          createdAt: today(),
        });
        i += size;
        grpNum++;
      }
    } else {
      const count = parseInt(rValue);
      const base  = Math.floor(students.length / count);
      const extra = students.length % count;
      // Build sizes: all start at base, then add 1 to `extra` randomly chosen slots
      const sizes = shuffle(Array.from({ length: count }, (_, i) => base + (i < extra ? 1 : 0)));
      let cursor = 0;
      for (let k = 0; k < count; k++) {
        const chunk = students.slice(cursor, cursor + sizes[k]);
        cursor += sizes[k];
        generated.push({
          id: `grp-rnd-${Date.now()}-${k + 1}`,
          name: `Kelompok ${k + 1}`,
          course: rCourse,
          maxSize: sizes[k],
          createdBy: "dosen",
          mode: "dosen_random",
          members: chunk.map((s, mi) => ({
            nim: s.nim,
            nama: s.nama,
            role: mi === 0 ? "Leader" : "Anggota",
            joinedAt: today(),
          })),
          createdAt: today(),
        });
      }
    }
    setRPreview(generated);
  };

  const handleConfirmRandom = () => {
    if (!rPreview) return;
    persist([...groups, ...rPreview]);
    setRPreview(null);
    setRCourse("");
    setRValue("4");
    flash(`${rPreview.length} kelompok acak berhasil disimpan!`);
    setTab("list");
  };

  const handleDeleteGroup = (id: string) => {
    persist(groups.filter((g) => g.id !== id));
    flash("Kelompok dihapus.");
  };

  const handleEditSave = (updated: Group) => {
    persist(groups.map((g) => (g.id === updated.id ? updated : g)));
    flash(`Kelompok "${updated.name}" berhasil diperbarui!`);
  };

  const mStudentsAvailable = ALL_STUDENTS.filter(
    (s) => !mSelected.includes(s.nim)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-2 bg-paper border border-forest/30 text-forest px-4 py-3 rounded-xl shadow-lg text-[13.5px] font-medium animate-fadeIn">
          <Check size={15} /> {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="text-[11px] text-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
        <div className="font-serif text-[22px] text-ink">Manajemen Kelompok</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-paper border border-border rounded-xl p-1 w-fit">
        {(
          [
            { key: "list", label: `Daftar Kelompok (${dosenGroups.length})` },
            { key: "manual", label: "Buat Manual" },
            { key: "random", label: "Acak Otomatis" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-[13px] font-medium transition-all",
              tab === key
                ? "bg-forest/10 text-forest font-semibold"
                : "text-muted hover:text-ink"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Daftar Kelompok ─── */}
      {tab === "list" && (
        <div className="flex flex-col gap-5">
          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-muted">Filter:</span>
            {["all", ...COURSES].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCourse(c)}
                className={cn(
                  "px-3 py-1 rounded-full text-[12px] font-medium transition-all border",
                  filterCourse === c
                    ? "bg-forest text-white border-forest"
                    : "border-border text-muted hover:text-ink hover:border-ink/30"
                )}
              >
                {c === "all" ? "Semua" : c}
              </button>
            ))}
          </div>

          {Object.keys(groupedByCourse).length === 0 ? (
            <div className="bg-paper border border-border rounded-[14px] p-12 flex flex-col items-center text-center">
              <Users size={36} className="text-muted mb-3" />
              <div className="text-[14px] font-medium text-ink mb-1">Belum ada kelompok</div>
              <div className="text-[13px] text-muted">
                Buat kelompok melalui tab &quot;Buat Manual&quot; atau &quot;Acak Otomatis&quot;.
              </div>
            </div>
          ) : (
            Object.entries(groupedByCourse).map(([course, grps]) => (
              <div key={course}>
                <div className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-2">
                  {course}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {grps.map((grp) => (
                    <div
                      key={grp.id}
                      className="bg-paper border border-border rounded-[14px] overflow-hidden"
                    >
                      <div className="px-4 py-3.5 border-b border-border flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-forest to-teal flex items-center justify-center text-white font-bold text-[12px] shrink-0">
                          {grp.name.slice(-2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold text-ink">{grp.name}</div>
                          <div className="text-[11px] text-muted">
                            {grp.members.length}/{grp.maxSize} anggota ·{" "}
                            {grp.mode === "dosen_random" ? "Acak" : "Manual"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditGroup(grp)}
                            className="text-muted hover:text-forest transition-colors p-1"
                            title="Edit kelompok"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(grp.id)}
                            className="text-muted hover:text-rose-500 transition-colors p-1"
                            title="Hapus kelompok"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap gap-1.5">
                        {grp.members.map((m, mi) => (
                          <div
                            key={m.nim}
                            className="flex items-center gap-1.5 bg-cream border border-border rounded-md px-2 py-1"
                          >
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white shrink-0",
                                AVATAR_COLORS[mi % AVATAR_COLORS.length]
                              )}
                            >
                              {m.nama.slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-[11px] font-medium text-ink leading-none">
                                {m.nama.split(" ")[0]}
                              </div>
                              <div className="text-[9px] text-muted">{m.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── Tab: Buat Manual ─── */}
      {tab === "manual" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-paper border border-border rounded-[14px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <div className="font-serif text-[16px] text-ink">Detail Kelompok</div>
              <div className="text-[12px] text-muted mt-0.5">
                Isi nama, mata kuliah, lalu pilih anggota
              </div>
            </div>
            <form onSubmit={handleManualCreate} className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                  Nama Kelompok <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="cth. Kelompok Alpha"
                  required
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                    Mata Kuliah <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={mCourse}
                    onChange={(e) => setMCourse(e.target.value)}
                    required
                    className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                  >
                    <option value="">Pilih…</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                    Maks Anggota
                  </label>
                  <select
                    value={mMaxSize}
                    onChange={(e) => setMMaxSize(e.target.value)}
                    className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} orang
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                  Pilih Anggota <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 border border-border rounded-lg p-2">
                  {ALL_STUDENTS.map((s, i) => {
                    const isChecked = mSelected.includes(s.nim);
                    const isDisabled = !isChecked && mSelected.length >= parseInt(mMaxSize);
                    return (
                    <label
                      key={s.nim}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
                        isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-cream"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
                          isChecked ? "bg-forest border-forest" : "border-border"
                        )}
                      >
                        {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                      </div>
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white shrink-0",
                          AVATAR_COLORS[i % AVATAR_COLORS.length]
                        )}
                      >
                        {s.nama.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-ink">{s.nama}</div>
                        <div className="text-[10px] text-muted">{s.nim}</div>
                      </div>
                      {mSelected[0] === s.nim && (
                        <span className="text-[9px] font-bold text-forest bg-forest/10 px-1.5 py-0.5 rounded-full">
                          Leader
                        </span>
                      )}
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={() => toggleMSelect(s.nim)}
                      />
                    </label>
                    );
                  })}
                </div>
                {mSelected.length > 0 && (
                  <div className="mt-1.5 text-[11px] font-semibold">
                    {mSelected.length >= parseInt(mMaxSize) ? (
                      <span className="text-rose-500">Batas {mMaxSize} anggota tercapai — kurangi pilihan atau naikkan Maks Anggota</span>
                    ) : (
                      <span className="text-forest">{mSelected.length}/{mMaxSize} dipilih · {mSelected[0] && ALL_STUDENTS.find(s => s.nim === mSelected[0])?.nama.split(" ")[0]} jadi Leader</span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={mSelected.length === 0}
                className="w-full bg-forest text-white hover:bg-forest/90 disabled:opacity-40 py-2.5 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Plus size={15} /> Buat Kelompok
              </button>
            </form>
          </div>

          {/* Preview anggota yang sudah dipilih */}
          <div className="bg-paper border border-border rounded-[14px] overflow-hidden self-start">
            <div className="px-5 py-4 border-b border-border">
              <div className="font-serif text-[16px] text-ink">Preview Kelompok</div>
              <div className="text-[12px] text-muted mt-0.5">
                {mSelected.length === 0
                  ? "Pilih anggota di sebelah kiri"
                  : `${mSelected.length} anggota terpilih`}
              </div>
            </div>
            <div className="px-5 py-4 space-y-2 min-h-[120px]">
              {mSelected.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted text-center">
                  <Users size={28} className="mb-2" />
                  <div className="text-[13px]">Belum ada anggota dipilih</div>
                </div>
              ) : (
                mSelected.map((nim, i) => {
                  const s = ALL_STUDENTS.find((st) => st.nim === nim)!;
                  return (
                    <div
                      key={nim}
                      className="flex items-center gap-3 bg-cream border border-border rounded-lg px-3 py-2"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-[11px] font-bold text-white shrink-0",
                          AVATAR_COLORS[i % AVATAR_COLORS.length]
                        )}
                      >
                        {s.nama.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-ink">{s.nama}</div>
                        <div className="text-[10px] text-muted">{s.nim}</div>
                      </div>
                      {i === 0 && (
                        <span className="text-[9px] font-bold text-forest bg-forest/10 px-1.5 py-0.5 rounded-full shrink-0">
                          Leader
                        </span>
                      )}
                      <button
                        onClick={() => toggleMSelect(nim)}
                        className="text-muted hover:text-rose-500 transition-colors shrink-0"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Acak Otomatis ─── */}
      {tab === "random" && (
        <div className="flex flex-col gap-5">
          {/* Config panel */}
          <div className="bg-paper border border-border rounded-[14px] p-5 space-y-5">
            <div className="font-serif text-[16px] text-ink">Konfigurasi Acak</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                  Mata Kuliah <span className="text-rose-500">*</span>
                </label>
                <select
                  value={rCourse}
                  onChange={(e) => { setRCourse(e.target.value); setRPreview(null); }}
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                >
                  <option value="">Pilih mata kuliah…</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                  Mode Pembagian
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      { v: "bySize", label: "Per ukuran" },
                      { v: "byCount", label: "Per jumlah" },
                    ] as const
                  ).map(({ v, label }) => (
                    <button
                      key={v}
                      onClick={() => { setRMode(v); setRPreview(null); }}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[12px] font-medium border transition-all",
                        rMode === v
                          ? "bg-forest/10 border-forest text-forest"
                          : "border-border text-muted hover:text-ink"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">
                  {rMode === "bySize" ? "Anggota per kelompok" : "Jumlah kelompok"}
                </label>
                <select
                  value={rValue}
                  onChange={(e) => { setRValue(e.target.value); setRPreview(null); }}
                  className="w-full bg-cream border-[1.5px] border-border text-ink rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-forest transition-colors"
                >
                  {(rMode === "bySize" ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6]).map((n) => (
                    <option key={n} value={n}>
                      {n} {rMode === "bySize" ? "orang" : "kelompok"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRandomize}
                disabled={!rCourse}
                className="flex items-center gap-2 bg-forest text-white hover:bg-forest/90 disabled:opacity-40 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
              >
                <Shuffle size={15} /> {rPreview ? "Acak Lagi" : "Acak Sekarang"}
              </button>
            </div>
          </div>

          {/* Preview hasil acak */}
          {rPreview && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-ink">
                  Hasil Acak — {rPreview.length} kelompok untuk{" "}
                  <span className="text-forest">{rCourse}</span>
                </div>
                <button
                  onClick={handleConfirmRandom}
                  className="flex items-center gap-2 bg-forest text-white hover:bg-forest/90 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all hover:shadow-md"
                >
                  <Check size={14} /> Konfirmasi & Simpan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rPreview.map((grp, gi) => (
                  <div
                    key={grp.id}
                    className="bg-paper border border-border rounded-[14px] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest to-teal flex items-center justify-center text-white font-bold text-[12px] shrink-0">
                        {gi + 1}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-ink">{grp.name}</div>
                        <div className="text-[10px] text-muted">{grp.members.length} anggota</div>
                      </div>
                    </div>
                    <div className="px-4 py-3 space-y-1.5">
                      {grp.members.map((m, mi) => (
                        <div key={m.nim} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-white shrink-0",
                              AVATAR_COLORS[mi % AVATAR_COLORS.length]
                            )}
                          >
                            {m.nama.slice(0, 2)}
                          </div>
                          <div className="text-[12px] text-ink flex-1 truncate">{m.nama}</div>
                          {mi === 0 && (
                            <span className="text-[9px] font-bold text-forest bg-forest/10 px-1.5 py-0.5 rounded-full shrink-0">
                              Leader
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gold/5 border border-gold/20 rounded-xl px-5 py-4 text-[13px] text-ink-2">
                ⚠️ Preview ini belum tersimpan. Klik <span className="font-semibold text-forest">Konfirmasi &amp; Simpan</span> untuk menyimpan, atau{" "}
                <span className="font-semibold">Acak Ulang</span> untuk mengacak kembali.
              </div>
            </div>
          )}

          {!rPreview && (
            <div className="bg-paper border border-dashed border-border rounded-[14px] p-12 flex flex-col items-center text-center text-muted">
              <Shuffle size={32} className="mb-3" />
              <div className="text-[14px] font-medium text-ink mb-1">Siap diacak</div>
              <div className="text-[13px]">
                Pilih mata kuliah dan konfigurasi, lalu klik &quot;Acak Sekarang&quot;.
              </div>
            </div>
          )}
        </div>
      )}

      {editGroup && (
        <EditGroupModal
          group={editGroup}
          onClose={() => setEditGroup(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
