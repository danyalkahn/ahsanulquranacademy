"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/blogs", label: "Blog" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/settings", label: "Settings" },
];

export default function DashboardNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="w-56 shrink-0 border-r border-border px-5 py-8 flex flex-col">
      <div className="label text-xs text-primary mb-8">AQA ADMIN</div>
      <div className="flex-1 space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-border pt-4">
        <p className="truncate text-xs text-muted-2 mb-2">{email}</p>
        <button
          onClick={logout}
          className="text-sm text-muted hover:text-red-600 transition"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
