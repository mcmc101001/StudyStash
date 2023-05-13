import UserResourcesSection from "@/components/UserResourcesSection";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { ResourceFiltersSorts } from "@/lib/content";

export default async function ProfilePageUser({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: ResourceFiltersSorts;
}) {
  const currentUser = await getCurrentUser();
  const isProfile = params.userId === currentUser?.id;

  const profileUser = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
  });
  if (!profileUser) {
    redirect("/404");
  }

  return (
    <div className="flex w-full p-20 text-slate-800 dark:text-slate-200">
      <div className="w-1/3">
        <div className="relative">
          <Image
            src={profileUser.image!}
            width={75}
            height={75}
            alt="Profile pic"
          ></Image>
          <h1 className="mt-2 overflow-x-scroll whitespace-nowrap text-xl font-bold scrollbar-none">
            {profileUser.name}
          </h1>
          <div className="my-2">
            <h2 className="text-lg font-semibold">Bio</h2>
            <p className="whitespace-break-spaces break-words">
              {profileUser.bio ||
                "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible."}
            </p>
          </div>
          <div className="absolute right-0 top-0">
            {isProfile && (
              <ProfileEditDialog
                userId={profileUser.id}
                username={profileUser.name ?? "ERROR: name not found"}
                bio={profileUser.bio}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-center bg-slate-600 text-center text-xl">
          points or achievements
        </div>
      </div>
      <div className="w-2/3 pl-10">
        <h2 className="my-2 text-xl font-semibold text-white">My resources</h2>
        {/* @ts-expect-error Server Component */}
        <UserResourcesSection
          filterModuleCode={searchParams.filterModuleCode}
          filterCategory={searchParams.filterCategory}
          filterSemester={searchParams.filterSemester}
          filterAcadYear={searchParams.filterAcadYear}
          filterExamType={searchParams.filterExamType}
          sort={searchParams.sort}
          isProfile={isProfile}
          profileUserId={profileUser.id}
        />
      </div>
    </div>
  );
}
