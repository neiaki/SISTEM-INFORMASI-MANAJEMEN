import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;
    const forbidden = requireRole(session, ["DOSEN", "ADMIN"]);
    if (forbidden) return forbidden;

    // Await params as required by Next.js 15
    const id = (await params).id;
    const body = await req.json();
    
    const { nilai } = body;

    // Optional: Validate that the submission exists and belongs to a task taught by this Dosen
    if (nilai === undefined || nilai === null) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: { nilai: parseInt(nilai, 10) },
    });

    return NextResponse.json({ message: "Grade updated successfully", submission: updatedSubmission });
  } catch (error) {
    console.error("PATCH /api/submission/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
