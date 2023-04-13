import { FC } from "react";
import Link from "next/link";

interface ModuleListProps {
    module_codes: Array<string>;
}

const ModuleList:FC<ModuleListProps> = (props) => {
    return (
        <ul role="list" className='flex flex-1 flex-col gap-y-7'>
            {props.module_codes.map((mod) => {
                    return (
                        <li key={mod}>
                            <Link className="text-slate-800 dark:text-slate-200" href={`/database/${mod}`}>{mod}</Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default ModuleList;