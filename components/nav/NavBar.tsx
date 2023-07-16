import NavOptions from "@/components/nav/NavOptions";
import Link from "next/link";
import { Icon, Icons } from "@/components/Icons";
import UserProfilePic from "@/components/user/UserProfilePic";
import dynamic from "next/dynamic";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const DarkModeTogglerNoSSR = dynamic(
  () => import("@/components/nav/DarkModeToggler"),
  { ssr: false }
);

export const navOptions: Array<{
  name: string;
  href: string;
  linkExtension?: string;
  icon: Icon;
}> = [
  {
    name: "Dashboard",
    href: "/dashboard",
    linkExtension: "?filterStatus=Saved&filterCategory=cheatsheets",
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
    linkExtension: "?section=resource",
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
    <div className="flex h-[100dvh] w-24 flex-col gap-y-5 overflow-hidden border-r border-gray-700 bg-slate-100 px-1 pt-4 transition-colors duration-500 dark:border-gray-300 dark:bg-slate-900">
      <Link
        href="/"
        className="flex h-16 shrink-0 items-center justify-center fill-violet-500 dark:fill-violet-500"
        aria-label="Logo"
      >
        <Icons.Logo className="h-8 w-8 fill-current" />
      </Link>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
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
                linkExtension={option.linkExtension}
              />
            );
          })}
          <li className="mb-2 mt-auto">
            <DarkModeTogglerNoSSR />
            <div className="mt-8">
              {/* @ts-expect-error Server Component */}
              <UserProfilePic />
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
