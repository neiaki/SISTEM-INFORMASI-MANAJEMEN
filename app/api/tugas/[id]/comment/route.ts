import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = (await params).id;
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

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
