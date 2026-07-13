import { prisma } from "@/lib/prisma";
import type { JenisNotifikasi } from "@prisma/client";

interface CreateNotifParams {
  idUser: string;
  judul: string;
  pesan: string;
  jenis: JenisNotifikasi;
}

/** Create a single notification for one user */
export async function createNotifikasi(params: CreateNotifParams) {
  try {
    return await prisma.notifikasi.create({
      data: {
        idUser: params.idUser,
        judul: params.judul,
        pesan: params.pesan,
        jenis: params.jenis,
      },
    });
  } catch (error) {
    console.error("Gagal membuat notifikasi:", error);
    return null;
  }
}

/**
 * Notify all mahasiswa enrolled in a course.
 * Looks up each mahasiswa's userId to create notifications
 * in a single createMany call for performance.
 */
export async function notifyEnrolledStudents(
  idMk: string,
  judul: string,
  pesan: string,
  jenis: JenisNotifikasi = "INFO"
) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { idMk },
      include: { mahasiswa: true },
    });

    if (enrollments.length === 0) return;

    const data = enrollments.map((en) => ({
      idUser: en.mahasiswa.userId,
      judul,
      pesan,
      jenis,
    }));

    await prisma.notifikasi.createMany({ data });
  } catch (error) {
    console.error("Gagal mengirim notifikasi ke mahasiswa:", error);
  }
}
