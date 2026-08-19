import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ReviewForm from "@/components/admin/review-form";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit review</h1>
      <ReviewForm
        initial={{
          id: review.id,
          clientName: review.clientName,
          company: review.company,
          role: review.role,
          quote: review.quote,
          avatar: review.avatar,
          rating: review.rating,
          published: review.published,
          sortOrder: review.sortOrder,
        }}
      />
    </div>
  );
}
