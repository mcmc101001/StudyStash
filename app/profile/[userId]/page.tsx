import UserResourcesSection from "@/components/UserResourcesSection";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { ResourceFiltersSorts } from "@/lib/content";
import { Separator } from "@/components/ui/Separator";

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
      <div className="h-full w-1/3 pr-5">
        <section className="relative rounded-xl bg-slate-300 p-6 dark:bg-slate-700">
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
            <p className="max-h-[120px] overflow-y-auto scroll-smooth whitespace-break-spaces break-words scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-950">
              {profileUser.bio ||
                "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible."}
            </p>
          </div>
          <div className="absolute right-6 top-6">
            {isProfile && (
              <ProfileEditDialog
                userId={profileUser.id}
                username={profileUser.name ?? "ERROR: name not found"}
                bio={profileUser.bio}
              />
            )}
          </div>
        </section>
        <section className="mt-6 flex items-center justify-center bg-slate-400 text-center text-xl dark:bg-slate-600">
          Points or achievements
        </section>
      </div>
      <Separator
        className="h-[100vw-10rem] bg-slate-200 dark:bg-slate-800"
        orientation="vertical"
      />
      <section className="w-2/3 pl-5">
        <h1 className="mb-2 text-3xl font-semibold text-slate-800 dark:text-white">
          My resources
        </h1>
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
      </section>
    </div>
  );
}
