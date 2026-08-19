import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminOverviewPage() {
  const [posts, courses, plans, reviews, unreadMessages, totalMessages, unreadTrials, totalTrials] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.course.count(),
      prisma.pricingPlan.count(),
      prisma.review.count(),
      prisma.contactSubmission.count({ where: { readAt: null } }),
      prisma.contactSubmission.count(),
      prisma.trialRequest.count({ where: { readAt: null } }),
      prisma.trialRequest.count(),
    ]);

  const recentTrials = await prisma.trialRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Blog posts", value: posts, href: "/admin/blogs" },
    { label: "Courses", value: courses, href: "/admin/courses" },
    { label: "Pricing plans", value: plans, href: "/admin/pricing" },
    { label: "Reviews", value: reviews, href: "/admin/reviews" },
    { label: "Contact messages", value: `${unreadMessages}/${totalMessages}`, href: "/admin/messages" },
    { label: "Trial requests", value: `${unreadTrials}/${totalTrials}`, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-surface px-5 py-4 hover:border-primary/50 transition"
          >
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Recent trial requests</h2>
      {recentTrials.length === 0 ? (
        <p className="text-sm text-muted">No trial requests yet.</p>
      ) : (
        <div className="space-y-2">
          {recentTrials.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.name}</span>
                <span className="text-xs text-muted-2">{t.createdAt.toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted mt-1">
                {[t.course, t.preferredPlan].filter(Boolean).join(" · ") || t.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
