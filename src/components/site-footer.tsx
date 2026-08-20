import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import ObfuscatedEmail from "@/components/obfuscated-email";
import type { SocialLink } from "@/lib/site-settings";

export default function SiteFooter({
  logoUrl,
  logoWidth,
  contactEmail,
  contactPhone,
  socialLinks,
}: {
  logoUrl?: string | null;
  logoWidth?: number | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialLinks?: SocialLink[] | null;
}) {
  const size = logoWidth || 28;
  const email = contactEmail || siteConfig.contactEmail;
  const [emailUser, emailDomain] = email.split("@");
  const phones = contactPhone ? [contactPhone] : siteConfig.phones;
  const social = socialLinks && socialLinks.length > 0 ? socialLinks : siteConfig.social;

  return (
    <footer className="border-t border-black/10 bg-footer-bg mt-24 text-footer-fg">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image src={logoUrl || "/brand/logo.svg"} alt="Ahsan Ul Quran Academy" width={size} height={size} />
            <span className="font-semibold text-sm text-white">Ahsan Ul Quran Academy</span>
          </div>
          <p className="text-sm leading-relaxed max-w-[260px]">
            One-on-one online Quran, Tajweed, Hifz and Arabic classes with certified teachers —
            for kids and adults, worldwide.
          </p>
        </div>

        <div>
          <div className="label text-xs text-gold-light mb-4">Pages</div>
          <ul className="space-y-2.5 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="label text-xs text-gold-light mb-4">Courses</div>
          <ul className="space-y-2.5 text-sm">
            {siteConfig.courseNav.slice(0, 5).map((course) => (
              <li key={course.slug}>
                <Link href={`/courses/${course.slug}`} className="hover:text-white">
                  {course.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="label text-xs text-gold-light mb-4">Contact</div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <ObfuscatedEmail user={emailUser} domain={emailDomain} className="hover:text-white" />
            </li>
            {phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs transition hover:border-gold hover:text-gold-light"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs">
        © {new Date().getFullYear()} Ahsan Ul Quran Academy. All rights reserved.
      </div>
    </footer>
  );
}
