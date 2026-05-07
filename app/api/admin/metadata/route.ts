import { getAllTags, getAllCategories } from "@/lib/posts";

export async function GET() {
  const [tags, categories] = await Promise.all([getAllTags(), getAllCategories()]);
  return Response.json({
    tags: Array.from(tags.keys()),
    categories: Array.from(categories.keys()),
  });
}
