"use client";

import { Input } from "@/components/ui/Input";
import { FC, useEffect, useState } from "react";
import ModuleList from "@/components/ModuleList";
import { containsOnlyNumbers } from "@/lib/utils";
import { ResourceType, ResourceTypeURL } from "@/lib/content";
import { useSelectedLayoutSegments } from "next/navigation";

interface ModuleSearcherProps {
  module_codes: Array<string>;
}

const ModuleSearcher: FC<ModuleSearcherProps> = (props) => {
  let selectedResourceType: ResourceType | null = null;
  let selectedModule: string | null = null;
  let segments = useSelectedLayoutSegments();
  if (segments.length > 1 && segments[1]) {
    let resourceTypeURL = segments[1] as ResourceTypeURL;
    if (resourceTypeURL === "notes") {
      selectedResourceType = "Notes";
    }
    else if (resourceTypeURL === "cheatsheets") {
      selectedResourceType = "Cheatsheets";
    }
    else if (resourceTypeURL === "past_papers") {
      selectedResourceType = "Past Papers";
    }
  }
  if (segments.length > 0 && segments[0]) {
    selectedModule = segments[0];
  }

  const [query, setQuery] = useState("");

  const modules = props.module_codes;
  const [filterMods, setFilterMods] = useState([""]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange={(e) => handleQueryChange(e)}
        value={query}
        placeholder="Search modules..."
        className="my-2 border-none rounded-sm ring-0 focus:ring-0 dark:enabled:bg-slate-800 enabled:bg-slate-200"
      ></Input>
      <hr className="bg-slate-700 dark:bg-slate-300 border"></hr>
      <ModuleList module_codes={filterMods} selectedModule={selectedModule} selectedResourceType={selectedResourceType} />
    </div>
  );
};

export default ModuleSearcher;
