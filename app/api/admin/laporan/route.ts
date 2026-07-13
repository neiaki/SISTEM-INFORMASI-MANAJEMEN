import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;
    const forbidden = requireRole(session, ["ADMIN"]);
    if (forbidden) return forbidden;

    const tasks = [
      { id: "adm-t-1", title: "Validasi Laporan Sinkronisasi SIAKAD", course: "Sistem", status: "menunggu review", priority: "Tinggi", progress: 80, deadline: "2026-05-10" },
      { id: "adm-t-2", title: "Pembaruan SSL Certificate Server Utama", course: "Infrastruktur", status: "sedang dikerjakan", priority: "Sedang", progress: 40, deadline: "2026-05-15" },
      { id: "adm-t-3", title: "Audit Log Percobaan Login Gagal", course: "Keamanan", status: "selesai", priority: "Rendah", progress: 100, deadline: "2026-05-12" }
    ];

    const integrations = [
      { name: "SIAKAD", status: "Stabil" },
      { name: "LMS Kampus", status: "Parsial" },
      { name: "Email Server", status: "Perlu observasi" },
      { name: "SSO Kampus", status: "Rencana aktivasi" }
    ];

    const report = {
      weekly: [
        { label: "M1", done: 4, late: 0 },
        { label: "M2", done: 6, late: 1 },
        { label: "M3", done: 8, late: 0 },
        { label: "M4", done: 5, late: 2 }
      ],
      kpis: [
        { title: "Ketersediaan Layanan", detail: "Uptime sistem di atas 99.9% sepanjang semester." },
        { title: "Sinkronisasi SIAKAD", detail: "Data mahasiswa sinkron secara harian otomatis." },
        { title: "Respon Reset Password", detail: "Proses reset password diselesaikan dalam < 10 menit." }
      ]
    };

    return NextResponse.json({
      tasks,
      integrations,
      report
    });

  } catch (error) {
    console.error("Admin Laporan API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
