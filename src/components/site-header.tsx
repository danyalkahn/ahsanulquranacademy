"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export default function SiteHeader({
  logoUrl,
  logoWidth,
}: {
  logoUrl?: string | null;
  logoWidth?: number | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const size = logoWidth || 32;

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between gap-4 rounded-full border border-black/5 bg-white/90 py-2.5 pl-4 pr-2.5 shadow-[0_10px_34px_rgba(15,110,79,0.12)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={logoUrl || "/brand/logo.svg"}
              alt="Ahsan Ul Quran Academy"
              width={size}
              height={size}
              priority
              unoptimized={Boolean(logoUrl)}
            />
            <span className="hidden sm:block font-semibold text-[15px] tracking-tight text-foreground">
              Ahsan Ul Quran Academy
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              if (item.label === "Courses") {
                const active = pathname.startsWith("/courses");
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setCoursesOpen(true)}
                    onMouseLeave={() => setCoursesOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`rounded-full px-3.5 py-2 text-[13.5px] transition ${
                        active ? "text-primary font-medium" : "text-muted-2 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {coursesOpen && (
                      <div className="absolute left-0 top-full pt-2 w-72">
                        <div className="rounded-2xl border border-black/5 bg-white p-2 shadow-[0_20px_50px_rgba(15,110,79,0.16)]">
                          {siteConfig.courseNav.map((course) => (
                            <Link
                              key={course.slug}
                              href={`/courses/${course.slug}`}
                              className="block rounded-lg px-3.5 py-2.5 text-sm text-foreground/85 hover:bg-primary/5 hover:text-primary"
                            >
                              {course.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-[13.5px] transition ${
                    active ? "text-primary font-medium" : "text-muted-2 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/trial"
            className="hidden lg:inline-block rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-primary-light"
          >
            Start Free Trial
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid h-9 w-9 place-items-center rounded-full text-muted"
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <nav className="lg:hidden mt-2 flex flex-col gap-1 rounded-2xl border border-black/5 bg-white p-3 shadow-[0_10px_34px_rgba(15,110,79,0.12)]">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-primary/5 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/trial"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Start Free Trial
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
