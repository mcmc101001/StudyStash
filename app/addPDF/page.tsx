/* NOTE: 
* add tooltip on top? maybe like 
* large files will take a while to upload, 
* if cannot see module code means ... 
*/


import { Icon, Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import { authOptions } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export interface addPDFOptionsProps {
  name: string
  href: string
  icon: Icon
}

const addPDFOptions: addPDFOptionsProps[] = [
  {
      name: 'Cheatsheets',
      href: '/addPDF/cheatsheet',
      icon: 'LayoutDashboard'
  },
  {
      name: 'Past Papers',
      href: '/addPDF/past_papers',
      icon: 'Files'
  },
  {
      name: 'Notes',
      href: '/addPDF/notes',
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
      {addPDFOptions.map((option) => {
          const Icon = Icons[option.icon]
          return (
            <Link href={option.href} className='w-full group'>
              <Button key={option.name} size="huge" variant="ghost" className='p-0 w-full flex flex-row gap-4 items-center justify-center'>
                <Icon className="group-hover:h-12 group-hover:w-12 h-10 w-10 transition-all duration-300"/>
                <span className='text-2xl group-hover:text-3xl transition-all duration-300'>{option.name}</ span>
              </Button>
            </Link>
          )
      })}
    </main>
  )
}