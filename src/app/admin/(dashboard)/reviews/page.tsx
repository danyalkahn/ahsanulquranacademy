import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          New review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet.</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.clientName}</span>
                  {!review.published && (
                    <span className="text-[10px] label px-2 py-0.5 rounded-full bg-black/5 text-muted-2">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-2 mt-1 line-clamp-1 max-w-md">{review.quote}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/reviews/${review.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
                <DeleteButton endpoint={`/api/admin/reviews/${review.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
