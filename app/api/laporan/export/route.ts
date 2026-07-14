import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requireRole } from "@/lib/auth-guard";
import { exportData, type CsvColumn } from "@/lib/exporters";

const COLUMNS: CsvColumn[] = [
  { key: "id", header: "ID" },
  { key: "judul", header: "Judul Tugas" },
  { key: "mataKuliah", header: "Mata Kuliah" },
  { key: "jenis", header: "Jenis" },
  { key: "deadline", header: "Deadline" },
  { key: "jumlahSubmit", header: "Jumlah Submit" },
  { key: "statusGlobal", header: "Status" },
];

/**
 * GET /api/laporan/export?format=csv
 * Ekspor daftar tugas ke CSV (default). Format xlsx/pdf tersedia bila
 * library terkait dipasang — lihat lib/exporters.ts (dynamic import).
 */
export async function GET(req: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const forbidden = requireRole(session, ["ADMIN", "STAFF_TU"]);
  if (forbidden) return forbidden;

  const { searchParams } = new URL(req.url);
  const format = (searchParams.get("format") ?? "csv").toLowerCase();

  const tugas = await prisma.tugas.findMany({
    orderBy: { deadline: "asc" },
    include: {
      mataKuliah: true,
      _count: { select: { submissions: true } },
    },
  });

  const rows = tugas.map((t) => ({
    id: t.id,
    judul: t.judul,
    mataKuliah: t.mataKuliah?.namaMk ?? "-",
    jenis: t.jenis,
    deadline: t.deadline.toISOString(),
    jumlahSubmit: t._count.submissions,
    statusGlobal: t.statusGlobal,
  }));

  try {
    const result = await exportData(format, rows, COLUMNS);
    const filename = `laporan-tugas.${result.extension}`;
    return new NextResponse(result.content, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 501 }
    );
  }
}
