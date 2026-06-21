import { PrismaClient } from "@prisma/client";

// ============================================================
// Prisma istemcisi — yalnızca DATABASE_URL tanımlıysa örneklenir.
// Geliştirme sırasında hot-reload'da çoklu bağlantıyı önler.
// ============================================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const prisma: PrismaClient | null = hasDatabase
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    }))
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
