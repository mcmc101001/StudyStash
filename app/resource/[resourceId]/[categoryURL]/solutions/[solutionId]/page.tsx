import { ResourceTypeURL } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { IFrame } from "@/components/ui/IFrame";
import SolutionCommentAccordian from "@/components/SolutionCommentAccordian";
import CommentsSection from "@/components/CommentsSection";

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

  const solution = await prisma.solution.findFirst({
    where: {
      id: solutionId,
      questionPaperId: resourceId,
    },
  });

  const solutionComments = await prisma.solutionComment.findMany({
    where: {
      resourceId: solutionId,
    },
  });

  if (!solution) {
    redirect("/404");
  }

  const PDFURL = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${resourceId}`;

  return (
    <>
      <Link
        href={`/resource/${resourceId}/past_papers/solutions`}
        className="absolute left-10 top-10 w-max"
      >
        <Button variant="default">
          <span>
            <ChevronLeft className="-ml-1" size={20} />
          </span>
          <span>View all solutions</span>
        </Button>
      </Link>
      <div className="h-full w-full pr-5">
        <div
          className="mt-7 h-[75vh] w-full overflow-y-auto pl-10 pr-5
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          <IFrame
            title="PDF Resource"
            src={PDFURL}
            width="100%"
            height="85%"
          ></IFrame>
          <SolutionCommentAccordian commentCount={solutionComments.length}>
            {/* @ts-expect-error Server component */}
            <CommentsSection resourceId={solutionId} category="Solutions" />
          </SolutionCommentAccordian>
        </div>
      </div>
    </>
  );
}
