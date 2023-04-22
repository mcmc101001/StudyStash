import {
  LucideProps,
  Files,
  FilePlus,
  FileSignature,
  LayoutDashboard,
  Construction,
} from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      className="fill-current text-slate-800 dark:text-slate-200"
      // fill="#eeeeee"
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
  LayoutDashboard,
  Construction,
  FileSignature,
};

export type Icon = keyof typeof Icons;
