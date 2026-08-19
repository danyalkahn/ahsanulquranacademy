import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(10),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.adminUserId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request — new password must be at least 10 characters" },
      { status: 400 }
    );
  }
  const { currentPassword, newPassword } = parsed.data;

  const adminUser = await prisma.adminUser.findUnique({ where: { id: session.adminUserId } });
  if (!adminUser) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const ok = await bcrypt.compare(currentPassword, adminUser.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({ where: { id: adminUser.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
