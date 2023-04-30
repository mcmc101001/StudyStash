import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function PDFPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  return (
    <>
      <li className="text-slate-800 dark:text-slate-200">
        <ul>Completed flags</ul>
        <ul>Profile and history</ul>
        <ul>Button debouncing</ul>
        <ul>Transitions and responsive ui</ul>
        <ul>Comments</ul>
        <ul>Solutions</ul>
        <ul>Responsive layout</ul>
      </li>
    </>
  );
}
