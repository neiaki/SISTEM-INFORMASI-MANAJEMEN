import { describe, expect, it } from "bun:test";
import { toCsv, exportData } from "@/lib/exporters";

describe("toCsv", () => {
  const rows = [
    { id: "1", nama: "Budi", nilai: 90 },
    { id: "2", nama: "Sari", nilai: 85 },
  ];
  const columns = [
    { key: "id", header: "ID" },
    { key: "nama", header: "Nama" },
    { key: "nilai", header: "Nilai" },
  ];

  it("menghasilkan header dan baris yang dipisah koma", () => {
    const csv = toCsv(rows, columns);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("ID,Nama,Nilai");
    expect(lines[1]).toBe("1,Budi,90");
    expect(lines[2]).toBe("2,Sari,85");
  });

  it("meng-escape nilai yang mengandung koma atau quote", () => {
    const csv = toCsv([{ id: "1", nama: 'A,"B', nilai: 1 }], columns);
    expect(csv).toContain('"A,""B"');
  });
});

describe("exportData", () => {
  it("csv mengembalikan content-type text/csv dan ekstensi csv", async () => {
    const res = await exportData("csv", [{ a: 1 }], [{ key: "a", header: "A" }]);
    expect(res.extension).toBe("csv");
    expect(res.contentType).toContain("text/csv");
  });

  it("xlsx/pdf melempar error (library belum terpasang)", async () => {
    await expect(exportData("xlsx", [])).rejects.toThrow();
    await expect(exportData("pdf", [])).rejects.toThrow();
  });
});
