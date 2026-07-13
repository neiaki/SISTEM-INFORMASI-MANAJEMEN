import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage, buildDeadlineMessage } from "@/lib/telegram";
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
      where: { deadline: { gte: now } },
      include: {
        mataKuliah: {
          include: {
            enrollments: {
              include: {
                mahasiswa: { include: { user: true } },
              },
            },
          },
        },
        submissions: true,
      },
    });

    const notificationsCreated: any[] = [];
    const simulatedEmailsSent: any[] = [];
    const telegramSent: any[] = [];

    for (const task of activeTasks) {
      const deadline = new Date(task.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let reminderLabel = "";
      if (diffDays === 1) reminderLabel = "H-1";
      else if (diffDays === 3) reminderLabel = "H-3";
      else if (diffDays === 7) reminderLabel = "H-7";

      if (!reminderLabel) continue;

      const submittedStudentIds = new Set(task.submissions.map((s) => s.idMahasiswa));

      for (const enrollment of task.mataKuliah.enrollments) {
        const mahasiswa = enrollment.mahasiswa;
        if (submittedStudentIds.has(mahasiswa.id)) continue;

        const user = mahasiswa.user;
        const prefs = (user.preferences as any) || {};

        const createInApp = prefs.inapp_tugas !== false;
        const sendEmail = prefs.email_deadline !== false;
        const sendTelegram = prefs.telegram_sync === true && prefs.telegram_chat_id;

        const judul = `Pengingat Batas Waktu (${reminderLabel}): ${task.judul}`;
        const pesan = `Tugas "${task.judul}" untuk mata kuliah ${task.mataKuliah.namaMk} akan segera berakhir dalam ${diffDays} hari (${deadline.toLocaleDateString("id-ID")}). Silakan segera kumpulkan.`;

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

        if (sendTelegram) {
          const telegramText = buildDeadlineMessage({
            userName: mahasiswa.nama,
            taskTitle: task.judul,
            courseName: task.mataKuliah.namaMk,
            deadline,
            daysLeft: diffDays,
          });

          const sent = await sendTelegramMessage({
            chatId: prefs.telegram_chat_id,
            text: telegramText,
          });

          if (sent) {
            telegramSent.push({ userId: user.id, taskTitle: task.judul });
            await prisma.notifikasi.create({
              data: {
                idUser: user.id,
                judul,
                pesan,
                jenis: "DEADLINE" as JenisNotifikasi,
                channel: "TELEGRAM" as ChannelNotifikasi,
              },
            });
            notificationsCreated.push({ userId: user.id, taskTitle: task.judul, type: "TELEGRAM" });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      processedTasks: activeTasks.length,
      notificationsCreated: notificationsCreated.length,
      simulatedEmailsSent,
      telegramSent,
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
