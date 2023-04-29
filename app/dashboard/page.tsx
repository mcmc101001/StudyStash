import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardItem from "@/components/DashboardItem";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  const starredModules = await prisma.starredModules.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="m-20 text-slate-800 dark:text-slate-200">
      <div className="flex flex-row">
        {starredModules.map((module) => {
          return <DashboardItem moduleCode={module.moduleCode} />;
        })}
      </div>
    </div>
  );
}
