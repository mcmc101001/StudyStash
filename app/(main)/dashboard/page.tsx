import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookmarkedModules from "@/components/dashboard/BookmarkedModules";
import { getModuleCodeOptions } from "@/lib/nusmods";
import DashboardResourcesSection from "@/components/dashboard/DashboardResourcesSection";
import { ResourceFiltersSorts, sortValue } from "@/lib/content";
import { VisitedDataType } from "@/pages/api/updateVisited";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyStash | Dashboard",
  description:
    "The dashboard page of the StudyStash app, allowing you to gain easy access to your bookmarked modules and saved resources!",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: ResourceFiltersSorts;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  let starredModules = await prisma.starredModules.findMany({
    where: {
      userId: user.id,
    },
  });

  let visitedDataObject: VisitedDataType | undefined = undefined;
  if (searchParams.filterStatus === "Visited") {
    visitedDataObject = await prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .then((user) => {
        if (!user) {
          redirect("/404");
        }
        return JSON.parse(user.visitedData);
      });
  }

  const moduleCodeOptions = await getModuleCodeOptions();

  return (
    <div className="my-10 ml-10 mr-14 text-slate-800 dark:text-slate-200">
      <div className="flex h-full w-full">
        <section className="h-full w-[23%]">
          <BookmarkedModules
            userId={user.id}
            starredModules={starredModules}
            moduleCodeOptions={moduleCodeOptions}
          />
        </section>
        <section className="h-full w-[77%] border-l-2 border-slate-300 pl-6 dark:border-slate-700">
          <DashboardResourcesSection
            filterModuleCode={searchParams.filterModuleCode}
            filterCategory={searchParams.filterCategory}
            filterSemester={searchParams.filterSemester}
            filterAcadYear={searchParams.filterAcadYear}
            filterExamType={searchParams.filterExamType}
            filterStatus={searchParams.filterStatus}
            visitedData={visitedDataObject}
            sort={searchParams.sort as sortValue | undefined}
            currentUserId={user.id}
          />
        </section>
      </div>
    </div>
  );
}
