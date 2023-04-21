/* NOTE: 
* add tooltip on top? maybe like 
* large files will take a while to upload, 
* if cannot see module code means ... 
*/


import { ResourceType } from '@/components/ContributeForm'
import { Icon, Icons } from '@/components/Icons'
import { ResourceTypeURL } from '@/components/ModuleList'
import { Button } from '@/components/ui/Button'
import { authOptions } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export interface ResourceOptionsProps {
  name: ResourceType
  href: ResourceTypeURL
  icon: Icon
}

export const ResourceOptions: ResourceOptionsProps[] = [
  {
      name: 'Cheatsheets',
      href: 'cheatsheets',
      icon: 'LayoutDashboard'
  },
  {
      name: 'Past Papers',
      href: 'past_papers',
      icon: 'Files'
  },
  {
      name: 'Notes',
      href: 'notes',
      icon: 'FileSignature'
  },
]

export default async function addPDFPage() {

  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  return (
    <main className="p-20 h-screen flex flex-1 flex-row gap-20 items-center justify-center">
      {ResourceOptions.map((option) => {
          const Icon = Icons[option.icon]
          return (
            <Link key={option.name} href={`/addPDF/${option.href}`} className='w-full group'>
              <Button size="huge" variant="ghost" className='p-0 w-full flex flex-row gap-4 items-center justify-center'>
                <Icon className="group-hover:h-12 group-hover:w-12 h-10 w-10 transition-all duration-300"/>
                <span className='text-2xl group-hover:text-3xl transition-all duration-300'>{option.name}</ span>
              </Button>
            </Link>
          )
      })}
    </main>
  )
}