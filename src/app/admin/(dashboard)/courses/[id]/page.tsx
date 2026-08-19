import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CourseForm from "@/components/admin/course-form";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id: Number(id) } });
  if (!course) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit course</h1>
      <CourseForm
        initial={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          shortDescription: course.shortDescription,
          contentHtml: course.contentHtml,
          heroImage: course.heroImage,
          icon: course.icon,
          faqs: Array.isArray(course.faqs) ? (course.faqs as { question: string; answer: string }[]) : [],
          seoTitle: course.seoTitle,
          seoDescription: course.seoDescription,
          ogImage: course.ogImage,
          published: course.published,
          sortOrder: course.sortOrder,
        }}
      />
    </div>
  );
}
