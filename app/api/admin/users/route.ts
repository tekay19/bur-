import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { adminHasDb, createMember, listMembers } from "@/lib/adminData";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const sp = req.nextUrl.searchParams;
  const data = await listMembers({
    q: sp.get("q") ?? undefined,
    page: Number(sp.get("page") ?? 1) || 1,
  });
  return NextResponse.json({ db: adminHasDb, ...data });
}

const createSchema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
  password: z.string().min(8, "Şifre en az 8 karakter").max(200),
  name: z.string().max(60).optional().or(z.literal("")),
  plan: z.enum(["free", "premium"]).optional(),
  credits: z.number().int().min(0).max(10_000_000).optional(),
});

// Panelden yeni üye oluştur.
export async function POST(req: NextRequest) {
  const acting = await getAdminFromRequest(req);
  if (!acting) return adminForbidden();
  // Çalınan admin oturumuyla toplu sahte hesap açmaya karşı (admin başına).
  const rl = rateLimit(`admin-create:${acting.id}`, 30, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Form hatası." },
      { status: 422 },
    );

  const res = await createMember(parsed.data);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 409 });
  console.info(
    `[admin-audit] ${acting.email} created user ${parsed.data.email} (plan=${parsed.data.plan ?? "free"}, credits=${parsed.data.credits ?? 0})`,
  );
  return NextResponse.json({ ok: true, id: res.id });
}
