import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  const deleteSilent = async (deleteFn: () => Promise<any>, tableName: string) => {
    try {
      await deleteFn();
    } catch (e: any) {
      if (e.code === 'P2021') {
        console.log(`Skipping cleanup for ${tableName} (table not found).`);
      } else {
        throw e;
      }
    }
  };

  await deleteSilent(() => prisma.comment.deleteMany({}), "comment");
  await deleteSilent(() => prisma.submission.deleteMany({}), "submission");
  await deleteSilent(() => prisma.logAktivitas.deleteMany({}), "logAktivitas");
  await deleteSilent(() => prisma.deliverable.deleteMany({}), "deliverable");
  await deleteSilent(() => prisma.anggotaKelompok.deleteMany({}), "anggotaKelompok");
  await deleteSilent(() => prisma.kelompok.deleteMany({}), "kelompok");
  await deleteSilent(() => prisma.tugas.deleteMany({}), "tugas");
  await deleteSilent(() => prisma.proyek.deleteMany({}), "proyek");
  await deleteSilent(() => prisma.enrollment.deleteMany({}), "enrollment");
  await deleteSilent(() => prisma.mataKuliah.deleteMany({}), "mataKuliah");
  await deleteSilent(() => prisma.mahasiswa.deleteMany({}), "mahasiswa");
  await deleteSilent(() => prisma.dosen.deleteMany({}), "dosen");
  await deleteSilent(() => prisma.adminCampus.deleteMany({}), "adminCampus");
  await deleteSilent(() => prisma.staffTU.deleteMany({}), "staffTU");
  await deleteSilent(() => prisma.user.deleteMany({}), "user");

  console.log("Creating users & credentials...");
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. Dosen User & Profile
  const userDosen = await prisma.user.create({
    data: {
      username: "001",
      passwordHash: hashedPassword,
      role: "DOSEN",
      dosen: {
        create: {
          nama: "Dr. Ahmad Fauzi",
          email: "ahmadfauzi@unpam.ac.id",
          nidn: "001",
          noHp: "081234567890",
        },
      },
    },
  });

  const userDosen2 = await prisma.user.create({
    data: {
      username: "002",
      passwordHash: hashedPassword,
      role: "DOSEN",
      dosen: {
        create: {
          nama: "Dr. Budi Santoso",
          email: "budisantoso@unpam.ac.id",
          nidn: "002",
          noHp: "081234567891",
        },
      },
    },
  });

  const dosenProfile = await prisma.dosen.findFirst({ where: { userId: userDosen.id } });
  const dosenProfile2 = await prisma.dosen.findFirst({ where: { userId: userDosen2.id } });

  // 2. Mahasiswa Users & Profiles
  // List students matching students-data.ts & sim-data.ts
  const studentsSeed = [
    { nim: "231011450403", nama: "Andi Pratama", email: "andipratama@example.com", activeSem: 6 },
    { nim: "231011400651", nama: "Budi Santoso", email: "budisantoso@example.com", activeSem: 6 },
    { nim: "231011450408", nama: "Candra Wiguna", email: "candrawiguna@example.com", activeSem: 6 },
    { nim: "231011450720", nama: "Dedi Kusuma", email: "dedikusuma@example.com", activeSem: 6 },
    { nim: "231011450234", nama: "Eko Setiawan", email: "ekosetiawan@example.com", activeSem: 6 },
    { nim: "231011450890", nama: "Fajar Nugroho", email: "fajarnugroho@example.com", activeSem: 6 },
    { nim: "231011450444", nama: "Hendra Saputra", email: "hendrasaputra@example.com", activeSem: 6 },
  ];

  const createdMahasiswas = [];
  for (const s of studentsSeed) {
    const userMhs = await prisma.user.create({
      data: {
        username: s.nim,
        passwordHash: hashedPassword,
        role: "MAHASISWA",
        mahasiswa: {
          create: {
            nama: s.nama,
            nim: s.nim,
            email: s.email,
            semesterAktif: s.activeSem,
            noHp: "08988776655" + s.nim.slice(-1),
          },
        },
      },
    });
    const mhsProfile = await prisma.mahasiswa.findFirst({ where: { userId: userMhs.id } });
    if (mhsProfile) createdMahasiswas.push(mhsProfile);
  }

  // 3. Admin & Staff TU Tasks
  await prisma.user.create({
    data: {
      username: "admin",
      passwordHash: hashedPassword,
      role: "ADMIN",
      adminCampus: {
        create: {
          nama: "Administrator Kampus",
          email: "admin@unpam.ac.id",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      username: "tu_staff",
      passwordHash: hashedPassword,
      role: "STAFF_TU",
      staffTU: {
        create: {
          nama: "Staff Tata Usaha 1",
          email: "tu@unpam.ac.id",
          unit: "Layanan Akademik",
        },
      },
    },
  });

  // 4. Courses (Mata Kuliah)
  console.log("Seeding MataKuliah...");
  const mkAnalisisSI = await prisma.mataKuliah.create({
    data: {
      namaMk: "Analisis SI",
      kodeMk: "SI-202",
      idDosen: dosenProfile!.id,
      semester: 6,
      tahunAjar: "Genap 2025/2026",
    },
  });

  const mkBasisData = await prisma.mataKuliah.create({
    data: {
      namaMk: "Basis Data",
      kodeMk: "SI-203",
      idDosen: dosenProfile!.id,
      semester: 6,
      tahunAjar: "Genap 2025/2026",
    },
  });

  const mkPPL = await prisma.mataKuliah.create({
    data: {
      namaMk: "PPL",
      kodeMk: "SI-204",
      idDosen: dosenProfile2!.id,
      semester: 6,
      tahunAjar: "Genap 2025/2026",
    },
  });

  // Enrollments
  console.log("Seeding Enrollments...");
  for (const mhs of createdMahasiswas) {
    // Semua mahasiswa ambil Analisis SI, Basis Data, dan PPL
    await prisma.enrollment.create({
      data: {
        idMahasiswa: mhs.id,
        idMk: mkAnalisisSI.id,
        semester: 6,
        tahunAjar: "Genap 2025/2026",
        status: "Aktif",
      },
    });
    await prisma.enrollment.create({
      data: {
        idMahasiswa: mhs.id,
        idMk: mkBasisData.id,
        semester: 6,
        tahunAjar: "Genap 2025/2026",
        status: "Aktif",
      },
    });
    await prisma.enrollment.create({
      data: {
        idMahasiswa: mhs.id,
        idMk: mkPPL.id,
        semester: 6,
        tahunAjar: "Genap 2025/2026",
        status: "Aktif",
      },
    });
  }

  // 5. Seeding Project (Proyek)
  console.log("Seeding Proyek...");
  const proyekSI = await prisma.proyek.create({
    data: {
      idMk: mkAnalisisSI.id,
      namaProyek: "Proyek Besar Analisis SI",
      deskripsi: "Proyek kolaboratif untuk merancang, memetakan proses bisnis, dan membuat SRS Sistem E-Learning Kampus.",
      tanggalMulai: new Date("2026-04-20"),
      deadlineAkhir: new Date("2026-06-15"),
      progresProyek: 68,
    },
  });

  // Groups (Kelompok)
  console.log("Seeding Kelompok...");
  const kelompokAlfa = await prisma.kelompok.create({
    data: {
      idMk: mkAnalisisSI.id,
      idProyek: proyekSI.id,
      namaKelompok: "Kelompok Alfa",
    },
  });

  // Add anggota kelompok with roles
  for (let i = 0; i < createdMahasiswas.length; i++) {
    await prisma.anggotaKelompok.create({
      data: {
        idKelompok: kelompokAlfa.id,
        idMahasiswa: createdMahasiswas[i].id,
        peran: i === 0 ? "Ketua" : "Anggota",
      },
    });
  }

  // 6. Seeding Tugas
  console.log("Seeding Tugas...");
  const tugas1 = await prisma.tugas.create({
    data: {
      idMk: mkBasisData.id,
      judul: "Prototype ERD SIM",
      deskripsi: "Rancang ERD sistem informasi manajemen akademik hingga level 3NF.",
      tanggalDiberikan: new Date("2026-05-01"),
      deadline: new Date("2026-06-08"),
      bobotNilai: 25,
      jenis: "Individu",
      statusGlobal: "Sedang Dikerjakan",
      tipe: "Tugas",
    },
  });

  const tugas2 = await prisma.tugas.create({
    data: {
      idMk: mkAnalisisSI.id,
      judul: "Laporan Analisis Kebutuhan Sistem",
      deskripsi: "Tulis laporan kebutuhan sistem mencakup pendahuluan, landasan teori, analisis, dan usecase.",
      tanggalDiberikan: new Date("2026-04-25"),
      deadline: new Date("2026-05-20"),
      bobotNilai: 30,
      jenis: "Kelompok",
      statusGlobal: "Sedang Dikerjakan",
      tipe: "Tugas",
    },
  });

  // 7. Seed Deliverables
  console.log("Seeding Deliverables...");
  await prisma.deliverable.create({
    data: {
      idProyek: proyekSI.id,
      namaAktivitas: "Use case final",
      idPenanggungJawab: createdMahasiswas[0].id, // Andi
      status: "Completed",
      deadlineKhusus: new Date("2026-05-25"),
      persentaseBobot: 30,
    },
  });

  await prisma.deliverable.create({
    data: {
      idProyek: proyekSI.id,
      namaAktivitas: "Wireframe low-fi",
      idPenanggungJawab: createdMahasiswas[3].id, // Dedi
      status: "In Progress",
      deadlineKhusus: new Date("2026-05-28"),
      persentaseBobot: 30,
    },
  });

  // 8. LogAktivitas
  console.log("Seeding LogAktivitas...");
  await prisma.logAktivitas.create({
    data: {
      idReferensi: tugas1.id,
      idMahasiswa: createdMahasiswas[0].id,
      catatan: "Membuat rancangan entitas awal dan atribut kunci basis data SIM.",
      persenProgres: 50,
    },
  });

  // 9. Submissions
  console.log("Seeding Submissions...");
  await prisma.submission.create({
    data: {
      idTugas: tugas1.id,
      idMahasiswa: createdMahasiswas[0].id,
      fileName: "erd-sim-draft-v2.pdf",
      fileSize: "1.8 MB",
      note: "Draft ERD Basis Data - 3NF",
      type: "file",
    },
  });

  // 10. Comments
  console.log("Seeding Comments...");
  await prisma.comment.create({
    data: {
      idTugas: tugas1.id,
      idMahasiswa: createdMahasiswas[0].id,
      text: "Draft ERD sudah saya kumpulkan, mohon feedacknya Pak.",
    },
  });

  await prisma.comment.create({
    data: {
      idTugas: tugas1.id,
      idDosen: dosenProfile!.id,
      text: "Draft sudah bagus, perhatikan primary key di tabel transaksi agar tidak terjadi redundansi.",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
