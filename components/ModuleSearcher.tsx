"use client";

import { Input } from "@/components/ui/Input";
import { FC, useEffect, useState } from "react";
import ModuleList from "./ModuleList";
import { containsOnlyNumbers } from "@/lib/utils";

interface ModuleSearcherProps {
  module_codes: Array<string>;
}

const ModuleSearcher: FC<ModuleSearcherProps> = (props) => {
  const [query, setQuery] = useState("");

  const modules = props.module_codes;
  const [filterMods, setFilterMods] = useState([""]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    let queryModified = query.toLowerCase().trimStart();
    let filteredModules: Array<string> = [];
    for (const mod of modules) {
      // if module name shares prefix with query
      if (mod.toLowerCase().startsWith(queryModified)) {
        filteredModules.push(mod);
      } else if (containsOnlyNumbers(queryModified)) {
        // if module name contains query as number
        if (mod.includes(queryModified)) {
          filteredModules.push(mod);
        }
      }
      if (filteredModules.length === 10) {
        break;
      }
    }
    if (query.trimStart().length > 1) {
      setFilterMods(filteredModules);
    }
    if (query.trimStart().length < 2) {
      setFilterMods([""]);
    }
  }, [query]);

  return (
    <div className="flex h-screen flex-col gap-y-5 overflow-y-auto border-r dark:border-gray-300 border-gray-700 px-6 pt-4">
      <Input
        type="text"
        onChange={(e) => handleChange(e)}
        value={query}
        placeholder="Search modules..."
        className="my-2 border-none rounded-sm ring-0 focus:ring-0 dark:enabled:bg-slate-800 enabled:bg-slate-200"
      ></Input>
      <hr className="bg-slate-700 dark:bg-slate-300 border"></hr>
      <ModuleList module_codes={filterMods} />
    </div>
  );
};

export default ModuleSearcher;
