import { prisma } from "@/lib/prisma";
import { SolutionVote, SolutionStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import ResourceDeleteButton from "@/components/ResourceDeleteButton";
import ResourceStatusComponent from "@/components/ResourceStatusComponent";
import { Separator } from "@/components/ui/Separator";
import ResourceRatingProvider from "@/components/ResourceRatingProvider";
import ClientDateTime from "@/components/ClientDateTime";

/*************** DATA FETCHING CODE ****************/
export async function getSolutionVote({
  userId,
  solutionId,
}: {
  userId: string;
  solutionId: string;
}) {
  const res = await prisma.solutionVote.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: solutionId,
      },
    },
  });
  return res;
}

export async function getSolutionStatus({
  userId,
  solutionId,
}: {
  userId: string;
  solutionId: string;
}) {
  const res = await prisma.solutionStatus.findUnique({
    where: {
      userId_resourceId: {
        userId: userId,
        resourceId: solutionId,
      },
    },
  });
  return res;
}

interface SolutionItemProps {
  name: string;
  solutionId: string;
  questionPaperId: string;
  userId: string;
  createdAt: Date;
  rating: number;
  deletable?: boolean;
}

export default async function SolutionItem({
  name,
  solutionId,
  questionPaperId,
  userId,
  createdAt,
  rating,
  deletable,
}: SolutionItemProps) {
  const resourceUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const currentUser = await getCurrentUser();

  let userVote: SolutionVote | null;
  let userStatus: SolutionStatus | null;

  // If user is signed in, get user vote as well as user status

  if (currentUser) {
    userVote = await getSolutionVote({ userId: currentUser.id, solutionId });
    userStatus = await getSolutionStatus({
      userId: currentUser.id,
      solutionId,
    });
  } else {
    userVote = null;
    userStatus = null;
  }

  return (
    <div className="min-h-24 flex flex-row items-center rounded-xl border border-slate-800 px-4 transition-colors hover:bg-slate-200 dark:border-slate-200 dark:hover:bg-slate-800">
      {currentUser && (
        <ResourceStatusComponent
          category="Solutions"
          resourceId={solutionId}
          currentUserId={currentUser.id}
          status={userStatus ? userStatus.status : null}
        />
      )}

      <div className="relative flex h-full w-full items-center overflow-hidden py-3">
        {/* positioned as such to prevent nesting anchor tags (use z-index to make internal link clickable) */}
        <Link
          href={`/resource/${questionPaperId}/past_papers/solutions/${solutionId}`}
          className="absolute inset-0 z-0"
        ></Link>
        <div className="flex w-full items-center">
          <ResourceRatingProvider
            category="Solutions"
            resourceId={solutionId}
            currentUserId={currentUser?.id || null}
            totalRating={rating}
            userRating={userVote?.value || null}
          />
          <div className="ml-3 flex h-full flex-col gap-y-2 overflow-hidden text-ellipsis pr-4">
            <p className="overflow-scroll whitespace-nowrap text-left font-semibold scrollbar-none">
              {name}
            </p>
            <p className="overflow-hidden whitespace-nowrap text-left text-slate-600 dark:text-slate-400">
              <ClientDateTime datetime={createdAt} />
            </p>
          </div>
          <div className="ml-auto flex h-full flex-col gap-y-2">
            <p className="whitespace-nowrap text-end">idk what to put here</p>
            <p className="z-10 ml-auto w-max whitespace-nowrap text-end">
              <Link
                href={`/profile/${resourceUser?.id}`}
                className="group z-10 ml-auto block max-w-[180px] truncate text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                {resourceUser?.name}
                <span className="mx-auto block h-0.5 max-w-0 bg-slate-700 transition-all duration-300 group-hover:max-w-full dark:bg-slate-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {deletable && currentUser?.id === userId && (
        <div className="flex h-full items-center justify-center">
          <Separator
            className="mx-4 box-border h-3/4 bg-slate-800 dark:bg-slate-200"
            orientation="vertical"
          />
          <ResourceDeleteButton
            currentUserId={currentUser.id}
            resourceId={solutionId}
            category="Solutions"
          />
        </div>
      )}
    </div>
  );
}
