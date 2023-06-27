import {
  LucideProps,
  Files,
  FileUp,
  FilePlus,
  FileSignature,
  LayoutDashboard,
  Calculator,
  User,
  CheckCircle,
  Calendar,
  Bookmark,
  TowerControl,
  MessageSquare,
  MessageSquarePlus,
  MessageCircle,
} from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      className="fill-current text-slate-800 dark:text-slate-200"
      width="64px"
      height="64px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path fillRule="evenodd" d="M256,48,496,464H16Z"></path>
      </g>
    </svg>
  ),
  Files,
  FilePlus,
  Calculator,
  LayoutDashboard,
  FileSignature,
  User,
  FileUp,
  CheckCircle,
  Calendar,
  Bookmark,
  TowerControl,
  MessageSquare,
  MessageSquarePlus,
  MessageCircle,
};

export type Icon = keyof typeof Icons;
