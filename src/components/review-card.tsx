import Image from "next/image";

export type ReviewCardData = {
  id: number;
  clientName: string;
  company: string | null;
  role: string | null;
  quote: string;
  avatar: string | null;
  rating: number | null;
};

export default function ReviewCard({ review }: { review: ReviewCardData }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      {review.rating && <div className="text-gold tracking-widest text-sm">{"★".repeat(review.rating)}</div>}
      <p className="mt-4 text-sm leading-relaxed text-foreground/90">&ldquo;{review.quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt={review.clientName}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/15" />
        )}
        <div>
          <div className="text-sm font-semibold">{review.clientName}</div>
          <div className="text-xs text-muted-2">
            {review.role}
            {review.company ? `, ${review.company}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
