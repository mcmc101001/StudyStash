"use client";

import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react";
import ModuleList from "@/components/ModuleList";
import { startsWithNumbers } from "@/lib/utils";
import { ResourceType, ResourceTypeURL } from "@/lib/content";
import {
  usePathname,
  useSearchParams,
  useSelectedLayoutSegments,
} from "next/navigation";

interface ModuleSearcherProps {
  moduleCodes: Array<string>;
}

export default function ModuleSearcher(props: ModuleSearcherProps) {
  let selectedResourceType: ResourceType | null = null;
  let selectedModule: string | null = null;
  let segments = useSelectedLayoutSegments();
  if (segments.length > 1 && segments[1]) {
    let resourceTypeURL = segments[1] as ResourceTypeURL;
    if (resourceTypeURL === "notes") {
      selectedResourceType = "Notes";
    } else if (resourceTypeURL === "cheatsheets") {
      selectedResourceType = "Cheatsheets";
    } else if (resourceTypeURL === "past_papers") {
      selectedResourceType = "Past Papers";
    }
  }
  if (segments.length > 0 && segments[0]) {
    selectedModule = segments[0];
  }

  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");

  const modules = props.moduleCodes;
  const [filterMods, setFilterMods] = useState([""]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    let queryModified = query.toLowerCase().trimStart();
    let filteredModules: Array<string> = [];
    let unsortedFilteredModules = modules.filter((module) => {
      // if module name shares prefix with query
      if (module.toLowerCase().startsWith(queryModified)) {
        return true;
        // if module name contains query as number
      } else if (startsWithNumbers(queryModified)) {
        if (module.toLowerCase().includes(queryModified.toLowerCase())) {
          return true;
        }
      }
    });
    // sort it so the direct match for numbers (starts with instead of includes) is on top
    filteredModules = unsortedFilteredModules
      .sort((a, b) => {
        return a.indexOf(queryModified) < b.indexOf(queryModified) ? -1 : 1;
      })
      .slice(0, 13);
    if (query.trimStart().length >= 1) {
      setFilterMods(filteredModules);
    }
    if (query.trimStart().length < 1) {
      setFilterMods([""]);
    }
  }, [query, modules]);

  return (
    <div className="flex h-screen flex-col gap-y-5 overflow-y-auto border-r border-gray-700 px-6 pt-4 dark:border-gray-300">
      <Input
        type="text"
        onChange={(e) => handleQueryChange(e)}
        value={query}
        placeholder="Search modules..."
        className="my-2 rounded-sm border-none ring-0 focus:ring-0"
        autoFocus={usePathname() === "/database"}
      ></Input>
      <hr className="border bg-slate-700 dark:bg-slate-300"></hr>
      <ModuleList
        searchQuery={searchParams?.toString()}
        moduleCodes={filterMods}
        selectedModule={selectedModule}
        selectedResourceType={selectedResourceType}
      />
    </div>
  );
}
