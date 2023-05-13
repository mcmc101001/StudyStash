import { getRating } from "@/app/database/[moduleCode]/[category]/page";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ResourceItem from "@/components/ResourceItem";
import UserResourceTab from "./UserResourceTab";
import { ResourceOptions, ResourceType, ResourceTypeURL } from "@/lib/content";

interface UserResourcesSectionProps {
  profileUserId: string;
  filterCategory: ResourceTypeURL | undefined;
  isProfile: boolean;
}

export default async function UserResourcesSection({
  profileUserId,
  filterCategory,
  isProfile,
}: UserResourcesSectionProps) {
  console.log(filterCategory);
  let category: ResourceType;
  let resources;
  if (filterCategory === "cheatsheets") {
    category = "Cheatsheets";
    resources = await prisma.cheatsheet.findMany({
      where: {
        userId: profileUserId,
      },
      include: {
        votes: true,
      },
    });
  } else if (filterCategory === "past_papers") {
    category = "Past Papers";
    resources = await prisma.questionPaper.findMany({
      where: {
        userId: profileUserId,
      },
      include: {
        votes: true,
        _count: { select: { difficulties: true } },
      },
    });
  } else if (filterCategory === "notes") {
    category = "Notes";
    resources = await prisma.notes.findMany({
      where: {
        userId: profileUserId,
      },
      include: {
        votes: true,
      },
    });
  } else if (filterCategory !== undefined) {
    redirect("/404");
  }

  const resourcesWithRating = resources ? getRating(resources) : [];

  return (
    <>
      <UserResourceTab resourceOptions={ResourceOptions} />
      <div className="flex h-[70vh] w-full justify-between">
        {filterCategory === undefined ? (
          <div>Select category.</div>
        ) : (
          <div
            className="flex w-4/5 flex-col gap-y-6 overflow-y-auto pr-5 scrollbar-thin 
          scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 
          dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
            style={{ scrollbarGutter: "stable" }}
          >
            {resourcesWithRating.length !== 0 ? (
              <div className="flex flex-col gap-y-6">
                {resourcesWithRating.map((resource) => {
                  return (
                    /* @ts-expect-error Server Component */
                    <ResourceItem
                      key={resource.id}
                      resourceId={resource.id}
                      name={resource.name}
                      userId={resource.userId}
                      createdAt={resource.createdAt}
                      acadYear={resource.acadYear}
                      semester={resource.semester}
                      rating={resource.rating}
                      difficultyCount={
                        filterCategory === "past_papers"
                          ? // @ts-expect-error wrong type inference
                            resource._count.difficulties
                          : undefined
                      }
                      examType={
                        // @ts-expect-error wrong type inference
                        filterCategory !== "notes" ? resource.type : null
                      }
                      category={category}
                      deletable={isProfile}
                    />
                  );
                })}
              </div>
            ) : (
              <div>Start contributing!</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
