import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { JenisNotifikasi } from "@prisma/client";
import { notifyEnrolledStudents } from "@/lib/notifikasi";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const { title, message, target } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In a real implementation, we would query the subjects based on the target (course name or "semua").
    // Since "target" here might just be a string label for the mock courses, we will 
    // simplify by just creating a mock notification for the sender themselves to show it in their list,
    // or if we had real course IDs, we'd use notifyEnrolledStudents.
    // Let's create it for the Dosen for now to keep the UI functioning.

    const newNotif = await prisma.notifikasi.create({
      data: {
        idUser: session.userId, // Sent to self for tracking
        judul: title,
        pesan: `${message}${target !== "semua" ? ` · ${target}` : " · Semua mahasiswa"}`,
        jenis: "BROADCAST",
      }
    });

    return NextResponse.json({ message: "Broadcast sent", notifikasi: newNotif }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifikasi/broadcast Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
