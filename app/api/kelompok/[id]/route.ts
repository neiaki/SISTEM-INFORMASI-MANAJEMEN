import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/kelompok/[id]
 * Mengambil detail satu kelompok beserta anggota dan submissions-nya.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const kelompok = await prisma.kelompok.findUnique({
      where: { id },
      include: {
        mataKuliah: { select: { namaMk: true, kodeMk: true } },
        proyek: { select: { namaProyek: true, deadlineAkhir: true, progresProyek: true } },
        anggota: {
          include: {
            mahasiswa: { select: { id: true, nama: true, nim: true, email: true } },
          },
          orderBy: { peran: "asc" },
        },
        submissions: {
          select: { id: true, idTugas: true, nilaiAkhir: true, status: true, createdAt: true },
        },
        comments: {
          select: { id: true, isi: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!kelompok) {
      return NextResponse.json({ error: "Kelompok not found" }, { status: 404 });
    }

    return NextResponse.json({ kelompok });
  } catch (error) {
    console.error("GET /api/kelompok/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/kelompok/[id]
 * Update nama kelompok, proyek yang ditautkan, atau daftar anggota.
 * Hanya Dosen/Admin yang boleh mengubah.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "DOSEN" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { namaKelompok, idProyek, addAnggota, removeAnggota } = body;

    // Update field dasar kelompok
    const updated = await prisma.kelompok.update({
      where: { id },
      data: {
        ...(namaKelompok && { namaKelompok }),
        ...(idProyek !== undefined && { idProyek }),
      },
    });

    // Tambah anggota baru
    if (addAnggota?.length) {
      for (const idMahasiswa of addAnggota as string[]) {
        await prisma.anggotaKelompok.upsert({
          where: { idKelompok_idMahasiswa: { idKelompok: id, idMahasiswa } },
          create: { idKelompok: id, idMahasiswa, peran: "Anggota" },
          update: {},
        });
      }
    }

    // Hapus anggota
    if (removeAnggota?.length) {
      await prisma.anggotaKelompok.deleteMany({
        where: {
          idKelompok: id,
          idMahasiswa: { in: removeAnggota as string[] },
        },
      });
    }

    const kelompok = await prisma.kelompok.findUnique({
      where: { id },
      include: {
        anggota: {
          include: { mahasiswa: { select: { id: true, nama: true, nim: true } } },
        },
      },
    });

    return NextResponse.json({ message: "Kelompok updated", kelompok });
  } catch (error) {
    console.error("PATCH /api/kelompok/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/kelompok/[id]
 * Menghapus kelompok beserta seluruh anggotanya (cascade).
 * Hanya Dosen/Admin yang boleh menghapus.
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "DOSEN" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.kelompok.delete({ where: { id } });

    return NextResponse.json({ message: "Kelompok deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/kelompok/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
