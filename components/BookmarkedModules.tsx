"use client";

import { StarredModules } from "@prisma/client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StyledSelect, { Option } from "./ui/StyledSelect";
import { containsOnlyNumbers } from "@/lib/utils";
import { Plus, X, XSquare } from "lucide-react";
import { Separator } from "./ui/Separator";
import Link from "next/link";

interface BookmarkedModulesProps {
  moduleCodeOptions: Option[];
  starredModules: StarredModules[];
}

export default function BookmarkedModules({
  moduleCodeOptions,
  starredModules,
}: BookmarkedModulesProps) {
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

  const inputRef = useRef<HTMLSelectElement>(null);

  function addItem(moduleCode: string | null) {
    if (moduleCode === null) return;
    const sortedModules = [...modules, moduleCode].sort();
    setModules(sortedModules);
    setInputValue(null);
  }

  function removeItem(moduleCode: string) {
    setModules(modules.filter((module) => module !== moduleCode));
  }

  return (
    <div className="h-full w-96 border py-4">
      <h1 className="px-4 text-2xl font-medium">Bookmarked Modules</h1>
      <div className="mt-3 flex items-center justify-between gap-x-4 px-4">
        <StyledSelect
          value={inputValue ? { label: inputValue, value: inputValue } : null}
          ref={inputRef}
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
        <motion.ul layout>
          <AnimatePresence initial={false}>
            {modules.map((module) => (
              <motion.li
                layout
                className="flex items-center justify-between border-b py-2"
                key={module}
                initial={{
                  opacity: 0.2,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <span>
                  <Link
                    className="text-slate-800 transition-colors hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-400"
                    href={`/database/${module}/cheatsheets`}
                  >
                    {module}
                  </Link>
                </span>
                <button
                  className="group flex h-10 w-10 items-center justify-center rounded border-2 border-slate-300 p-2 transition-colors 
                    hover:border-slate-400 dark:border-slate-500 dark:hover:border-slate-400"
                  onClick={() => removeItem(module)}
                >
                  <X className="text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}
