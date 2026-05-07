import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  const trashDir = path.join(process.cwd(), "content/trash");
  if (!fs.existsSync(trashDir)) {
    return Response.json([]);
  }

  const files = fs.readdirSync(trashDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(trashDir, filename);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);
      const slug = filename.replace(/\.md$/, "");
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
        category: data.category || "",
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return Response.json(files);
}
