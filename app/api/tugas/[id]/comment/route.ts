import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const taskId = (await params).id;
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { role, userId } = session;

    let idMahasiswa: string | null = null;
    let idDosen: string | null = null;

    if (role === "MAHASISWA") {
      const mhs = await prisma.mahasiswa.findUnique({ where: { userId } });
      if (mhs) idMahasiswa = mhs.id;
    } else if (role === "DOSEN") {
      const dsn = await prisma.dosen.findUnique({ where: { userId } });
      if (dsn) idDosen = dsn.id;
    }

    const newComment = await prisma.comment.create({
      data: {
        idTugas: taskId,
        idMahasiswa,
        idDosen,
        text
      }
    });

    return NextResponse.json({ message: "Comment created successfully", comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tugas/[id]/comment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
