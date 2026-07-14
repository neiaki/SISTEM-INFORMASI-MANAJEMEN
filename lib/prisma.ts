import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prioritas sambungan DB:
//   1. SIM_DATABASE_URL → override lokal eksplisit. Dipakai untuk menghindari
//      polusi env shell dari project lain (mis. DATABASE_URL=nekidb) yang
//      menimpa .env karena Next.js memberi process.env prioritas di atas .env.
//   2. DATABASE_URL     → injeksi otomatis Coolify / Docker / production.
//   3. fallback lokal   → Postgres lokal db_sim_tugas agar dev tetap jalan.
const DATABASE_URL =
  process.env.SIM_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres@localhost:5432/db_sim_tugas?schema=public";

console.log("Next.js PrismaClient connecting to:", DATABASE_URL);
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
