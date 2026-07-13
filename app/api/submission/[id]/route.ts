import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
