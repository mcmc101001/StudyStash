import { Suspense } from "react";
import NavOptions, { NavOptionsProps } from "@/components/NavOptions";
import Link from "next/link";
import { Icon, Icons } from "@/components/Icons";
import UserProfilePic from "@/components/UserProfilePic";
import { Loader2 } from "lucide-react";
import DarkModeToggler from "@/components/DarkModeToggler";
import { getCurrentUser } from "@/lib/session";

export const navOptions: Array<{ name: string; href: string; icon: Icon }> = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "Cheatsheets and papers",
    href: "/database",
    icon: "Files",
  },
  {
    name: "Contribute!",
    href: "/addPDF",
    icon: "FilePlus",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "User",
  },
  {
    name: "Under development",
    href: "/pdf",
    icon: "Construction",
  },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  return (
    <div className="flex h-screen w-32 flex-col gap-y-5 overflow-hidden border-r border-gray-700 px-1 pt-4 dark:border-gray-300">
      <Link href="/" className="flex h-16 shrink-0 items-center justify-center">
        <Icons.Logo className="h-8 w-8 fill-current text-slate-800 dark:text-slate-200" />
      </Link>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {navOptions.map((option) => {
            if (!user && option.name === "Profile") return null; // Don't show profile tab if not signed in
            return (
              <NavOptions
                key={option.name}
                userId={user?.id || null}
                name={option.name}
                href={option.href}
                icon={option.icon}
              />
            );
          })}

          <DarkModeToggler />

          <Suspense
            fallback={
              <Loader2 className="h-6 w-6 animate-spin text-slate-800 dark:text-slate-200" />
            }
          >
            {/* @ts-expect-error Server Component */}
            <UserProfilePic user={user} />
          </Suspense>
        </ul>
      </nav>
    </div>
  );
}
