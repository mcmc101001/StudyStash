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
      <ul className="text-slate-800 dark:text-slate-200">
        <li>Completed flags</li>
        <li>Profile and history</li>
        <li>
          Resource sorting by rating (HOW???: Currently, fetch all data and
          sort: problem being pagination, have to extract all data instead of
          just selecting enough. solution: in database, no single source of
          truth, have both rating and votes, but they are not synced.)
        </li>
        <li>Pagination (see above) </li>
        <li>Profile</li>
        <li>Difficulty rating (5stars?)</li>
        <li>Gamification/point system</li>
        <li>Button debouncing</li>
        <li>Transitions and responsive ui</li>
        <li>Comments</li>
        <li>Solutions</li>
        <li>Responsive layout</li>
      </ul>
    </>
  );
}
