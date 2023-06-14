import { ResourceType, ResourceTypeURL } from "@/lib/content";
import { redirect } from "next/navigation";
import CommentsSection from "@/components/CommentsSection";

export default async function SolutionCommentsPage({
  params: { resourceId, categoryURL },
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
}) {
  let category: ResourceType;
  if (categoryURL === "cheatsheets") {
    category = "Cheatsheets";
  } else if (categoryURL === "past_papers") {
    category = "Past Papers";
  } else if (categoryURL === "notes") {
    category = "Notes";
  } else {
    redirect("/404");
  }

  return (
    <div className="h-full w-full px-10">
      {/* @ts-expect-error Server Component */}
      <CommentsSection
        className="h-[75vh]"
        category={category}
        resourceId={resourceId}
      />
    </div>
  );
}
