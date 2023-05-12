import UserResources from "@/components/UserResources";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import UserProfilePic from "@/components/UserProfilePic";
import Image from "next/image";
import ProfileEditDialog from "@/components/ProfileEditDialog";

export default async function ProfilePageUser({
  params,
}: {
  params: { userId: string };
}) {
  console.log(params.userId);
  const currentUser = await getCurrentUser();
  const isProfile = params.userId === currentUser?.id;

  // use this because for some reason cannot find user by id
  // const profileUserArray = await prisma.user.findMany({
  //   where: {
  //     id: params.userId,
  //   },
  // });

  // // invalid user id
  // if (profileUserArray.length !== 1) {
  //   redirect("/404");
  // }
  // const profileUser = profileUserArray[0];

  // return (
  //   <div className="m-20 text-slate-800 dark:text-slate-200">
  //     <h1 className="text-xl font-bold">{profileUser.name}</h1>
  //     <h2 className="my-2 text-lg font-semibold">My resources</h2>
  //     {/* @ts-expect-error Server Component */}
  //     <UserResources />
  //   </div>
  // );

  try {
    // Try catch probably shouldnt encompass everything, just the findUniqueOrThrow
    const profileUser = await prisma.user.findUniqueOrThrow({
      where: {
        id: params.userId,
      },
    });

    let newname: string = "";

    return (
      <div className="m-20 text-slate-800 dark:text-slate-200">
        <div className="flex">
          <div>
            <Image
              src={profileUser.image}
              width={75}
              height={75}
              alt="Profile pic"
            ></Image>
            <h1 className="text-xl font-bold">{newname || profileUser.name}</h1>
            <div className="my-2 w-1/2">
              <h2 className="text-lg font-bold">Bio</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
                consequatur rem laudantium quidem quibusdam magnam odit,
                provident inventore, laboriosam aperiam reiciendis assumenda
                voluptatem impedit. Quidem totam tempora nemo vitae voluptate!
              </p>
            </div>
            <h2 className="my-2 text-lg font-semibold">My resources</h2>
          </div>
          <ProfileEditDialog username={profileUser.name}> </ProfileEditDialog>
        </div>
        {/* @ts-expect-error Server Component */}
        <UserResources />
      </div>
    );
  } catch (error) {
    redirect("/404");
  }
}
