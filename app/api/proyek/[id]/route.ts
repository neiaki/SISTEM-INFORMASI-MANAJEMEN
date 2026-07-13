import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const id = (await params).id;

    const project = await prisma.proyek.findUnique({
      where: { id },
      include: {
        mataKuliah: true,
        deliverables: true,
        kelompoks: {
          include: {
            anggota: {
              include: {
                mahasiswa: true,
              }
            }
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("GET /api/proyek/[id] Error:", error);
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

    const updatedProject = await prisma.proyek.update({
      where: { id },
      data: body,
    });

    const enrollments = await prisma.enrollment.findMany({ where: { idMk: updatedProject.idMk } });
    for (const en of enrollments) {
      await logActivity({
        idReferensi: updatedProject.id,
        idMahasiswa: en.idMahasiswa,
        catatan: `Proyek diperbarui: ${updatedProject.namaProyek}`,
        persenProgres: updatedProject.progresProyek || 0
      });
    }

    return NextResponse.json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("PUT /api/proyek/[id] Error:", error);
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
    await prisma.proyek.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/proyek/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
