import { prisma } from "@/lib/db";

/**
 * Simple DB-backed fixed-window rate limiter. Fine for a single-admin,
 * low-traffic site on shared hosting where an in-memory store would work
 * too but wouldn't survive process restarts.
 */
export async function checkRateLimit(
  key: string,
  { maxAttempts, windowMs }: { maxAttempts: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowMs);

  const count = await prisma.loginAttempt.count({
    where: { key, createdAt: { gte: windowStart } },
  });

  if (count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxAttempts - count };
}

export async function recordAttempt(key: string) {
  await prisma.loginAttempt.create({ data: { key } });
}

export async function cleanupOldAttempts(olderThanMs: number) {
  await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - olderThanMs) } },
  });
}
