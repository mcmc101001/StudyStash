import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
});

export default async function PDFPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  return (
    <>
      <div className="flex h-5/6 flex-col items-center dark:text-white">
        <div className="text-slate-800 dark:text-slate-200">
          Under development
        </div>

        <object
          data="https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK"
          className="h-full w-5/6"
        ></object>
      </div>
    </>
  );
}
