import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ResourceStatusComponentInLine from "@/components/ResourceStatusComponentInLine";

export default async function PDFPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  return (
    <>
      <div className="text-slate-800 dark:text-slate-200">
        Under development
      </div>
      <ResourceStatusComponentInLine resourceStatus="Completed" />
    </>
  );
}
