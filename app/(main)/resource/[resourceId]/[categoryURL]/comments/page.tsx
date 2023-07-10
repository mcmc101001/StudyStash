import { ResourceType, ResourceTypeURL } from "@/lib/content";
import { redirect } from "next/navigation";
import CommentsSection from "@/components/comments/CommentsSection";

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
    <div className="h-full w-full">
      {/* @ts-expect-error Server Component */}
      <CommentsSection
        label="Question paper comments"
        className="h-[85vh]"
        category={category}
        resourceId={resourceId}
      />
    </div>
  );
}
