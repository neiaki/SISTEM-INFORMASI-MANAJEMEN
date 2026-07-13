export type KelompokMember = { nim: string; nama: string; role: string; joinedAt: string };
export type Kelompok = {
  id: string;
  name: string;
  course: string;
  maxSize: number;
  createdBy: string;
  mode: "mahasiswa" | "dosen_manual" | "dosen_random";
  members: KelompokMember[];
  createdAt: string;
};

const KEY = "sim_kelompok";

const SEED: Kelompok[] = [
  {
    id: "grp-seed-1",
    name: "Kelompok Alfa",
    course: "Analisis SI",
    maxSize: 5,
    createdBy: "231011450284",
    mode: "mahasiswa",
    members: [
      { nim: "231011450284", nama: "Hendra Saputra",          role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011450403", nama: "Andi Pratama",        role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011400651", nama: "Budi Santoso",     role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450136", nama: "Fajar Nugroho",   role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450646", nama: "Surya Saputra",    role: "Anggota", joinedAt: "2026-04-03" },
    ],
    createdAt: "2026-04-01",
  },
  {
    id: "grp-seed-2",
    name: "Kelompok Beta",
    course: "PPL",
    maxSize: 5,
    createdBy: "231011450234",
    mode: "dosen_manual",
    members: [
      { nim: "231011450234", nama: "Eko Setiawan",           role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011401516", nama: "Joko Susilo",        role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450416", nama: "Qori Akbar",  role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450132", nama: "Eka Saputri",      role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450655", nama: "Heri Susanto",      role: "Anggota", joinedAt: "2026-04-02" },
    ],
    createdAt: "2026-04-01",
  },
  {
    id: "grp-seed-3",
    name: "Kelompok Gamma",
    course: "Keamanan Sistem",
    maxSize: 5,
    createdBy: "221011400826",
    mode: "dosen_manual",
    members: [
      { nim: "221011400826", nama: "Zahra Hidayah", role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011400859", nama: "Kevin Sanjaya",   role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "211011400695", nama: "Indra Wijaya",            role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450161", nama: "Citra Lestari",       role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450540", nama: "Vito Andhika", role: "Anggota", joinedAt: "2026-04-02" },
    ],
    createdAt: "2026-04-01",
  },
  {
    id: "grp-seed-4",
    name: "Kelompok Delta",
    course: "Basis Data",
    maxSize: 5,
    createdBy: "231011450534",
    mode: "dosen_random",
    members: [
      { nim: "231011450534", nama: "Abdul Aziz",  role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011450284", nama: "Hendra Saputra",  role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450256", nama: "Fani Rosalina",           role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011400378", nama: "Putra Pratama",     role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011400943", nama: "Gilang Ramadhan",       role: "Anggota", joinedAt: "2026-04-02" },
    ],
    createdAt: "2026-04-01",
  },
  {
    id: "grp-seed-5",
    name: "Kelompok Epsilon",
    course: "SI Enterprise",
    maxSize: 5,
    createdBy: "231011450137",
    mode: "mahasiswa",
    members: [
      { nim: "231011450137", nama: "Rina Sari",            role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011450720", nama: "Dedi Kusuma",                     role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450474", nama: "Tegar Mahendra", role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450351", nama: "Maya Indah",            role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450142", nama: "Zahra Azzahra",         role: "Anggota", joinedAt: "2026-04-02" },
    ],
    createdAt: "2026-04-01",
  },
];

export function getKelompokList(): Kelompok[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Kelompok[]) : SEED;
  } catch {
    return SEED;
  }
}
