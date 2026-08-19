import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlogForm from "@/components/admin/blog-form";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit blog post</h1>
      <BlogForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentHtml: post.contentHtml,
          coverImage: post.coverImage,
          tags: post.tags,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          ogImage: post.ogImage,
          status: post.status,
        }}
      />
    </div>
  );
}
