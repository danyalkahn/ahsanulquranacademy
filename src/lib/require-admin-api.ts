import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";

/** For use in API route handlers: returns the session if signed in, or a 401 response to return early. */
export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session.adminUserId) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}
