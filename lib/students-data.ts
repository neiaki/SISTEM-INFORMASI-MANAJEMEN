export type StudentStatus = "sangat_aktif" | "aktif" | "cukup_aktif" | "perlu_perhatian";

export type Student = {
  nim: string;
  nama: string;
  email: string;
  courses: string[];          // daftar mata kuliah yang diambil
  coursesLabel: string;       // untuk ditampilkan (ringkas)
  done: number;               // tugas selesai
  total: number;              // total tugas
  avg: number;                // rata-rata nilai
  status: StudentStatus;
  avatarGrad: string;
  angkatan: string;
};

export const STUDENTS: Student[] = [
  {
    nim: "231011450403", nama: "Andi Pratama",
    email: "andipratama@example.com",
    courses: ["Analisis SI", "PPL"],          coursesLabel: "Analisis SI, PPL",
    done: 12, total: 12, avg: 92.3, status: "sangat_aktif",
    avatarGrad: "from-[#c0392b] to-[#e74c3c]", angkatan: "2023",
  },
  {
    nim: "231011400651", nama: "Budi Santoso",
    email: "budisantoso@example.com",
    courses: ["Keamanan Sistem", "SI Enterprise"], coursesLabel: "Keamanan Sistem, SI Enterprise",
    done: 8, total: 12, avg: 74.0, status: "cukup_aktif",
    avatarGrad: "from-[#b8860b] to-[#f39c12]", angkatan: "2023",
  },
  {
    nim: "231011450408", nama: "Candra Wiguna",
    email: "candrawiguna@example.com",
    courses: ["Basis Data", "PPL"],            coursesLabel: "Basis Data, PPL",
    done: 5, total: 12, avg: 58.2, status: "perlu_perhatian",
    avatarGrad: "from-[#636e72] to-[#b2bec3]", angkatan: "2023",
  },
  {
    nim: "231011450720", nama: "Dedi Kusuma",
    email: "dedikusuma@example.com",
    courses: ["Analisis SI", "Basis Data"],    coursesLabel: "Analisis SI, Basis Data",
    done: 9, total: 12, avg: 81.5, status: "aktif",
    avatarGrad: "from-[#1a5276] to-[#2980b9]", angkatan: "2023",
  },
  {
    nim: "231011450234", nama: "Eko Setiawan",
    email: "ekosetiawan@example.com",
    courses: ["PPL", "SI Enterprise"],         coursesLabel: "PPL, SI Enterprise",
    done: 11, total: 12, avg: 88.7, status: "sangat_aktif",
    avatarGrad: "from-[#1a6b3c] to-[#27ae60]", angkatan: "2023",
  },
  {
    nim: "231011450136", nama: "Fajar Nugroho",
    email: "fajarnugroho@example.com",
    courses: ["Analisis SI", "Keamanan Sistem"], coursesLabel: "Analisis SI, Keamanan Sistem",
    done: 10, total: 12, avg: 83.2, status: "aktif",
    avatarGrad: "from-[#6c3483] to-[#9b59b6]", angkatan: "2023",
  },
  {
    nim: "231011450577", nama: "Galih Purnama",
    email: "galihpurnama@example.com",
    courses: ["SI Enterprise", "Basis Data"],  coursesLabel: "SI Enterprise, Basis Data",
    done: 7, total: 12, avg: 71.4, status: "cukup_aktif",
    avatarGrad: "from-[#784212] to-[#d35400]", angkatan: "2023",
  },
  {
    nim: "231011450137", nama: "Rina Sari",
    email: "rinasari@example.com",
    courses: ["Analisis SI", "Interaksi Manusia & Komputer"], coursesLabel: "Analisis SI, IMK",
    done: 12, total: 12, avg: 94.1, status: "sangat_aktif",
    avatarGrad: "from-[#880e4f] to-[#c2185b]", angkatan: "2023",
  },
  {
    nim: "231011450284", nama: "Hendra Saputra",
    email: "hendrasaputra@example.com",
    courses: ["Basis Data", "PPL"],            coursesLabel: "Basis Data, PPL",
    done: 9, total: 12, avg: 79.8, status: "aktif",
    avatarGrad: "from-[#0e6655] to-[#1abc9c]", angkatan: "2023",
  },
  {
    nim: "211011400695", nama: "Indra Wijaya",
    email: "indrawijaya@example.com",
    courses: ["Keamanan Sistem", "SI Enterprise"], coursesLabel: "Keamanan Sistem, SI Enterprise",
    done: 6, total: 12, avg: 67.3, status: "cukup_aktif",
    avatarGrad: "from-[#1f618d] to-[#3498db]", angkatan: "2021",
  },
  {
    nim: "231011401516", nama: "Joko Susilo",
    email: "jokosusilo@example.com",
    courses: ["PPL", "Interaksi Manusia & Komputer"], coursesLabel: "PPL, IMK",
    done: 10, total: 12, avg: 84.6, status: "aktif",
    avatarGrad: "from-[#6e2f7a] to-[#a569bd]", angkatan: "2023",
  },
  {
    nim: "231011400859", nama: "Kevin Sanjaya",
    email: "kevinsanjaya@example.com",
    courses: ["Analisis SI", "Basis Data"],    coursesLabel: "Analisis SI, Basis Data",
    done: 11, total: 12, avg: 89.2, status: "sangat_aktif",
    avatarGrad: "from-[#c0392b] to-[#e91e63]", angkatan: "2023",
  },
  {
    nim: "231011450351", nama: "Maya Indah",
    email: "mayaindah@example.com",
    courses: ["SI Enterprise", "Interaksi Manusia & Komputer"], coursesLabel: "SI Enterprise, IMK",
    done: 9, total: 12, avg: 77.5, status: "aktif",
    avatarGrad: "from-[#2c3e50] to-[#3498db]", angkatan: "2023",
  },
  {
    nim: "221011400826", nama: "Zahra Hidayah",
    email: "nurulhidayah@example.com",
    courses: ["Keamanan Sistem", "PPL"],       coursesLabel: "Keamanan Sistem, PPL",
    done: 12, total: 12, avg: 91.0, status: "sangat_aktif",
    avatarGrad: "from-[#1b5e20] to-[#43a047]", angkatan: "2022",
  },
  {
    nim: "231011450131", nama: "Oki Setiana",
    email: "okisetiana@example.com",
    courses: ["Analisis SI", "SI Enterprise"], coursesLabel: "Analisis SI, SI Enterprise",
    done: 7, total: 12, avg: 69.8, status: "cukup_aktif",
    avatarGrad: "from-[#e65100] to-[#ff9800]", angkatan: "2023",
  },
  {
    nim: "231011400378", nama: "Putra Pratama",
    email: "putrapratama@example.com",
    courses: ["Basis Data", "Interaksi Manusia & Komputer"], coursesLabel: "Basis Data, IMK",
    done: 4, total: 12, avg: 55.1, status: "perlu_perhatian",
    avatarGrad: "from-[#37474f] to-[#607d8b]", angkatan: "2023",
  },
  {
    nim: "231011450416", nama: "Qori Akbar",
    email: "qoriakbar@example.com",
    courses: ["PPL", "Basis Data"],            coursesLabel: "PPL, Basis Data",
    done: 10, total: 12, avg: 82.4, status: "aktif",
    avatarGrad: "from-[#004d40] to-[#009688]", angkatan: "2023",
  },
  {
    nim: "231011450692", nama: "Rizky Ramadhan",
    email: "rizkyramadhan@example.com",
    courses: ["Keamanan Sistem", "Interaksi Manusia & Komputer"], coursesLabel: "Keamanan Sistem, IMK",
    done: 8, total: 12, avg: 73.9, status: "cukup_aktif",
    avatarGrad: "from-[#ad1457] to-[#e91e63]", angkatan: "2023",
  },
  {
    nim: "231011450646", nama: "Surya Saputra",
    email: "suryasaputra@example.com",
    courses: ["Analisis SI", "PPL"],           coursesLabel: "Analisis SI, PPL",
    done: 11, total: 12, avg: 87.6, status: "sangat_aktif",
    avatarGrad: "from-[#1a237e] to-[#3f51b5]", angkatan: "2023",
  },
  {
    nim: "231011450474", nama: "Tegar Mahendra",
    email: "tegarmahendra@example.com",
    courses: ["SI Enterprise", "Basis Data"],  coursesLabel: "SI Enterprise, Basis Data",
    done: 9, total: 12, avg: 80.1, status: "aktif",
    avatarGrad: "from-[#006064] to-[#00acc1]", angkatan: "2023",
  },
  {
    nim: "231011450449", nama: "Umar Faruq",
    email: "umarfaruq@example.com",
    courses: ["Basis Data", "PPL"],            coursesLabel: "Basis Data, PPL",
    done: 3, total: 12, avg: 48.7, status: "perlu_perhatian",
    avatarGrad: "from-[#4a148c] to-[#7b1fa2]", angkatan: "2023",
  },
  {
    nim: "231011450540", nama: "Vito Andhika",
    email: "vitoandhika@example.com",
    courses: ["Analisis SI", "Keamanan Sistem"], coursesLabel: "Analisis SI, Keamanan Sistem",
    done: 10, total: 12, avg: 85.9, status: "aktif",
    avatarGrad: "from-[#1b5e20] to-[#66bb6a]", angkatan: "2023",
  },
  {
    nim: "231011450649", nama: "Wahyu Hidayat",
    email: "wahyuhidayat@example.com",
    courses: ["SI Enterprise", "Interaksi Manusia & Komputer"], coursesLabel: "SI Enterprise, IMK",
    done: 6, total: 12, avg: 68.4, status: "cukup_aktif",
    avatarGrad: "from-[#2d5a3d] to-[#2a9d8f]", angkatan: "2023",
  },
  {
    nim: "231011450347", nama: "Yudi Kurniawan",
    email: "yudikurniawan@example.com",
    courses: ["Keamanan Sistem", "Basis Data"], coursesLabel: "Keamanan Sistem, Basis Data",
    done: 12, total: 12, avg: 93.5, status: "sangat_aktif",
    avatarGrad: "from-[#784212] to-[#a04000]", angkatan: "2023",
  },
  {
    nim: "231011450142", nama: "Zahra Azzahra",
    email: "zahraazzahra@example.com",
    courses: ["PPL", "SI Enterprise"],         coursesLabel: "PPL, SI Enterprise",
    done: 9, total: 12, avg: 78.3, status: "aktif",
    avatarGrad: "from-[#880e4f] to-[#ad1457]", angkatan: "2023",
  },
  {
    nim: "231011450534", nama: "Abdul Aziz",
    email: "abdulaziz@example.com",
    courses: ["Analisis SI", "SI Enterprise"], coursesLabel: "Analisis SI, SI Enterprise",
    done: 11, total: 12, avg: 90.7, status: "sangat_aktif",
    avatarGrad: "from-[#b8860b] to-[#e67e22]", angkatan: "2023",
  },
  {
    nim: "231011450270", nama: "Bayu Anggara",
    email: "bayuanggara@example.com",
    courses: ["Basis Data", "Interaksi Manusia & Komputer"], coursesLabel: "Basis Data, IMK",
    done: 7, total: 12, avg: 72.1, status: "cukup_aktif",
    avatarGrad: "from-[#636e72] to-[#95a5a6]", angkatan: "2023",
  },
  {
    nim: "231011450161", nama: "Citra Lestari",
    email: "citralestari@example.com",
    courses: ["Keamanan Sistem", "SI Enterprise"], coursesLabel: "Keamanan Sistem, SI Enterprise",
    done: 10, total: 12, avg: 83.8, status: "aktif",
    avatarGrad: "from-[#1a5276] to-[#21618c]", angkatan: "2023",
  },
  {
    nim: "231011450138", nama: "Dian Sastrowardoyo",
    email: "diansastrowardoyo@example.com",
    courses: ["Analisis SI", "Basis Data"],    coursesLabel: "Analisis SI, Basis Data",
    done: 4, total: 12, avg: 51.2, status: "perlu_perhatian",
    avatarGrad: "from-[#6c3483] to-[#8e44ad]", angkatan: "2023",
  },
  {
    nim: "231011450132", nama: "Eka Saputri",
    email: "ekasaputri@example.com",
    courses: ["PPL", "Interaksi Manusia & Komputer"], coursesLabel: "PPL, IMK",
    done: 9, total: 12, avg: 76.9, status: "aktif",
    avatarGrad: "from-[#0e6655] to-[#17a589]", angkatan: "2023",
  },
  {
    nim: "231011450256", nama: "Fani Rosalina",
    email: "fanirosalina@example.com",
    courses: ["Analisis SI", "Keamanan Sistem"], coursesLabel: "Analisis SI, Keamanan Sistem",
    done: 12, total: 12, avg: 95.2, status: "sangat_aktif",
    avatarGrad: "from-[#1f618d] to-[#2980b9]", angkatan: "2023",
  },
  {
    nim: "231011400943", nama: "Gilang Ramadhan",
    email: "gilangramadhan@example.com",
    courses: ["Basis Data", "SI Enterprise"],  coursesLabel: "Basis Data, SI Enterprise",
    done: 8, total: 12, avg: 70.6, status: "cukup_aktif",
    avatarGrad: "from-[#784212] to-[#d35400]", angkatan: "2023",
  },
  {
    nim: "231011450655", nama: "Heri Susanto",
    email: "herisusanto@example.com",
    courses: ["SI Enterprise", "PPL"],         coursesLabel: "SI Enterprise, PPL",
    done: 10, total: 12, avg: 84.1, status: "aktif",
    avatarGrad: "from-[#6e2f7a] to-[#9b59b6]", angkatan: "2023",
  },
];

