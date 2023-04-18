import { FC } from "react";
import Link from "next/link";
import { ResourceType } from "./ContributeForm";

export type ResourceTypeURL = "cheatsheet" | "past_papers" | "notes";

interface ModuleListProps {
    module_codes: Array<string>;
    selectedResourceType: ResourceType | null;
}

const ModuleList:FC<ModuleListProps> = (props) => {
    let link_extension:ResourceTypeURL;
    if (props.selectedResourceType === "Cheatsheet") {
        link_extension = "cheatsheet";
    }
    else if (props.selectedResourceType === "Past Papers") {
        link_extension = "past_papers";
    }
    else if (props.selectedResourceType === "Notes") {
        link_extension = "notes";
    }
    else {
        link_extension = "cheatsheet";
    }

    return (
        <ul role="list" className='flex flex-1 flex-col gap-y-7'>
            {props.module_codes.map((mod) => {
                    return (
                        <li key={mod}>
                            <Link className="text-slate-800 dark:text-slate-200" href={`/database/${mod}/${link_extension}`}>{mod}</Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default ModuleList;