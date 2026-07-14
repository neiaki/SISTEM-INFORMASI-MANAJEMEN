/**
 * lib/exporters.ts
 * Helper ekspor data ke berbagai format.
 *
 * - CSV: di-generate native (tanpa dependency) — langsung jalan.
 * - XLSX / PDF: menggunakan DYNAMIC IMPORT (`await import(...)`) sehingga
 *   library berat (exceljs / pdfkit) hanya dimuat saat tombol ekspor ditekan,
 *   tidak menambah initial bundle. Library tersebut BELUM terpasang —
 *   pasang (tanyakan dulu per aturan repo) bila format ini dibutuhkan.
 */

export interface CsvColumn {
  key: string;
  header: string;
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Generate CSV string dari array of objects. */
export function toCsv(rows: Record<string, unknown>[], columns?: CsvColumn[]): string {
  if (rows.length === 0) return "";

  const cols = columns ?? Object.keys(rows[0]).map((k) => ({ key: k, header: k }));
  const header = cols.map((c) => escapeCsv(c.header)).join(",");
  const body = rows
    .map((row) => cols.map((c) => escapeCsv(row[c.key])).join(","))
    .join("\n");

  return `${header}\n${body}`;
}

/**
 * Ekspor data ke format yang diminta.
 * - "csv"  → native (selalu tersedia)
 * - "xlsx" → butuh `exceljs` (dynamic import)
 * - "pdf"  → butuh `pdfkit` (dynamic import)
 *
 * Mengembalikan { content, contentType, extension }.
 */
export async function exportData(
  format: string,
  rows: Record<string, unknown>[],
  columns?: CsvColumn[]
): Promise<{ content: string; contentType: string; extension: string }> {
  if (format === "xlsx") {
    // Extension point: pasang `exceljs` lalu aktifkan blok berikut.
    // const ExcelJS = (await import("exceljs")).default;
    // const wb = new ExcelJS.Workbook(); ...
    throw new Error(
      "Format xlsx belum aktif: install 'exceljs' terlebih dahulu (dynamic import sudah disiapkan di lib/exporters.ts)."
    );
  }

  if (format === "pdf") {
    // Extension point: pasang `pdfkit` lalu aktifkan blok berikut.
    // const PDFDocument = (await import("pdfkit")).default; ...
    throw new Error(
      "Format pdf belum aktif: install 'pdfkit' terlebih dahulu (dynamic import sudah disiapkan di lib/exporters.ts)."
    );
  }

  // Default: CSV (native, tanpa dependency).
  return {
    content: toCsv(rows, columns),
    contentType: "text/csv; charset=utf-8",
    extension: "csv",
  };
}
