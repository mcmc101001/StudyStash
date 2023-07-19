import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "StudyStash | Profile",
  description:
    "The profile page of the StudyStash app, allowing you to view your profile, uploaded resources and statistics!",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  } else {
    redirect(`/profile/${user.id}?filterCategory=cheatsheets`);
  }
}
