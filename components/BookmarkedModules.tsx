"use client";

import { StarredModules } from "@prisma/client";
import { useState } from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import StyledSelect, { Option } from "./ui/StyledSelect";
import { containsOnlyNumbers } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Separator } from "./ui/Separator";
import Link from "next/link";
import { updateStarredModuleType } from "@/pages/api/updateStarredModule";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BookmarkedModulesProps {
  userId: string;
  moduleCodeOptions: Option[];
  starredModules: StarredModules[];
}

export default function BookmarkedModules({
  userId,
  moduleCodeOptions,
  starredModules,
}: BookmarkedModulesProps) {
  let router = useRouter();

  const [modules, setModules] = useState<string[]>(
    starredModules.map((module) => module.moduleCode).sort()
  );
  const [inputValue, setInputValue] = useState<string | null>(null);

  const handleInputChange = (option: Option | null) => {
    if (option) {
      setInputValue(option.value);
    } else {
      setInputValue(null);
    }
  };

  async function addItem(moduleCode: string | null) {
    if (moduleCode === null) return;
    const sortedModules = [...modules, moduleCode].sort();
    setModules(sortedModules);
    setInputValue(null);
    let body: updateStarredModuleType = {
      moduleCode: moduleCode,
      userId: userId,
      value: true,
    };
    try {
      const res = await axios.post("/api/updateStarredModule", body);
    } catch (error) {
      toast.error("Error updating bookmarked module, please try again later.");
    }
    router.refresh();
  }

  async function removeItem(moduleCode: string) {
    setModules(modules.filter((module) => module !== moduleCode));
    let body: updateStarredModuleType = {
      moduleCode: moduleCode,
      userId: userId,
      value: false,
    };
    try {
      const res = await axios.post("/api/updateStarredModule", body);
    } catch (error) {
      toast.error("Error updating bookmarked module, please try again later.");
    }
    router.refresh();
  }

  return (
    <div className="h-full w-96 border py-4">
      <h1 className="px-4 text-2xl font-medium">Bookmarked Modules</h1>
      <div className="mt-3 flex items-center justify-between gap-x-4 px-4">
        <StyledSelect
          value={inputValue ? { label: inputValue, value: inputValue } : null}
          label="Module Code"
          labelExists={false}
          inputLike={true}
          placeholderText="Add modules"
          onChange={handleInputChange}
          options={moduleCodeOptions}
          noOptionsMessage={({ inputValue }) =>
            inputValue.trimStart().length < 2
              ? "Type to search..."
              : "No options"
          }
          filterOption={(
            option: { value: string; label: string },
            query: string
          ) => {
            const trimmed_query = query.trimStart();
            if (trimmed_query.length < 2) {
              return false;
            }
            // If already in list
            if (modules.includes(option.value)) {
              return false;
            }
            // If matches prefix
            if (
              option.value.toLowerCase().startsWith(trimmed_query.toLowerCase())
            ) {
              return true;
            } else if (containsOnlyNumbers(trimmed_query)) {
              // If matches number
              if (option.value.includes(trimmed_query)) {
                return true;
              }
            }
            return false;
          }}
        />
        <button
          className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 p-2 
            transition-colors hover:border-slate-400 dark:border-slate-500 dark:hover:border-slate-400"
          onClick={() => addItem(inputValue)}
          aria-label="Add bookmarked module"
        >
          <Plus className="text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300" />
        </button>
      </div>
      <Separator className="mx-auto my-4 h-[2px] w-[92%] bg-slate-200" />
      <div
        className="h-72 overflow-y-auto pl-4 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200
          hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
        style={{ scrollbarGutter: "stable" }}
      >
        <ul className="relative">
          <AnimatePresence initial={false}>
            {modules.map((module) => (
              <BookmarkModule
                key={module}
                moduleCode={module}
                removeItem={removeItem}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function BookmarkModule({
  moduleCode,
  removeItem,
}: {
  moduleCode: string;
  removeItem: (moduleCode: string) => void;
}) {
  let isPresent = useIsPresent();

  return (
    <motion.li
      layout
      className="flex w-full items-center justify-between border-b py-2"
      initial={{
        opacity: 0.2,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      style={{
        position: isPresent ? "relative" : "absolute",
      }}
      transition={{
        duration: 0.8,
        type: "spring",
      }}
    >
      <span>
        <Link
          className="text-slate-800 transition-colors hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-400"
          href={`/database/${moduleCode}/cheatsheets`}
        >
          {moduleCode}
        </Link>
      </span>
      <button
        aria-label={`Delete ${moduleCode}`}
        className="group flex h-10 w-10 items-center justify-center rounded border-2 border-slate-300 p-2 transition-colors 
                    hover:border-slate-400 dark:border-slate-500 dark:hover:border-slate-400"
        onClick={() => removeItem(moduleCode)}
      >
        <X className="text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300" />
      </button>
    </motion.li>
  );
}
