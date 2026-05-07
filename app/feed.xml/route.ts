import { getPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getPosts();
  const baseUrl = "https://blog-eight-sand.vercel.app";

  const items = posts.map((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    link: `${baseUrl}/posts/${post.slug}`,
    pubDate: new Date(post.frontmatter.date).toUTCString(),
    author: "Blog",
    category: post.frontmatter.category,
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>个人博客</title>
    <link>${baseUrl}</link>
    <description>记录思考与学习的个人博客</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
