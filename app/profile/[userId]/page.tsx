import UserResources from "@/components/UserResources";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePageUser({
  params,
}: {
  params: { userId: string };
}) {
  console.log(params.userId);
  const currentUser = await getCurrentUser();
  const isProfile = params.userId === currentUser?.id;

  // use this because for some reason cannot find user by id
  const profileUserArray = await prisma.user.findMany({
    where: {
      id: params.userId,
    },
  });

  // invalid user id
  if (profileUserArray.length !== 1) {
    redirect("/404");
  }
  const profileUser = profileUserArray[0];

  return (
    <div className="text-slate-800 dark:text-slate-200">
      <h1>Profile</h1>
      <p>{profileUser.name}</p>
      <p>Add past submissions, achievements, points?</p>
      {/* @ts-expect-error Server Component */}
      <UserResources />
    </div>
  );
}
