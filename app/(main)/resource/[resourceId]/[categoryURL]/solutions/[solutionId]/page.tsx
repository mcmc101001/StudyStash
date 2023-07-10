import { ResourceTypeURL } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { IFrame } from "@/components/ui/IFrame";
import CommentsSection from "@/components/comments/CommentsSection";
import ResourceRatingProvider from "@/components/resource/ResourceRatingProvider";
import { getCurrentUser } from "@/lib/session";
import ResourceStatusProvider from "@/components/resource/ResourceStatusProvider";
import { ChevronLeft } from "lucide-react";
import SolutionCommentAccordian from "@/components/resource/SolutionCommentAccordian";

export default async function SpecificSolutionPage({
  params: { resourceId, categoryURL, solutionId },
}: {
  params: {
    resourceId: string;
    categoryURL: ResourceTypeURL;
    solutionId: string;
  };
}) {
  if (categoryURL !== "past_papers") {
    redirect("/404");
  }

  const currentUser = await getCurrentUser();

  const solution = await prisma.solution.findFirst({
    where: {
      id: solutionId,
      questionPaperId: resourceId,
    },
    include: {
      votes: true,
      statuses: true,
      comments: true,
    },
  });

  if (!solution) {
    redirect("/404");
  }

  const totalRating = solution.votes.reduce(
    (total: number, vote) => (vote.value ? total + 1 : total - 1),
    0
  );
  const userRatingVote = solution.votes.find(
    (vote) => vote.userId === currentUser?.id
  );
  const userRating = userRatingVote ? userRatingVote.value : null;
  const userStatus = solution.statuses.find(
    (status) => status.userId === currentUser?.id
  );
  const userStatusValue = userStatus ? userStatus.status : null;

  const PDFURL = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${solutionId}`;

  return (
    <>
      <div className="h-full w-full pr-5">
        <div
          className="flex h-[calc(100vh-2.5rem)] w-full flex-col overflow-y-auto pl-10 pr-5
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="mx-2 mt-4 flex flex-row items-center gap-x-4 text-lg font-semibold">
            <ResourceRatingProvider
              category={"Solutions"}
              currentUserId={currentUser?.id || null}
              totalRating={totalRating}
              userRating={userRating}
              resourceId={solutionId}
            />
            <div className="flex overflow-scroll scrollbar-none">
              {solution.name}
            </div>
            <div>
              {currentUser && (
                <ResourceStatusProvider
                  category={"Solutions"}
                  resourceId={solutionId}
                  currentUserId={currentUser.id}
                  userStatus={userStatusValue}
                />
              )}
            </div>
            <Link
              href={`/resource/${resourceId}/past_papers/solutions`}
              className="ml-auto w-max"
            >
              <Button variant="default">
                <span>
                  <ChevronLeft className="-ml-1" size={20} />
                </span>
                <span>View all solutions</span>
              </Button>
            </Link>
          </div>
          <IFrame
            title="PDF Resource"
            className="my-5 h-full min-h-[70vh] w-full shrink-0 grow basis-0"
            src={PDFURL}
            width="100%"
            height="100%"
          ></IFrame>
          <SolutionCommentAccordian
            commentCount={
              solution.comments.filter((comment) => !comment.isDeleted).length
            }
          >
            {/* @ts-expect-error Server component */}
            <CommentsSection resourceId={solutionId} category="Solutions" />
          </SolutionCommentAccordian>
        </div>
      </div>
    </>
  );
}
