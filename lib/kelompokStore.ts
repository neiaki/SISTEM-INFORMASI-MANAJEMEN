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
      { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",          role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011450403", nama: "ANDRA RAFI IRGI",        role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011400651", nama: "BAGUS ICHA SAPUTRA",     role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450136", nama: "FAHRIZ RIFKY PRATAMA",   role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450646", nama: "MUHAMMAD ARDIANSYAH",    role: "Anggota", joinedAt: "2026-04-03" },
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
      { nim: "231011450234", nama: "EGA PRASETYO",           role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011401516", nama: "KRISTIANUS BUTU",        role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450416", nama: "MUHAMAD ANUGRAH FAHRI",  role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450132", nama: "SITI AJAMIA WOKAS",      role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450655", nama: "WISNU AMR FAATHIR",      role: "Anggota", joinedAt: "2026-04-02" },
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
      { nim: "221011400826", nama: "MOCHAMMAD RAFLI SUFIYAN ANANDA", role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011400859", nama: "MALVIN RIZKI FADILAH",   role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "211011400695", nama: "HISA ARADEA",            role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450161", nama: "RICHARD ZILDJIAN",       role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450540", nama: "MUHAMMAD HAECKAL FADHILAH", role: "Anggota", joinedAt: "2026-04-02" },
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
      { nim: "231011450534", nama: "RAFI AL GHIFARI MUJIANTO",  role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011450284", nama: "FEBIYANTO RIZKI QURBANDI",  role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450256", nama: "STEVEN EKAPUTRA",           role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011400378", nama: "MUHAMAD ALVITO SIDDIQ",     role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011400943", nama: "TEGUH LESMANA PUTRA",       role: "Anggota", joinedAt: "2026-04-02" },
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
      { nim: "231011450137", nama: "FANESHA RAHAYU",            role: "Leader",  joinedAt: "2026-04-01" },
      { nim: "231011450720", nama: "DIMAS",                     role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450474", nama: "MUHAMMAD AULIAN MURAD NASUTION", role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011450351", nama: "MAWAR ISKANDAR",            role: "Anggota", joinedAt: "2026-04-02" },
      { nim: "231011450142", nama: "NURUL DWI WAHYUNI",         role: "Anggota", joinedAt: "2026-04-02" },
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
