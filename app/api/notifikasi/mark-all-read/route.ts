import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const userId = session.userId;

    await prisma.notifikasi.updateMany({
      where: {
        idUser: userId,
        statusBaca: false,
      },
      data: {
        statusBaca: true,
      },
    });

    return NextResponse.json({ message: "All notifications marked as read" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/notifikasi/mark-all-read Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
