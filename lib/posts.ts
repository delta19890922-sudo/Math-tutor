import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

export async function getPosts(): Promise<Post[]> {
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        frontmatter: {
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          description: data.description || "",
          tags: data.tags || [],
          category: data.category || "未分类",
        },
        content,
      };
    })
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  return posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: {
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        description: data.description || "",
        tags: data.tags || [],
        category: data.category || "未分类",
      },
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getPosts();
  const tagCount = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    }
  }

  return new Map([...tagCount.entries()].sort((a, b) => b[1] - a[1]));
}

export async function getAllCategories(): Promise<Map<string, number>> {
  const posts = await getPosts();
  const categoryCount = new Map<string, number>();

  for (const post of posts) {
    const category = post.frontmatter.category;
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
  }

  return new Map([...categoryCount.entries()].sort((a, b) => b[1] - a[1]));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.frontmatter.tags.includes(tag));
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.frontmatter.category === category);
}
