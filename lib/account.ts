import { hasDatabase, prisma } from "./db/prisma";

// Kullanıcı tercihleri — kayıtlı burç + günlük e-posta hatırlatması.
export interface UserPrefs {
  sign: string | null;
  dailyEmail: boolean;
}

export async function getUserPrefs(id: string): Promise<UserPrefs> {
  if (hasDatabase && prisma) {
    const u = await prisma.user.findUnique({
      where: { id },
      select: { sign: true, dailyEmail: true },
    });
    return { sign: u?.sign ?? null, dailyEmail: u?.dailyEmail ?? false };
  }
  return { sign: null, dailyEmail: false };
}

export async function setUserPrefs(
  id: string,
  data: { sign?: string | null; dailyEmail?: boolean },
): Promise<boolean> {
  if (hasDatabase && prisma) {
    const res = await prisma.user.updateMany({ where: { id }, data });
    return res.count > 0;
  }
  return false;
}
