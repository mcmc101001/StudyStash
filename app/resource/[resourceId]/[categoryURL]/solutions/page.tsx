import ContributeSolutionDialog from "@/components/resource/ContributeSolutionDialog";
import SolutionItem from "@/components/resource/SolutionItem";
import SolutionSort from "@/components/resource/SolutionSort";
import {
  ResourceFiltersSorts,
  ResourceTypeURL,
  sortValue,
} from "@/lib/content";
import { SolutionsWithPosts, getSolutionsWithPosts } from "@/lib/dataFetching";
import { getCurrentUser } from "@/lib/session";
import { ResourceStatus, SolutionVote } from "@prisma/client";
import { redirect } from "next/navigation";

function getSolutionRating(resources: SolutionsWithPosts) {
  const new_resources = resources.map((resource) => {
    const rating = resource.votes.reduce(
      (total: number, vote: SolutionVote) =>
        vote.value ? total + 1 : total - 1,
      0
    );
    return {
      ...resource,
      rating: rating,
    };
  });
  return new_resources;
}

export default async function SolutionPage({
  params: { resourceId, categoryURL },
  searchParams,
}: {
  params: { resourceId: string; categoryURL: ResourceTypeURL };
  searchParams: ResourceFiltersSorts;
}) {
  if (categoryURL !== "past_papers") {
    redirect("/404");
  }

  const currentUser = await getCurrentUser();

  const Sort = searchParams.sort as sortValue | undefined;
  const FilterStatus = searchParams.filterStatus as ResourceStatus | undefined;

  const solutions = await getSolutionsWithPosts({
    resourceIdList: undefined,
    userId: undefined,
    questionPaperId: resourceId,
    moduleCode: undefined,
    FilterSemester: undefined,
    FilterAcadYear: undefined,
    FilterExamType: undefined,
    statusUserId: currentUser && FilterStatus ? currentUser.id : undefined,
    statusType: currentUser && FilterStatus ? FilterStatus : undefined,
  });

  let sortedSolutions = getSolutionRating(solutions);

  /************** SORTING **************/
  if (Sort === "rating") {
    sortedSolutions.sort((a, b) => {
      return b.rating - a.rating;
    });
  } else if (Sort === "rating_flip") {
    sortedSolutions.sort((a, b) => {
      return a.rating - b.rating;
    });
  } else if (Sort === "date") {
    sortedSolutions.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } else if (Sort === "date_flip") {
    sortedSolutions.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  return (
    <div className="h-full w-full px-10">
      <div className="mb-3 mr-5 flex items-center justify-between">
        <div className={"mr-4 " + (currentUser ? " w-96" : "w-48")}>
          <SolutionSort isSignedIn={!!currentUser} />
        </div>
        {currentUser && (
          <ContributeSolutionDialog
            questionPaperId={resourceId}
            currentUserId={currentUser.id}
          />
        )}
      </div>
      {sortedSolutions.length !== 0 ? (
        <div
          className="flex max-h-[80vh] w-full flex-col gap-y-6 overflow-y-scroll scroll-smooth pr-3 text-slate-800 scrollbar-thin
          scrollbar-track-transparent scrollbar-thumb-slate-200 scrollbar-thumb-rounded-md hover:scrollbar-thumb-slate-300 
          dark:text-slate-200 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          {sortedSolutions.map((solution) => {
            return (
              // @ts-expect-error Server component
              <SolutionItem
                key={solution.id}
                questionPaperId={resourceId}
                solutionId={solution.id}
                name={solution.name}
                userId={solution.userId}
                createdAt={solution.createdAt}
                rating={solution.rating}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-6 pb-10 text-2xl">
          <h1 className="text-slate-800 dark:text-slate-200">
            No resources found
          </h1>
        </div>
      )}
    </div>
  );
}
