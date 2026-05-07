import { getPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getPosts();
  const data = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    tags: post.frontmatter.tags,
    date: post.frontmatter.date,
    category: post.frontmatter.category,
  }));

  return Response.json(data);
}
