import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { JenisNotifikasi, ChannelNotifikasi } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // Optional basic authentication check using an environment variable
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const activeTasks = await prisma.tugas.findMany({
      where: {
        deadline: {
          gte: now,
        },
      },
      include: {
        mataKuliah: {
          include: {
            enrollments: {
              include: {
                mahasiswa: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        submissions: true,
      },
    });

    const notificationsCreated: any[] = [];
    const simulatedEmailsSent: any[] = [];

    for (const task of activeTasks) {
      const deadline = new Date(task.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = Math.ceil(diffHours / 24);

      let reminderLabel = "";
      if (diffDays === 1) {
        reminderLabel = "H-1";
      } else if (diffDays === 3) {
        reminderLabel = "H-3";
      } else if (diffDays === 7) {
        reminderLabel = "H-7";
      }

      // If it doesn't match our H-1, H-3, or H-7 window, skip
      if (!reminderLabel) continue;

      const enrollments = task.mataKuliah.enrollments;
      const submittedStudentIds = new Set(
        task.submissions.map((s) => s.idMahasiswa)
      );

      for (const enrollment of enrollments) {
        const mahasiswa = enrollment.mahasiswa;
        // Skip if student already submitted this task
        if (submittedStudentIds.has(mahasiswa.id)) continue;

        const user = mahasiswa.user;
        const prefs = (user.preferences as any) || {};

        // In-app notifications are generally always created
        const createInApp = prefs.inapp_tugas !== false;
        // Email notifications are enabled if email_deadline is true (default true)
        const sendEmail = prefs.email_deadline !== false;

        const judul = `Pengingat Batas Waktu (${reminderLabel}): ${task.judul}`;
        const pesan = `Tugas "${task.judul}" untuk mata kuliah ${task.mataKuliah.namaMk} akan segera berakhir dalam ${diffDays} hari (${new Date(task.deadline).toLocaleDateString()}). Silakan segera kumpulkan.`;

        if (createInApp) {
          await prisma.notifikasi.create({
            data: {
              idUser: user.id,
              judul,
              pesan,
              jenis: "DEADLINE" as JenisNotifikasi,
              channel: "IN_APP" as ChannelNotifikasi,
            },
          });
          notificationsCreated.push({ userId: user.id, taskTitle: task.judul, type: "IN_APP" });
        }

        if (sendEmail) {
          // Simulate email sending since Resend is not configured
          console.log(`[Email Simulation] Sent to: ${mahasiswa.email} | Subject: ${judul}`);
          simulatedEmailsSent.push({ email: mahasiswa.email, subject: judul });

          await prisma.notifikasi.create({
            data: {
              idUser: user.id,
              judul,
              pesan,
              jenis: "DEADLINE" as JenisNotifikasi,
              channel: "EMAIL" as ChannelNotifikasi,
            },
          });
          notificationsCreated.push({ userId: user.id, taskTitle: task.judul, type: "EMAIL" });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      processedTasks: activeTasks.length,
      notificationsCreated: notificationsCreated.length,
      simulatedEmailsSent,
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
