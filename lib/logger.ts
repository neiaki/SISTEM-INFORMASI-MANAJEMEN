import { prisma } from "@/lib/prisma";

export async function logActivity({
  idReferensi,
  idMahasiswa,
  catatan,
  persenProgres
}: {
  idReferensi: string;
  idMahasiswa: string;
  catatan: string;
  persenProgres: number;
}) {
  try {
    const log = await prisma.logAktivitas.create({
      data: {
        idReferensi,
        idMahasiswa,
        catatan,
        persenProgres
      }
    });
    return log;
  } catch (error) {
    console.error("Gagal menyimpan log aktivitas:", error);
    return null;
  }
}
