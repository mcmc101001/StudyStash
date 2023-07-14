import { prisma } from "@/lib/prisma";
import { SolutionVote, SolutionStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import ResourceDeleteButton from "@/components/resource/ResourceDeleteButton";
import { Separator } from "@/components/ui/Separator";
import ResourceRatingProvider from "@/components/resource/ResourceRatingProvider";
import ClientDateTime from "@/components/ClientDateTime";
import ProfileVerifiedIndicator from "@/components/user/ProfileVerifiedIndicator";
import ResourceContextMenu from "@/components/resource/ResourceContextMenu";
import ResourceStatusProvider from "@/components/resource/ResourceStatusProvider";
import SolutionItemLink from "@/components/resource/SolutionItemLink";

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

  const PDFURL = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${solutionId}`;

  return (
    <ResourceContextMenu
      className="min-h-24 flex flex-row items-center rounded-xl border border-slate-800 px-4 transition-colors hover:bg-slate-200 dark:border-slate-200 dark:hover:bg-slate-800"
      category="Solutions"
      resourceId={solutionId}
      resourceTitle={name}
      currentUserId={currentUser?.id || null}
      resourceUserId={resourceUser?.id!}
      shareURL={PDFURL}
      isSolution={true}
    >
      <div
        className="relative flex h-full w-full items-center overflow-hidden py-3"
        data-cy="solutionItem"
      >
        <SolutionItemLink
          solutionId={solutionId}
          questionPaperId={questionPaperId}
          currentUserId={currentUser?.id}
        />
        <div className="flex w-full items-center">
          <ResourceRatingProvider
            category="Solutions"
            resourceId={solutionId}
            currentUserId={currentUser?.id || null}
            totalRating={rating}
            userRating={userVote?.value || null}
          />
          <div className="ml-3 flex h-full flex-col gap-y-2 overflow-hidden text-ellipsis pr-4">
            <div className="flex items-center gap-x-2 text-left font-semibold">
              <span className="z-0 overflow-scroll whitespace-nowrap scrollbar-none">
                {name}
              </span>
              {currentUser && (
                <ResourceStatusProvider
                  category="Solutions"
                  resourceId={solutionId}
                  currentUserId={currentUser.id}
                  userStatus={userStatus ? userStatus.status : null}
                />
              )}
            </div>
            <p className="z-0 overflow-hidden whitespace-nowrap text-left text-slate-600 dark:text-slate-400">
              <ClientDateTime datetime={createdAt} />
            </p>
          </div>
          <div className="ml-auto flex h-full flex-col gap-y-2">
            <p className="whitespace-nowrap text-end">&#8203;</p>
            <div className="ml-auto flex w-max whitespace-nowrap text-end">
              <Link
                href={`/profile/${resourceUser?.id}`}
                className="group z-10 ml-auto block max-w-[100px] truncate text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <div className="flex items-center">
                  <span className="truncate">{resourceUser?.name}</span>
                </div>
                <span className="mx-auto block h-0.5 max-w-0 bg-slate-700 transition-all duration-300 group-hover:max-w-full dark:bg-slate-300"></span>
              </Link>
              {resourceUser?.verified && (
                <div>
                  <ProfileVerifiedIndicator />
                </div>
              )}
            </div>
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
    </ResourceContextMenu>
  );
}
