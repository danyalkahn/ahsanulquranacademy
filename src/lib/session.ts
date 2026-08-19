import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface AdminSessionData {
  adminUserId?: number;
  email?: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must be set to a string of at least 32 characters");
}

export const sessionOptions: SessionOptions = {
  password: sessionSecret,
  cookieName: "aqa_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.adminUserId) {
    return null;
  }
  return session;
}
