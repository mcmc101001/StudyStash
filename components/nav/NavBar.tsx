import NavOptions from "@/components/nav/NavOptions";
import Link from "next/link";
import { Icon, Icons } from "@/components/Icons";
import UserProfilePic from "@/components/user/UserProfilePic";
import dynamic from "next/dynamic";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const DarkModeTogglerNoSSR = dynamic(
  () => import("@/components/nav/DarkModeToggler"),
  { ssr: false }
);

export const navOptions: Array<{ name: string; href: string; icon: Icon }> = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "Database",
    href: "/database",
    icon: "Files",
  },
  {
    name: "Contribute!",
    href: "/addPDF",
    icon: "FileUp",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "User",
  },
  {
    name: "Admin",
    href: "/admin",
    icon: "TowerControl",
  },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  let verified = false;
  if (user) {
    if (
      await prisma.user
        .findUnique({
          where: {
            id: user?.id,
          },
        })
        ?.then((user) => user?.verified)
    ) {
      verified = true;
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col gap-y-5 overflow-hidden border-r border-gray-700 bg-slate-100 pt-4 transition-colors duration-500 dark:border-gray-300 dark:bg-slate-900">
      <Link
        href="/"
        className="flex h-16 shrink-0 items-center justify-center"
        aria-label="Logo"
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icons.Logo className="h-8 w-8 fill-current text-slate-800 dark:text-slate-200" />
            </TooltipTrigger>
            <TooltipContent side="right">Landing page</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {navOptions.map((option) => {
            if (!user && option.name === "Profile") return null; // Don't show profile tab if not signed in
            if (!verified && option.name === "Admin") return null; // Don't show admin tab if not verified
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
          <div className="mb-2 mt-auto">
            <DarkModeTogglerNoSSR />
            {/* @ts-expect-error Server Component */}
            <UserProfilePic user={user} />
          </div>
        </ul>
      </nav>
    </div>
  );
}
