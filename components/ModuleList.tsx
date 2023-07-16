import Link from "next/link";
import { ResourceType, ResourceTypeURL } from "@/lib/content";

interface ModuleListProps {
  moduleCodes: Array<string>;
  selectedResourceType: ResourceType | null;
  selectedModule: string | null;
  searchQuery: string | undefined;
}

export default function ModuleList(props: ModuleListProps) {
  let linkExtension: ResourceTypeURL;
  if (props.selectedResourceType === "Cheatsheets") {
    linkExtension = "cheatsheets";
  } else if (props.selectedResourceType === "Past Papers") {
    linkExtension = "past_papers";
  } else if (props.selectedResourceType === "Notes") {
    linkExtension = "notes";
  } else {
    // cheatsheets by default
    linkExtension = "cheatsheets";
  }

  return (
    <ul
      className="flex flex-1 flex-col gap-y-3 overflow-y-auto scrollbar-thin 
          scrollbar-track-transparent scrollbar-thumb-slate-200 scrollbar-thumb-rounded-md 
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
      style={{ scrollbarGutter: "stable" }}
    >
      {props.moduleCodes.map((mod) => {
        if (!mod) return null;
        return (
          <li className="w-full" key={mod}>
            <Link
              className={
                "flex w-full text-slate-800 transition-colors dark:text-slate-200 " +
                (mod === props.selectedModule
                  ? "cursor-default "
                  : "p-2 hover:text-violet-700 dark:hover:text-violet-500 ")
              }
              href={`/database/${mod}/${linkExtension}?${props.searchQuery}`}
            >
              <span
                className={
                  mod === props.selectedModule
                    ? "cursor-default rounded-md border border-slate-800 p-2 dark:border-slate-200 "
                    : ""
                }
              >
                {mod}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
