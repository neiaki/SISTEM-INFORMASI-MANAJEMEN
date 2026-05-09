export type ProjSub = {
  id: string;
  fileName: string;
  fileSize: string;
  submittedBy: string;
  note: string;
  submittedAt: string;
  type: "file" | "link";
  url?: string;
};

export type ProjComment = {
  id: string;
  author: string;
  role: "mahasiswa" | "dosen";
  text: string;
  time: string;
};

export type TugasKelompok = {
  id: string;
  title: string;
  description: string;
  course: string;
  deadline: string;
  groupId: string;
  groupName: string;
  createdBy: "mahasiswa" | "dosen";
  status: "aktif" | "dikumpulkan" | "revisi" | "selesai";
  submissions: ProjSub[];
  comments: ProjComment[];
  nilaiAkhir?: number;
  catatanRevisi?: string;
  createdAt: string;
};

const KEY = "sim_tugas_kelompok";

const SEED: TugasKelompok[] = [
  {
    id: "tk-seed-1",
    title: "Laporan Analisis Kebutuhan Sistem",
    description: "Buat laporan lengkap hasil analisis kebutuhan sistem informasi akademik termasuk use case diagram dan spesifikasi kebutuhan fungsional.",
    course: "Analisis Sistem Informasi",
    deadline: "2026-05-20",
    groupId: "grp-seed-1",
    groupName: "Kelompok Alfa",
    createdBy: "dosen",
    status: "dikumpulkan",
    submissions: [
      { id: "s-1", fileName: "Laporan_Analisis_Kelompok_Alfa.pdf", fileSize: "2.14 MB", submittedBy: "Eki Kurniawan", note: "Sudah lengkap dengan diagram use case", submittedAt: "8 Mei, 09:45", type: "file" },
    ],
    comments: [
      { id: "c-1", author: "Dr. Budi Santoso", role: "dosen", text: "Tolong tambahkan activity diagram pada bagian analisis proses bisnis.", time: "08:30" },
      { id: "c-2", author: "Andra Rafi Irgi", role: "mahasiswa", text: "Baik Pak, akan kami tambahkan segera.", time: "08:55" },
    ],
    createdAt: "2026-04-25",
  },
  {
    id: "tk-seed-2",
    title: "Prototype UI/UX Dashboard Mahasiswa",
    description: "Desain prototype interaktif dashboard mahasiswa menggunakan Figma. Sertakan minimal 5 halaman utama beserta flow navigasi.",
    course: "Rekayasa Perangkat Lunak",
    deadline: "2026-05-15",
    groupId: "grp-seed-1",
    groupName: "Kelompok Alfa",
    createdBy: "mahasiswa",
    status: "revisi",
    submissions: [
      { id: "s-2", fileName: "prototype_v1.fig", fileSize: "5.80 MB", submittedBy: "Fahriz Rifky Pratama", note: "Versi pertama prototype", submittedAt: "5 Mei, 14:20", type: "file" },
    ],
    comments: [
      { id: "c-3", author: "Dr. Budi Santoso", role: "dosen", text: "Desain sudah bagus tapi navigasi antar halaman masih membingungkan. Perbaiki juga kontras warna pada tombol CTA.", time: "16:00" },
    ],
    catatanRevisi: "Perbaiki alur navigasi dan kontras warna tombol utama agar lebih accessible.",
    createdAt: "2026-04-20",
  },
  {
    id: "tk-seed-3",
    title: "Implementasi Algoritma Pencarian Data Mahasiswa",
    description: "Implementasikan algoritma binary search dan linear search untuk pencarian data mahasiswa. Bandingkan kompleksitas waktu keduanya dengan dataset 10.000 data.",
    course: "Struktur Data & Algoritma",
    deadline: "2026-06-01",
    groupId: "grp-seed-1",
    groupName: "Kelompok Alfa",
    createdBy: "dosen",
    status: "aktif",
    submissions: [],
    comments: [],
    createdAt: "2026-05-01",
  },
  {
    id: "tk-seed-4",
    title: "Makalah Keamanan Jaringan Komputer",
    description: "Tulis makalah tentang ancaman keamanan jaringan terkini (2024-2025) dan strategi mitigasinya. Minimal 15 halaman dengan referensi jurnal ilmiah.",
    course: "Keamanan Jaringan",
    deadline: "2026-04-30",
    groupId: "grp-seed-1",
    groupName: "Kelompok Alfa",
    createdBy: "dosen",
    status: "selesai",
    submissions: [
      { id: "s-3", fileName: "Makalah_Keamanan_Jaringan_Final.docx", fileSize: "1.92 MB", submittedBy: "Muhammad Ardiansyah", note: "Revisi sudah selesai", submittedAt: "29 Apr, 21:10", type: "file" },
      { id: "s-4", fileName: "https://drive.google.com/file/sample", fileSize: "—", submittedBy: "Eki Kurniawan", note: "Link referensi tambahan", submittedAt: "29 Apr, 21:30", type: "link", url: "https://drive.google.com/file/sample" },
    ],
    comments: [
      { id: "c-4", author: "Dr. Budi Santoso", role: "dosen", text: "Bagus! Pembahasan sudah komprehensif. Nilai diberikan.", time: "10:00" },
    ],
    nilaiAkhir: 88,
    createdAt: "2026-04-01",
  },
];

function load(): TugasKelompok[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED;
  }
  catch { return SEED; }
}

function save(data: TugasKelompok[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getTugasKelompokList(): TugasKelompok[] {
  return load();
}

export function createTugasKelompok(
  data: Omit<TugasKelompok, "id" | "submissions" | "comments" | "status" | "createdAt">
): TugasKelompok {
  const item: TugasKelompok = {
    ...data,
    id: `tk-${Date.now()}`,
    status: "aktif",
    submissions: [],
    comments: [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  save([...load(), item]);
  return item;
}

export function addProjSubmission(id: string, sub: Omit<ProjSub, "id" | "submittedAt">): void {
  save(load().map(t => t.id !== id ? t : {
    ...t,
    submissions: [...t.submissions, {
      ...sub,
      id: `s-${Date.now()}`,
      submittedAt: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    }],
    status: "dikumpulkan" as const,
    catatanRevisi: undefined,
  }));
}

export function addProjComment(id: string, cmt: Omit<ProjComment, "id" | "time">): void {
  save(load().map(t => t.id !== id ? t : {
    ...t,
    comments: [...t.comments, {
      ...cmt,
      id: `c-${Date.now()}`,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    }],
  }));
}

export function setTugasStatus(
  id: string,
  status: TugasKelompok["status"],
  opts?: { catatanRevisi?: string; nilaiAkhir?: number }
): void {
  save(load().map(t => t.id !== id ? t : {
    ...t,
    status,
    ...(opts?.catatanRevisi !== undefined ? { catatanRevisi: opts.catatanRevisi } : {}),
    ...(opts?.nilaiAkhir !== undefined ? { nilaiAkhir: opts.nilaiAkhir } : {}),
  }));
}
