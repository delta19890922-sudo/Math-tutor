import { getPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://your-domain.com";
  const posts = await getPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tags.add(tag);
    }
  }

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tagUrls = [...tags].map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tags`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postUrls,
    ...tagUrls,
  ];
}
