import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const userId = session.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ preferences: user.preferences || {} });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const userId = session.userId;
    const body = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences: body },
      select: { preferences: true }
    });

    return NextResponse.json({ preferences: user.preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
