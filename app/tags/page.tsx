import { getAllTags } from "@/lib/posts";
import { Metadata } from "next";
import TagBadge from "@/components/TagBadge";

export const metadata: Metadata = {
  title: "标签",
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        标签
      </h1>
      <div className="mt-8 flex flex-wrap gap-3">
        {[...tags.entries()].map(([tag, count]) => (
          <TagBadge key={tag} tag={tag} count={count} />
        ))}
      </div>
    </div>
  );
}
