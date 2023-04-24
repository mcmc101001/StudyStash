import { FC } from "react";
import Link from "next/link";
import { ResourceType, ResourceTypeURL } from "@/lib/content";

interface ModuleListProps {
  module_codes: Array<string>;
  selectedResourceType: ResourceType | null;
  selectedModule: string | null;
}

const ModuleList: FC<ModuleListProps> = (props) => {
  let link_extension: ResourceTypeURL;
  if (props.selectedResourceType === "Cheatsheets") {
    link_extension = "cheatsheets";
  } else if (props.selectedResourceType === "Past Papers") {
    link_extension = "past_papers";
  } else if (props.selectedResourceType === "Notes") {
    link_extension = "notes";
  } else {
    // cheatsheets by default
    link_extension = "cheatsheets";
  }

  return (
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      {props.module_codes.map((mod) => {
        return (
          <li key={mod}>
            <Link
              className={
                `p-2 text-slate-800 dark:text-slate-200 ` +
                (mod === props.selectedModule
                  ? `border border-slate-800 dark:border-slate-200`
                  : "")
              }
              href={`/database/${mod}/${link_extension}`}
            >
              {mod}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ModuleList;