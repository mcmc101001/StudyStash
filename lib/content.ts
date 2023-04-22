import { Icon } from "@/components/Icons";

export type ResourceType = "Cheatsheets" | "Past Papers" | "Notes";

export type ResourceTypeURL = "cheatsheets" | "past_papers" | "notes";

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
