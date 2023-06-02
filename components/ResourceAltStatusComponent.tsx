"use client";

import { useState } from "react";
import Button from "./ui/Button";
import { ResourceSolutionType } from "@/lib/content";

interface ResourceAltStatusComponentProps {
  category: ResourceSolutionType;
  solnIncluded: Boolean;
}

export default function ResourceAltStatusComponent({
  category,
  solnIncluded,
}: ResourceAltStatusComponentProps) {
  const [saveState, setSaveState] = useState(false);
  const [todoState, setTodoState] = useState(false);
  const [completedState, setCompletedState] = useState(false);

  const handleSaveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSaveState(!saveState);
  };

  const handleTodoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setTodoState(!todoState);
    setCompletedState(false);
  };

  const handleCompletedClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setCompletedState(!completedState);
    setTodoState(false);
  };

  const greyOutStyle = "border-slate-400 text-slate-400";

  return (
    <div className="flex flex-row gap-1 overflow-y-auto scrollbar-none [&>*]:rounded-full [&>*]:border [&>*]:px-2 [&>*]:text-sm">
      {category === "Past Papers" && (
        <span
          onClick={(e) => e.stopPropagation()} // Plan to include tooltip here
          className={
            solnIncluded ? " border-green-300 text-green-300" : greyOutStyle
          }
        >
          Soln
        </span>
      )}
      <span
        onClick={handleSaveClick}
        className={saveState ? "border-blue-500 text-blue-500" : greyOutStyle}
      >
        Save
      </span>
      <span
        onClick={handleTodoClick}
        className={
          todoState ? "border-yellow-500 text-yellow-500" : greyOutStyle
        }
      >
        Todo
      </span>
      <span
        onClick={handleCompletedClick}
        className={
          completedState ? "border-green-500 text-green-500" : greyOutStyle
        }
      >
        Done
      </span>
    </div>
  );
}
