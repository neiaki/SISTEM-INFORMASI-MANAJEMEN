import { describe, expect, it } from "bun:test";
import { buildDeadlineEmailHtml, sendEmail } from "@/lib/email";

describe("buildDeadlineEmailHtml", () => {
  const html = buildDeadlineEmailHtml({
    userName: "Budi",
    taskTitle: "Tugas Akhir",
    courseName: "Pemrograman Web",
    deadline: new Date("2026-08-01T23:59:00"),
    daysLeft: 3,
  });

  it("menyertakan nama, mata kuliah, dan judul tugas", () => {
    expect(html).toContain("Budi");
    expect(html).toContain("Pemrograman Web");
    expect(html).toContain("Tugas Akhir");
  });

  it("menyertakan informasi sisa waktu", () => {
    expect(html).toContain("3 hari lagi");
  });

  it("berupa markup HTML yang valid (tag pembuka & penutup)", () => {
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html.trimEnd().endsWith("</html>")).toBe(true);
  });
});

describe("sendEmail", () => {
  it("mengembalikan false dan tidak melempar saat RESEND_API_KEY kosong", async () => {
    const original = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    const result = await sendEmail({
      to: "a@b.com",
      subject: "test",
      html: "<p>hi</p>",
    });
    expect(result).toBe(false);
    if (original !== undefined) process.env.RESEND_API_KEY = original;
  });
});
