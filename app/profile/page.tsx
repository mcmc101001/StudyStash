import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  } else {
    redirect(`/profile/${user.id}?filterCategory=cheatsheets`);
  }
}
