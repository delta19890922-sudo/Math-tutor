import Link from "next/link";
import type { Post } from "@/lib/posts";
import TagBadge from "./TagBadge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className="group">
      <Link href={`/posts/${slug}`}>
        <time className="text-sm text-zinc-500 dark:text-zinc-500">
          {new Date(frontmatter.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">
          {frontmatter.title}
        </h2>
        {frontmatter.description && (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {frontmatter.description}
          </p>
        )}
      </Link>
      <div className="mt-3 flex flex-wrap gap-2">
        {frontmatter.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
