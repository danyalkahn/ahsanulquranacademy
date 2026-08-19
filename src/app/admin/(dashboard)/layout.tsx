import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import DashboardNav from "./dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session.adminUserId) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav email={session.email ?? ""} />
      <main className="flex-1 px-8 py-8 max-w-5xl">{children}</main>
    </div>
  );
}
