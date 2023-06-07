import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookmarkedModules from "@/components/BookmarkedModules";
import { getModuleCodeOptions } from "@/lib/nusmods";

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
    <div className="m-28 text-slate-800 dark:text-slate-200">
      <div className="flex flex-row flex-wrap gap-12 overflow-hidden">
        <BookmarkedModules
          userId={user.id}
          starredModules={starredModules}
          moduleCodeOptions={moduleCodeOptions}
        />
        {/* {starredModules.map((module, index) => {
          if (index < 12) {
            return (
              <DashboardItem
                key={module.moduleCode}
                moduleCode={module.moduleCode}
              />
            );
          } else {
            return null;
          }
        })}
        {starredModules.length < 12 && <DashboardItem moduleCode={null} />} */}
      </div>
    </div>
  );
}
