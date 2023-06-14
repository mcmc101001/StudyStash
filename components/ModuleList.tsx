import Link from "next/link";
import { ResourceType, ResourceTypeURL } from "@/lib/content";

interface ModuleListProps {
  moduleCodes: Array<string>;
  selectedResourceType: ResourceType | null;
  selectedModule: string | null;
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
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      {props.moduleCodes.map((mod) => {
        if (!mod) return null;
        return (
          <li key={mod}>
            <Link
              className={
                "p-2 text-slate-800 transition-colors dark:text-slate-200 " +
                (mod === props.selectedModule
                  ? "cursor-default border border-slate-800 dark:border-slate-200 "
                  : "hover:text-blue-700 dark:hover:text-blue-500 ")
              }
              href={`/database/${mod}/${linkExtension}`}
            >
              {mod}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
