import { getPost } from "@/lib/posts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  return Response.json({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    tags: post.frontmatter.tags,
    date: post.frontmatter.date,
    category: post.frontmatter.category,
    rawContent: post.content,
  });
}
