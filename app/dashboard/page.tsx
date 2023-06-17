import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookmarkedModules from "@/components/BookmarkedModules";
import { getModuleCodeOptions } from "@/lib/nusmods";
import DashboardResourcesSection from "@/components/DashboardResourcesSection";
import { ResourceFiltersSorts, sortValue } from "@/lib/content";

export const revalidate = 10;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: ResourceFiltersSorts;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  let starredModules = await prisma.starredModules.findMany({
    where: {
      userId: user.id,
    },
  });

  const moduleCodeOptions = await getModuleCodeOptions();

  return (
    <div className="m-20 text-slate-800 dark:text-slate-200">
      <div className="flex h-full w-full">
        <section className="h-full w-1/4 pr-8">
          <BookmarkedModules
            userId={user.id}
            starredModules={starredModules}
            moduleCodeOptions={moduleCodeOptions}
          />
        </section>
        <section className="h-full w-3/4">
          {/* @ts-expect-error Server components */}
          <DashboardResourcesSection
            filterModuleCode={searchParams.filterModuleCode}
            filterCategory={searchParams.filterCategory}
            filterSemester={searchParams.filterSemester}
            filterAcadYear={searchParams.filterAcadYear}
            filterExamType={searchParams.filterExamType}
            filterStatus={searchParams.filterStatus}
            sort={searchParams.sort as sortValue | undefined}
            currentUserId={user.id}
          />
        </section>
      </div>
    </div>
  );
}
