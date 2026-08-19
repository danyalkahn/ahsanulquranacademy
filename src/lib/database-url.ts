/**
 * Hostinger's hPanel re-applies its own `localhost` value for DATABASE_URL
 * on every deploy when the variable was created via a "link database"
 * flow, overwriting manual edits — but `localhost` doesn't resolve to a
 * usable connection for the Node runtime there (it needs the TCP address,
 * 127.0.0.1). Normalizing here means the app works regardless of what
 * hPanel resets the panel value to.
 */
export function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  return raw.replace(/@localhost(?=[:/])/, "@127.0.0.1");
}
