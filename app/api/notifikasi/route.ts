import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { JenisNotifikasi } from "@prisma/client";
import { getPagination, buildPaginationMeta } from "@/lib/pagination";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // all, unread
    const pageParam = searchParams.get("page");
    const pg = getPagination(pageParam, searchParams.get("limit"));

    const where: any = { idUser: userId };
    if (filter === "unread") {
      where.statusBaca = false;
    }

    if (pageParam) {
      const [notifikasi, total] = await Promise.all([
        prisma.notifikasi.findMany({
          where,
          orderBy: { waktuKirim: "desc" },
          skip: pg.skip,
          take: pg.take,
        }),
        prisma.notifikasi.count({ where }),
      ]);
      return NextResponse.json({ notifikasi, pagination: buildPaginationMeta(pg.page, pg.limit, total) });
    }

    const notifikasi = await prisma.notifikasi.findMany({
      where,
      orderBy: { waktuKirim: "desc" },
      take: 50, // limit to recent 50 when not paginated
    });

    return NextResponse.json({ notifikasi });
  } catch (error) {
    console.error("GET /api/notifikasi Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow explicit POSTs from specific roles if needed, 
    // or rely on server-side helpers for auto-generation instead of this route.
    const body = await req.json();
    const { idUser, judul, pesan, jenis } = body;

    if (!idUser || !judul || !pesan || !jenis) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNotif = await prisma.notifikasi.create({
      data: {
        idUser,
        judul,
        pesan,
        jenis: jenis as JenisNotifikasi,
      }
    });

    return NextResponse.json({ message: "Notification created", notifikasi: newNotif }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifikasi Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
