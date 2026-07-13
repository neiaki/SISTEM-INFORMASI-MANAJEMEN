import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const userId = session.userId;
    const { id } = await params;

    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id },
    });

    if (!notifikasi) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (notifikasi.idUser !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedNotif = await prisma.notifikasi.update({
      where: { id },
      data: { statusBaca: true },
    });

    return NextResponse.json({ message: "Marked as read", notifikasi: updatedNotif });
  } catch (error) {
    console.error("PATCH /api/notifikasi/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const userId = session.userId;
    const { id } = await params;

    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id },
    });

    if (!notifikasi) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (notifikasi.idUser !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.notifikasi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/notifikasi/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
