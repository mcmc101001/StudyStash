import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookmarkedModules from "@/components/BookmarkedModules";
import { getModuleCodeOptions } from "@/lib/nusmods";
import UserResourceTab from "@/components/UserResourceTab";
import DashboardResourcesSection from "@/components/DashboardResourcesSection";

export const revalidate = 10;

export default async function DashboardPage() {
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
      <div className="flex h-full gap-x-12">
        <section className="h-full w-1/4">
          <BookmarkedModules
            userId={user.id}
            starredModules={starredModules}
            moduleCodeOptions={moduleCodeOptions}
          />
        </section>
        <section className="h-full w-3/4">
          {/* @ts-expect-error Server components */}
          <DashboardResourcesSection />
        </section>
      </div>
    </div>
  );
}