export const STATUS_MAP: Record<StudentStatus, { cls: string; label: string }> = {
  sangat_aktif:    { cls: "bg-forest/10 text-forest",  label: "Sangat Aktif"    },
  aktif:           { cls: "bg-teal/10 text-teal",      label: "Aktif"           },
  cukup_aktif:     { cls: "bg-gold/15 text-gold",      label: "Cukup Aktif"     },
  perlu_perhatian: { cls: "bg-rose/10 text-rose",      label: "Perlu Perhatian" },
};

export const AVG_CLS: Record<StudentStatus, string> = {
  sangat_aktif:    "text-forest",
  aktif:           "text-forest",
  cukup_aktif:     "text-gold",
  perlu_perhatian: "text-rose",
};

export const BAR_CLS: Record<StudentStatus, string> = {
  sangat_aktif:    "from-forest to-teal",
  aktif:           "from-teal to-[#2a9d8f]",
  cukup_aktif:     "from-gold to-[#f39c12]",
  perlu_perhatian: "from-rose to-[#e74c3c]",
};

export function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// Untuk tab mahasiswa/participant — format NIM asli
export const PARTICIPANTS: { nim: string; nama: string; email: string }[] = [
  { nim: "231011450403", nama: "Andi Pratama",                  email: "andipratama@example.com"           },
  { nim: "231011400651", nama: "Budi Santoso",               email: "budisantoso@example.com"            },
  { nim: "231011450408", nama: "Candra Wiguna",                   email: "candrawiguna@example.com"           },
  { nim: "231011450720", nama: "Dedi Kusuma",                            email: "dedikusuma@example.com"            },
  { nim: "231011450234", nama: "Eko Setiawan",                     email: "ekosetiawan@example.com"              },
  { nim: "231011450136", nama: "Fajar Nugroho",             email: "fajarnugroho@example.com"         },
  { nim: "231011450577", nama: "Galih Purnama",                       email: "galihpurnama@example.com"            },
  { nim: "231011450137", nama: "Rina Sari",                   email: "rinasari@example.com"             },
  { nim: "231011450284", nama: "Hendra Saputra",         email: "hendrasaputra@example.com"              },
  { nim: "211011400695", nama: "Indra Wijaya",                      email: "indrawijaya@example.com"              },
  { nim: "231011401516", nama: "Joko Susilo",                  email: "jokosusilo@example.com"          },
  { nim: "231011400859", nama: "Kevin Sanjaya",             email: "kevinsanjaya@example.com"      },
  { nim: "231011450351", nama: "Maya Indah",                   email: "mayaindah@example.com"          },
  { nim: "221011400826", nama: "Zahra Hidayah",   email: "nurulhidayah@example.com"                },
  { nim: "231011450131", nama: "Oki Setiana",       email: "okisetiana@example.com"            },
  { nim: "231011400378", nama: "Putra Pratama",            email: "putrapratama@example.com"           },
  { nim: "231011450416", nama: "Qori Akbar",            email: "qoriakbar@example.com"    },
  { nim: "231011450692", nama: "Rizky Ramadhan",         email: "rizkyramadhan@example.com"        },
  { nim: "231011450646", nama: "Surya Saputra",              email: "suryasaputra@example.com"         },
  { nim: "231011450474", nama: "Tegar Mahendra",   email: "tegarmahendra@example.com"    },
  { nim: "231011450449", nama: "Umar Faruq",              email: "umarfaruq@example.com"            },
  { nim: "231011450540", nama: "Vito Andhika",        email: "vitoandhika@example.com"        },
  { nim: "231011450649", nama: "Wahyu Hidayat",           email: "wahyuhidayat@example.com"          },
  { nim: "231011450347", nama: "Yudi Kurniawan",   email: "yudikurniawan@example.com"      },
  { nim: "231011450142", nama: "Zahra Azzahra",                email: "zahraazzahra@example.com"        },
  { nim: "231011450534", nama: "Abdul Aziz",         email: "abdulaziz@example.com"      },
  { nim: "231011450270", nama: "Bayu Anggara",       email: "bayuanggara@example.com"     },
  { nim: "231011450161", nama: "Citra Lestari",                 email: "citralestari@example.com"        },
  { nim: "231011450138", nama: "Dian Sastrowardoyo",           email: "diansastrowardoyo@example.com"     },
  { nim: "231011450132", nama: "Eka Saputri",                email: "ekasaputri@example.com"        },
  { nim: "231011450256", nama: "Fani Rosalina",                  email: "fanirosalina@example.com"         },
  { nim: "231011400943", nama: "Gilang Ramadhan",              email: "gilangramadhan@example.com"       },
  { nim: "231011450655", nama: "Heri Susanto",                email: "herisusanto@example.com"        },
];
