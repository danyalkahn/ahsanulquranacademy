import Link from "next/link";
import Image from "next/image";

export type CourseCardData = {
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: string | null;
  icon: string | null;
};

export default function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex flex-col rounded-2xl border border-black/10 overflow-hidden bg-white transition hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_44px_rgba(15,110,79,0.14)]"
    >
      <div className="relative h-40 shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-gold/10">
        {course.heroImage ? (
          <Image
            src={course.heroImage}
            alt={course.title}
            fill
            sizes="(min-width: 640px) 320px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">{course.icon || "📖"}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="font-semibold">{course.title}</span>
        <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
          {course.shortDescription}
        </p>
        <span className="mt-auto pt-4 text-sm font-medium text-primary">Learn more →</span>
      </div>
    </Link>
  );
}
