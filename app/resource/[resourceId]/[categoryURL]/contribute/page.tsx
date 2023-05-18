import ContributeSolution from "@/components/ContributeSolution";
import { ResourceTypeURL } from "@/lib/content";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation"

export default async function Database({
  params: { resourceId, categoryURL },
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
}) {
  const currentUser = await getCurrentUser();

  if (categoryURL !== "past_papers") {
    redirect("/404");
  }

  return (
    <div className="flex w-full items-center justify-center">
      {!currentUser ? (
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
          "You need to be logged in."
        </h1>
      ) : (
        <ContributeSolution
          currentUserId={currentUser.id}
          questionPaperId={resourceId}
        />
      )}
    </div>
  );
}
