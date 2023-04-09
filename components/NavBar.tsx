import { FC, Suspense } from "react";
import { NavOptionsProps } from "./NavOptions";
import Link from "next/link";
import { Icons } from "./Icons";
import NavOptions from "./NavOptions";
import UserProfilePic from "./UserProfilePic";
import { Loader2 } from "lucide-react";

const navOptions: NavOptionsProps[] = [
    {
        name: 'Cheatsheets and papers',
        href: '/database',
        icon: 'Files'
    },
    {
        name: 'PDF',
        href: '/pdf',
        icon: 'FilePlus'
    }
]
 
const NavBar: FC = () => {
    return (
        <div className='flex h-full flex-col gap-y-5 overflow-y-auto border-r border-gray-300 px-6 pt-4'>
            <Link href='/' className='flex h-16 shrink-0 items-center'>
                <Icons.Logo className='h-8 w-8 text-slate-200' />
            </Link>

            <nav className='flex flex-1 flex-col'>
                <ul role="list" className='flex flex-1 flex-col gap-y-7'>
                    {navOptions.map((option) => {
                        return (
                            <NavOptions key={option.name} name={option.name} href={option.href} icon={option.icon} />
                        )
                    })}

                    <Suspense fallback={<Loader2 className='text-slate-200 h-6 w-6 animate-spin' />}>
                        {/* @ts-expect-error Server Component */}
                        <UserProfilePic />
                    </Suspense>
                </ul>
            </nav>
        </div>
    );
} 



export default NavBar;