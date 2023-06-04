"use client";

import { ResourceStatus } from "@prisma/client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, CheckCircle, ListChecks } from "lucide-react";
import { BsQuestion } from "react-icons/bs";

export default function ResourceStatusComponentInLine({
  resourceStatus,
}: {
  resourceStatus: ResourceStatus | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ResourceStatus | null>(resourceStatus);

  const handleClick = (
    e: React.MouseEvent,
    clickedStatus: ResourceStatus | null
  ) => {
    e.stopPropagation();
    if (!isOpen) return;
    if (status === clickedStatus) {
      setStatus(null);
    } else {
      setStatus(clickedStatus);
    }
  };

  return (
    <motion.div
      // animate={status ? status : "empty"}
      // variants={{
      //   empty: {

      //   }
      // }}
      className="group w-max cursor-pointer rounded-full bg-slate-400 px-2 py-1 dark:bg-slate-600"
      onHoverEnd={() => setIsOpen(false)}
      onClick={(e) => e.stopPropagation()}
      onClickCapture={() => setIsOpen(true)}
    >
      <AnimatePresence>
        {!isOpen ? (
          <StatusIcon
            selected={true}
            handleClick={handleClick}
            status={status}
          />
        ) : (
          <div className="flex justify-between gap-x-2">
            <StatusIcon
              selected={status === "Completed"}
              handleClick={handleClick}
              status="Completed"
            />
            <StatusIcon
              selected={status === "Saved"}
              handleClick={handleClick}
              status="Saved"
            />
            <StatusIcon
              selected={status === "Todo"}
              handleClick={handleClick}
              status="Todo"
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatusIcon({
  selected,
  status,
  handleClick,
}: {
  selected: boolean;
  status: ResourceStatus | null;
  handleClick: (e: React.MouseEvent, status: ResourceStatus | null) => void;
}) {
  if (status === "Completed") {
    return (
      <CheckCircle
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected ? "text-green-500" : "text-gray-200 dark:text-gray-400")
        }
      />
    );
  } else if (status === "Todo") {
    return (
      <ListChecks
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected ? "text-yellow-500" : "text-gray-200 dark:text-gray-400")
        }
      />
    );
  } else if (status === "Saved") {
    return (
      <Bookmark
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected ? "text-blue-500" : "text-gray-200 dark:text-gray-400")
        }
      />
    );
  } else {
    return (
      <BsQuestion
        onClick={(e) => handleClick(e, status)}
        className="h-5 w-5 text-gray-200 dark:text-gray-400"
      />
    );
  }
}
