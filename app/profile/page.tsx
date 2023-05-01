import UserResources from "@/components/UserResources";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }
  return (
    <div className="text-slate-800 dark:text-slate-200">
      <h1>Profile</h1>
      <p>I am {user.name}</p>
      <p>Add past submissions, achievements, points?</p>
      {/* @ts-expect-error Server Component */}
      <UserResources />
    </div>
  );
}
