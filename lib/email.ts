/**
 * lib/email.ts
 * Helper untuk mengirim email via Resend (REST API).
 *
 * Menggunakan fetch langsung ke API Resend agar tidak menambah dependency baru.
 * Setup:
 * 1. Buat akun di https://resend.com dan buat API Key
 * 2. Salin API key ke RESEND_API_KEY di .env.local (atau env Coolify)
 * 3. (Opsional) verifikasi domain pengirim di dashboard Resend agar
 *    email tidak masuk ke spam. Default FROM menggunakan domain resend.dev.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API = "https://api.resend.com/emails";
const DEFAULT_FROM =
  process.env.EMAIL_FROM ?? "SIM Tugas <onboarding@resend.dev>";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Mengirim email via Resend.
 * Mengembalikan `true` jika berhasil, `false` jika gagal atau belum terkonfigurasi.
 * Aman dipanggil saat RESEND_API_KEY kosong — hanya mencatat peringatan.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM,
}: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY tidak dikonfigurasi. Email tidak dikirim.");
    return false;
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[Email] Gagal mengirim email:", data);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Email] Error saat mengirim email:", err);
    return false;
  }
}

/**
 * Membuat HTML email pengingat deadline (responsive, tanpa CSS eksternal).
 */
export function buildDeadlineEmailHtml({
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
  const urgencyColor = daysLeft <= 1 ? "#dc2626" : daysLeft <= 3 ? "#ca8a04" : "#16a34a";
  const urgencyText = daysLeft <= 1 ? "Sangat Mendesak" : daysLeft <= 3 ? "Mendesak" : "Masih Ada Waktu";
  const deadlineStr = deadline.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="id">
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr><td style="background:${urgencyColor};padding:20px 24px;color:#ffffff;font-size:18px;font-weight:bold;">
            Pengingat Batas Waktu Tugas
          </td></tr>
          <tr><td style="padding:24px;">
            <p style="margin:0 0 12px;font-size:15px;color:#27272a;">Hai, <b>${userName}</b>!</p>
            <p style="margin:0 0 16px;font-size:15px;color:#27272a;">Tugas berikut akan segera mencapai batas waktu pengumpulan:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;">
              <tr><td style="padding:14px 16px;font-size:14px;color:#52525b;"><b>Mata Kuliah</b><br/>${courseName}</td></tr>
              <tr><td style="padding:0 16px 14px;font-size:14px;color:#52525b;"><b>Tugas</b><br/>${taskTitle}</td></tr>
              <tr><td style="padding:0 16px 14px;font-size:14px;color:#52525b;"><b>Deadline</b><br/>${deadlineStr}</td></tr>
              <tr><td style="padding:0 16px 16px;font-size:14px;color:#52525b;"><b>Sisa Waktu</b><br/><span style="color:${urgencyColor};font-weight:bold;">${daysLeft === 0 ? "Hari ini!" : `${daysLeft} hari lagi`} (${urgencyText})</span></td></tr>
            </table>
            <p style="margin:16px 0 0;font-size:13px;color:#71717a;">Segera kerjakan dan kumpulkan tepat waktu. Pesan ini dikirim otomatis oleh sistem SIM Tugas.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
