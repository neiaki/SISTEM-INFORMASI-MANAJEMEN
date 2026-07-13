/**
 * lib/telegram.ts
 * Helper untuk mengirimkan notifikasi via Telegram Bot API.
 *
 * Setup:
 * 1. Buat bot baru dengan @BotFather di Telegram
 * 2. Salin token yang diberikan ke TELEGRAM_BOT_TOKEN di .env.local
 * 3. User harus memulai percakapan dengan bot terlebih dahulu (/start)
 *    dan menghubungkan Telegram ID mereka ke akun SIM Tugas melalui
 *    fitur preferensi notifikasi.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
}

/**
 * Mengirim pesan teks ke Telegram chat ID tertentu.
 * Mengembalikan `true` jika berhasil, `false` jika gagal.
 */
export async function sendTelegramMessage({
  chatId,
  text,
  parseMode = "HTML",
}: TelegramMessage): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN tidak dikonfigurasi. Pesan tidak dikirim.");
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("[Telegram] Gagal mengirim pesan:", data);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Telegram] Error saat mengirim pesan:", err);
    return false;
  }
}

/**
 * Membuat teks notifikasi deadline dalam format HTML yang siap dikirim ke Telegram.
 */
export function buildDeadlineMessage({
  userName,
  taskTitle,
  courseName,
  deadline,
  daysLeft,
}: {
  userName: string;
  taskTitle: string;
  courseName: string;
  deadline: Date;
  daysLeft: number;
}): string {
  const urgencyEmoji = daysLeft <= 1 ? "🔴" : daysLeft <= 3 ? "🟡" : "🟢";
  const deadlineStr = deadline.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${urgencyEmoji} <b>Pengingat Tugas — SIM Tugas</b>

Hai, <b>${userName}</b>!

Tugas berikut akan segera deadline:

📚 <b>Mata Kuliah:</b> ${courseName}
📝 <b>Tugas:</b> ${taskTitle}
⏰ <b>Deadline:</b> ${deadlineStr}
🗓 <b>Sisa waktu:</b> ${daysLeft === 0 ? "Hari ini!" : `${daysLeft} hari lagi`}

Segera kerjakan dan kumpulkan tepat waktu!

<i>Pesan ini dikirim otomatis oleh sistem SIM Tugas.</i>`;
}
