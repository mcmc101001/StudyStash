/* NOTE:
 * add tooltip on top? maybe like
 * large files will take a while to upload,
 * if cannot see module code means ...
 */

import { ResourceOptions } from "@/lib/content";
import { Icons } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function addPDFPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  return (
    <main className="flex h-screen flex-1 flex-row items-center justify-center gap-20 p-20">
      {ResourceOptions.map((option) => {
        const Icon = Icons[option.icon];
        return (
          <Link
            key={option.name}
            href={`/addPDF/${option.href}`}
            className="group w-full"
          >
            <Button
              size="huge"
              variant="ghost"
              className="flex w-full flex-row items-center justify-center gap-4 p-0"
            >
              <Icon className="h-10 w-10 transition-all duration-300 group-hover:h-12 group-hover:w-12" />
              <span className="text-2xl transition-all duration-300 group-hover:text-3xl">
                {option.name}
              </span>
            </Button>
          </Link>
        );
      })}
    </main>
  );
}
