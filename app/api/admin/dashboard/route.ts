import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await prisma.user.count();
    
    // Count user growth (joined in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsersCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Mock operations tasks
    const tasks = [
      { id: "adm-t-1", title: "Validasi Laporan Sinkronisasi SIAKAD", course: "Sistem", status: "menunggu review" },
      { id: "adm-t-2", title: "Pembaruan SSL Certificate Server Utama", course: "Infrastruktur", status: "sedang dikerjakan" },
      { id: "adm-t-3", title: "Audit Log Percobaan Login Gagal", course: "Keamanan", status: "selesai" }
    ];

    // Integrations
    const integrations = [
      { name: "SIAKAD", status: "Stabil", note: "Koneksi database sinkron" },
      { name: "LMS Kampus", status: "Parsial", note: "Impor tugas manual aktif" },
      { name: "Email Server", status: "Perlu observasi", note: "Ditemukan beberapa mail delivery delay" },
      { name: "SSO Kampus", status: "Rencana aktivasi", note: "Menunggu konfigurasi metadata SAML" }
    ];

    // Operations modules
    const operations = [
      { title: "Manajemen user", detail: "Buat akun, nonaktifkan, reset password, dan jaga role tetap konsisten.", status: "Aktif" },
      { title: "Semester aktif", detail: "Pusat kontrol tahun ajar, semester, bahasa, dan zona waktu default.", status: "Aktif" },
      { title: "Monitoring integrasi", detail: "Pantau SIAKAD, LMS, email, dan SSO dari satu panel.", status: "Aktif" }
    ];

    // System notifications (Admin)
    const notifications = await prisma.notifikasi.findMany({
      where: {
        idUser: (session.user as any).id
      },
      orderBy: { waktuKirim: "desc" },
      take: 5
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        recentUsersCount,
        activeIntegrationsCount: integrations.filter(i => i.status === "Stabil").length,
        totalIntegrationsCount: integrations.length,
        alertCount: notifications.length
      },
      tasks,
      integrations,
      operations,
      notifications
    });

  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
