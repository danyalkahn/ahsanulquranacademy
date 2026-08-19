import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24 text-center">
      <div>
        <div className="label text-xs text-primary mb-3">404</div>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
