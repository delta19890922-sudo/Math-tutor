import { getPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          个人博客
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          记录思考与学习的地方。
        </p>
      </div>

      <div className="space-y-10">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
