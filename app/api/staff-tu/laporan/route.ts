import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;
    const forbidden = requireRole(session, ["STAFF_TU"]);
    if (forbidden) return forbidden;

    const totalMahasiswa = await prisma.mahasiswa.count();
    const totalDosen = await prisma.dosen.count();
    const totalKelas = await prisma.mataKuliah.count();

    const tasks = [
      { id: "op-1", title: "Validasi KRS Mahasiswa Baru", course: "Semua Kelas", status: "menunggu review", priority: "Tinggi", progress: 80, deadline: "2026-05-10" },
      { id: "op-2", title: "Setup Akses LMS untuk Dosen Eksternal", course: "Sistem Informasi", status: "sedang dikerjakan", priority: "Sedang", progress: 40, deadline: "2026-05-15" },
      { id: "op-3", title: "Pemetaan Kelas Semester Genap", course: "Akademik", status: "belum mulai", priority: "Rendah", progress: 0, deadline: "2026-06-01" },
    ];

    const report = {
      weekly: [
        { label: "M1", done: 7, late: 1 },
        { label: "M2", done: 9, late: 2 },
        { label: "M3", done: 11, late: 1 },
        { label: "M4", done: 8, late: 2 },
      ],
      kpis: [
        { title: "Konsistensi data", detail: "Minimalkan mismatch data mahasiswa, mata kuliah, dan enrollment." },
        { title: "Availability jam operasional", detail: "Target ketersediaan minimal 99% pada 06.00-23.00 WIB." },
        { title: "Lead time reset akun", detail: "Permintaan reset akun selesai kurang dari 1 hari kerja." },
      ],
    };

    return NextResponse.json({
      stats: { totalMahasiswa, totalDosen, totalKelas },
      tasks,
      report
    });

  } catch (error) {
    console.error("Staff TU Laporan Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
