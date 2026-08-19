import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/site-settings";
import { HeroBadge, HeroGlow } from "@/components/hero-background";
import ObfuscatedEmail from "@/components/obfuscated-email";
import ContactForm from "@/components/contact-form";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime, and contact
// details/social links can be changed live from the admin settings page.
export const dynamic = "force-dynamic";

const description = "Questions about a course or your account? Get in touch with Ahsan Ul Quran Academy.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Ahsan Ul Quran Academy", description, url: "/contact" },
  twitter: { card: "summary_large_image", title: "Contact — Ahsan Ul Quran Academy", description },
};

export default async function ContactPage() {
  const { contactEmail, contactPhone, socialLinks } = await getSiteSettings();
  const email = contactEmail || siteConfig.contactEmail;
  const [emailUser, emailDomain] = email.split("@");
  const phones = contactPhone ? [contactPhone] : siteConfig.phones;
  const social = socialLinks && socialLinks.length > 0 ? socialLinks : siteConfig.social;

  return (
    <div className="relative overflow-hidden pb-20">
      <HeroGlow />
      <div className="relative mx-auto max-w-2xl px-6 pt-20 pb-6 text-center">
        <HeroBadge label="CONTACT" />
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Get in touch
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15.5px] text-muted leading-relaxed">
          Questions about a course or your account? We reply within 24 hours.
        </p>
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-6 px-6 items-start sm:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[26px] border border-black/10 bg-white p-6 sm:p-9 shadow-[0_24px_60px_rgba(20,52,92,0.08)]">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[22px] border border-primary/30 bg-gradient-to-br from-primary/[0.08] to-transparent p-6">
            <div className="font-mono text-[11px] tracking-[0.2em] text-primary">EMAIL</div>
            <ObfuscatedEmail
              user={emailUser}
              domain={emailDomain}
              className="mt-2.5 block font-semibold text-[17px] text-foreground"
            />
          </div>

          {phones[0] && (
            <div className="rounded-[22px] border border-black/10 bg-white p-6">
              <div className="font-mono text-[11px] tracking-[0.2em] text-primary">PHONE / WHATSAPP</div>
              {phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s+/g, "")}`} className="mt-2.5 block font-semibold text-[17px] text-foreground">
                  {p}
                </a>
              ))}
            </div>
          )}

          <div className="rounded-[22px] border border-black/10 bg-white p-6">
            <div className="font-mono text-[11px] tracking-[0.2em] text-primary">FOLLOW US</div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="rounded-full border border-black/10 px-4 py-2 text-[12.5px] text-foreground/80 transition hover:border-primary hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
