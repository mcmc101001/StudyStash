import UserResources from "@/components/UserResources";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileEditDialog from "@/components/ProfileEditDialog";

export default async function ProfilePageUser({
  params,
}: {
  params: { userId: string };
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
    <div className="m-20 text-slate-800 dark:text-slate-200">
      <div className="flex justify-between">
        <div>
          <Image
            src={profileUser.image!}
            width={75}
            height={75}
            alt="Profile pic"
          ></Image>
          <h1 className="text-xl font-bold">{profileUser.name}</h1>
          <div className="my-2">
            <h2 className="text-lg font-bold">Bio</h2>
            <p>
              {profileUser.bio ||
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit."}
            </p>
          </div>
          <h2 className="my-2 text-lg font-semibold">My resources</h2>
        </div>
        <div className="">
          {isProfile && (
            <ProfileEditDialog
              userId={profileUser.id}
              username={profileUser.name ?? "name not found"}
              bio={profileUser.bio}
            />
          )}
        </div>
      </div>
      {/* @ts-expect-error Server Component */}
      <UserResources />
    </div>
  );
}
