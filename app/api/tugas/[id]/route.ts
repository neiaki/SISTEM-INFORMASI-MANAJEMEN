import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    // Await params here as required in Next 15+ App Router
    const id = (await params).id;

    const task = await prisma.tugas.findUnique({
      where: { id },
      include: {
        mataKuliah: {
          include: {
            enrollments: {
              include: {
                mahasiswa: true
              }
            }
          }
        },
        deliverables: true,
        comments: {
          include: {
            mahasiswa: true,
            dosen: true,
          }
        },
        submissions: {
          include: {
            mahasiswa: true,
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("GET /api/tugas/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const forbidden = requireRole(session, ["DOSEN", "ADMIN"]);
    if (forbidden) return forbidden;

    const id = (await params).id;
    const body = await req.json();

    const updatedTask = await prisma.tugas.update({
      where: { id },
      data: body,
    });

    const enrollments = await prisma.enrollment.findMany({ where: { idMk: updatedTask.idMk } });
    for (const en of enrollments) {
      await logActivity({
        idReferensi: updatedTask.id,
        idMahasiswa: en.idMahasiswa,
        catatan: `Tugas diperbarui: ${updatedTask.judul}`,
        persenProgres: 0
      });
    }

    return NextResponse.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("PUT /api/tugas/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const forbidden = requireRole(session, ["DOSEN", "ADMIN"]);
    if (forbidden) return forbidden;

    const id = (await params).id;
    await prisma.tugas.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/tugas/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
