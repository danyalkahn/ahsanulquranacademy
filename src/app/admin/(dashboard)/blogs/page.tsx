import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminBlogsPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Blog posts</h1>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted">No posts yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.title}</span>
                  <span
                    className={`text-[10px] label px-2 py-0.5 rounded-full ${
                      post.status === "PUBLISHED"
                        ? "bg-primary/10 text-primary"
                        : "bg-black/5 text-muted-2"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="text-xs text-muted-2 mt-1 font-mono">/blog/{post.slug}</div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/blogs/${post.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
                <DeleteButton endpoint={`/api/admin/blogs/${post.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
