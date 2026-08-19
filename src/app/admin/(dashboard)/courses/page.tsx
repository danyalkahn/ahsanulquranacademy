import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          New course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-muted">No courses yet.</p>
      ) : (
        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{course.title}</span>
                  {!course.published && (
                    <span className="text-[10px] label px-2 py-0.5 rounded-full bg-black/5 text-muted-2">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-2 mt-1 font-mono">/courses/{course.slug}</div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/courses/${course.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
                <DeleteButton endpoint={`/api/admin/courses/${course.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
