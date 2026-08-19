# Ahsan Ul Quran Academy

Next.js site + admin backend for Ahsan Ul Quran Academy: public marketing pages, course pages
with FAQs, pricing plans, an SEO-friendly blog, student reviews, a dedicated free-trial request
flow, an SMTP-backed contact form, and an admin dashboard (email-OTP 2FA) for managing all of it.

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS 4
- Prisma ORM + MySQL (MariaDB-compatible, via `@prisma/adapter-mariadb`)
- Custom session auth (`iron-session`) with email-OTP two-factor sign-in
- Nodemailer over SMTP for admin OTP codes, password resets, contact and trial-request mail
- Tiptap rich-text editor for blog posts and course content, sanitized server-side with DOMPurify
- Uploaded images stored as bytes in the database (not on disk) so they survive Hostinger deploys

## Local development

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL` /
   `ADMIN_INITIAL_PASSWORD` (seed-only), and SMTP settings. Leaving `SMTP_USER`/`SMTP_PASS` blank
   makes the app log emails to the console instead of sending them — handy for local testing.
2. Install dependencies: `npm install`
3. Apply migrations: `npx prisma migrate deploy` (or `npx prisma migrate dev` while iterating on
   the schema)
4. Seed the admin user, courses, pricing plans and sample reviews: `npx prisma db seed`
5. `npm run dev` and open `http://localhost:3000`. Admin dashboard is at `/admin/login`.

## Deploying to Hostinger (Business hosting)

1. In hPanel, create a MySQL database + user, and set `DATABASE_URL` in the app's environment
   variables accordingly.
2. In hPanel > Emails, create a mailbox on your domain (e.g. `info@ahsanulquranacademy.com`) and
   use its credentials for `SMTP_HOST` (`smtp.hostinger.com`), `SMTP_USER`, `SMTP_PASS`.
   Hostinger's SMTP only authenticates mailboxes it hosts on your domain — it will not accept
   Gmail credentials.
3. Set all remaining `.env` values (`SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`,
   `NEXT_PUBLIC_SITE_URL`) as environment variables in hPanel's Node.js app settings — do not
   commit `.env`.
4. Point hPanel's Node.js app at this project with `npm run build` as the build command and
   `npm run start` as the start command.
5. Run once after first deploy: `npx prisma migrate deploy` then `npx prisma db seed`.
6. Sign in at `/admin/login`, then go to Settings and rotate the admin password — the initial one
   was set via `.env` during development and should not stay in long-term use.
7. If migrating from an existing WordPress site, map old URLs to their new equivalents via
   `redirects()` in `next.config.ts` before pointing DNS at the new site, so existing search
   rankings and backlinks aren't lost.

## Project structure

- `src/app/(public)/*` — public site (home, courses, course detail, pricing, about, blog, contact, trial)
- `src/app/admin/*` — admin auth pages + the signed-in dashboard (route-grouped, guarded by
  `src/app/admin/(dashboard)/layout.tsx`)
- `src/app/api/admin/*` — authenticated CRUD/API routes for blog, courses, pricing, reviews,
  messages, trial requests, uploads, and auth
- `src/app/api/contact`, `src/app/api/trial-request` — public API routes
- `src/lib/*` — Prisma client, session/auth helpers, mailer, OTP, rate limiting, uploads
- `prisma/schema.prisma`, `prisma/seed.ts` — data model and the one-time admin/sample-data seed
