import UserResourcesSection from "@/components/user/UserResourcesSection";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileEditDialog from "@/components/user/ProfileEditDialog";
import { ResourceFiltersSorts, sortValue } from "@/lib/content";
import { Separator } from "@/components/ui/Separator";
import { UserAchievementsSection } from "@/components/user/UserAchievementsSection";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}) {
  const profileUser = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
  });
  if (!profileUser) {
    redirect("/404");
  }

  return {
    title: `StudyStash | ${profileUser.name}'s profile`,
    description: profileUser.bio,
  };
}

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

  let affirmation: string;
  try {
    const response = await fetch("https://www.affirmations.dev/");
    const data = await response.json();
    affirmation = `${data.affirmation}!`;
  } catch {
    affirmation = "I am enough.";
  }

  return (
    <div className="flex w-full px-14 text-slate-800 dark:text-slate-200">
      <div className="flex h-screen w-1/3 flex-col gap-y-6 overflow-y-auto pr-5 pt-10 scrollbar-none">
        <section className="relative rounded-xl bg-slate-300 p-6 dark:bg-slate-700">
          <div className="flex">
            <Image
              src={profileUser.image!}
              width={75}
              height={75}
              alt="Profile pic"
              className="rounded-xl"
            ></Image>
            {isProfile && (
              <div className="ml-auto">
                <ProfileEditDialog
                  userId={profileUser.id}
                  username={profileUser.name ?? "ERROR: name not found"}
                  bio={profileUser.bio}
                />
              </div>
            )}
          </div>
          <h1 className="mt-2 overflow-x-scroll whitespace-nowrap text-2xl font-bold scrollbar-none">
            {profileUser.name}
          </h1>
          <p
            className="mt-1 h-fit max-h-44 overflow-y-auto scroll-smooth whitespace-break-spaces break-words text-slate-600 scrollbar-thin scrollbar-track-slate-400 scrollbar-thumb-slate-100 
          scrollbar-track-rounded-md scrollbar-thumb-rounded-md dark:text-slate-400 dark:scrollbar-track-slate-600 dark:scrollbar-thumb-slate-900"
          >
            {profileUser.bio || affirmation}
          </p>
        </section>
        <section>
          {/* @ts-expect-error Server Component */}
          <UserAchievementsSection userId={profileUser.id} />
        </section>
      </div>
      <Separator
        className="h-[100vw-10rem] bg-slate-200 dark:bg-slate-800"
        orientation="vertical"
      />
      <section className="h-screen w-2/3 py-10 pl-5">
        <h1 className="mb-4 text-3xl font-semibold text-slate-800 dark:text-white">
          My resources
        </h1>
        {/* @ts-expect-error Server Component */}
        <UserResourcesSection
          filterModuleCode={searchParams.filterModuleCode}
          filterCategory={searchParams.filterCategory}
          filterSemester={searchParams.filterSemester}
          filterAcadYear={searchParams.filterAcadYear}
          filterExamType={searchParams.filterExamType}
          sort={searchParams.sort as sortValue | undefined}
          profileUserId={profileUser.id}
        />
      </section>
    </div>
  );
}
