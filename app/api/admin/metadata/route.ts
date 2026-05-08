import { getAllTags, getAllCategories } from "@/lib/posts";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const [tags, categories] = await Promise.all([getAllTags(), getAllCategories()]);
  return Response.json({
    tags: Array.from(tags.keys()),
    categories: Array.from(categories.keys()),
  });
}
