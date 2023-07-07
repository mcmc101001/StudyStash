"use client";

import { StarredModules } from "@prisma/client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";
import { startsWithNumbers, trimUntilNumber } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
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

const variants = {
  rotated: { rotate: 135 },
  normal: { rotate: 0 },
};

export default function BookmarkedModules({
  userId,
  moduleCodeOptions,
  starredModules,
}: BookmarkedModulesProps) {
  let router = useRouter();

  const [inputIsOpen, setInputIsOpen] = useState(false);

  const [modules, setModules] = useState<string[]>(
    starredModules.map((module) => module.moduleCode).sort()
  );

  const [remainingOptions, setRemainingOptions] =
    useState<Option[]>(moduleCodeOptions);

  useEffect(() => {
    setRemainingOptions(
      moduleCodeOptions.filter((option) => !modules.includes(option.value))
    );
  }, [modules, moduleCodeOptions]);

  async function addItem(option: Option | null) {
    if (option === null) return;
    const moduleCode = option.value;
    const sortedModules = [...modules, moduleCode].sort();
    setModules(sortedModules);
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
    <div className="h-full w-full overflow-hidden rounded-xl py-4">
      <div className="flex items-center justify-between gap-x-4 pl-4 pr-6">
        <h1 className="text-xl font-medium">Bookmarked Modules</h1>
        <motion.button
          className={
            "group flex h-9 w-9 items-center justify-center rounded-full border-2 p-2 transition-colors " +
            (inputIsOpen
              ? "border-green-500 hover:border-green-600 dark:border-green-300 dark:hover:border-green-400"
              : "border-slate-400 hover:border-slate-500 dark:border-slate-500 dark:hover:border-slate-400")
          }
          onClick={() => setInputIsOpen(!inputIsOpen)}
          aria-label="Add bookmarked module"
          variants={variants}
          animate={inputIsOpen ? "rotated" : "normal"}
          transition={{ duration: 0.3 }}
        >
          <Plus
            className={
              inputIsOpen
                ? "text-green-600 group-hover:text-green-700 dark:text-green-300 dark:group-hover:text-green-400"
                : "text-slate-400 transition-colors group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
            }
          />
        </motion.button>
      </div>
      <div className="pr-2">
        <div
          className="h-[80vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 scrollbar-thumb-rounded-md
            hover:scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="relative flex w-full items-center justify-between gap-x-4 px-4">
            <AnimatePresence initial={false}>
              {inputIsOpen && (
                <ModuleCodeSearcher
                  moduleCodeOptions={remainingOptions}
                  addItem={addItem}
                />
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence initial={false}>
            <motion.div
              transition={{
                duration: 0.8,
                type: "spring",
              }}
              layout
            >
              <Separator className="mb-4 ml-4 mt-4 h-[2px] w-[93%] bg-slate-300 dark:bg-slate-700" />
            </motion.div>
          </AnimatePresence>
          <div className="pl-4 pr-2">
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
      className="flex w-full items-center border-b border-slate-300 py-2 first:pt-0 dark:border-slate-700"
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
      <Link
        className="w-full text-slate-800 transition-colors hover:text-violet-700 dark:text-slate-200 dark:hover:text-violet-500"
        href={`/database/${moduleCode}/cheatsheets`}
      >
        {moduleCode}
      </Link>
      <button
        aria-label={`Delete ${moduleCode}`}
        className="group flex h-10 w-10 items-center justify-center rounded border-2 border-slate-300 p-2 transition-colors 
                    hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
        onClick={() => removeItem(moduleCode)}
      >
        <X className="text-slate-400 transition-colors group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-500" />
      </button>
    </motion.li>
  );
}

function ModuleCodeSearcher({
  moduleCodeOptions,
  addItem,
}: {
  moduleCodeOptions: Option[];
  addItem: (option: Option | null) => void;
}) {
  let isPresent = useIsPresent();

  return (
    <motion.div
      key="searchBar"
      layout
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
        width: isPresent ? "100%" : "calc(100% - 2rem)", // 2rem being padding of parent contianer
      }}
      transition={{
        duration: 0.8,
        type: "spring",
      }}
      className="mt-2 w-full"
    >
      <StyledSelect
        label="Module Code"
        labelExists={false}
        inputLike={true}
        placeholderText="Search module code"
        onChange={addItem}
        options={moduleCodeOptions}
        autofocus={true}
        noOptionsMessage={({ inputValue }) =>
          inputValue.trimStart().length < 1 ? "Type to search..." : "No options"
        }
        filterOption={(
          option: { value: string; label: string },
          query: string
        ) => {
          const trimmed_query = query.trimStart();
          if (trimmed_query.length < 1) {
            return false;
          }
          // If matches prefix
          if (
            option.value.toLowerCase().startsWith(trimmed_query.toLowerCase())
          ) {
            return true;
          } else if (startsWithNumbers(trimmed_query)) {
            // If matches number
            const trimmedOption = trimUntilNumber(option.value.toLowerCase());
            if (trimmedOption.startsWith(trimmed_query.toLowerCase())) {
              return true;
            }
          }
          return false;
        }}
      />
    </motion.div>
  );
}
