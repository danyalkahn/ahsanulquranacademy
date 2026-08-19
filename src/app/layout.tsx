import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const labelFont = IBM_Plex_Mono({
  variable: "--font-label",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const defaultTitle = "Ahsan Ul Quran Academy — Online Quran & Islamic Studies Classes";
const defaultDescription =
  "Learn Quran, Tajweed, Hifz and Arabic online with certified teachers in one-on-one live classes — flexible scheduling, a free trial class, for kids and adults worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s — Ahsan Ul Quran Academy",
  },
  description: defaultDescription,
  openGraph: {
    siteName: "Ahsan Ul Quran Academy",
    type: "website",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.legalName,
  url: siteUrl,
  description: defaultDescription,
  email: siteConfig.contactEmail,
  sameAs: siteConfig.social.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${labelFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
