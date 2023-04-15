import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {

    const user = await getCurrentUser();
    if (!user) {
      redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
    }

    return (
        <h1 className="text-slate-800 dark:text-slate-200 text-4xl font-bold">Choose a module!</h1>
    )
}