import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Di Docker/VPS, sambungan DB dikendalikan oleh DATABASE_URL (disuntikkan
// Coolify / docker-compose). Fallback ke Postgres lokal agar dev tetap jalan.
const DATABASE_URL =
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
