import { Icon, Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

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
]

export default async function addPDFPage() {
  return (
    <main className="p-20 h-screen flex flex-1 flex-row gap-20 items-center justify-center opacity-90">
      {addPDFOptions.map((option) => {
          const Icon = Icons[option.icon]
          return (
            <Button key={option.name} size="huge" variant="ghost" className='w-full text-2xl hover:text-3xl transition-all duration-300 group'>
              <Link href={option.href} className='flex flex-row gap-4 items-center justify-center'>
                <Icon className="group-hover:h-12 group-hover:w-12 h-10 w-10 transition-all duration-300"/>
                <span>{option.name}</ span>
              </Link>
            </Button>
          )
      })}
    </main>
  )
}