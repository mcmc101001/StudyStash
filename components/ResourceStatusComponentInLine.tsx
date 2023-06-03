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

  const handleClick = (clickedStatus: ResourceStatus | null) => {
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
      className="group w-max cursor-pointer rounded-full bg-slate-300 p-2 hover:bg-slate-300"
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => setIsOpen(false)}
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
  handleClick: (status: ResourceStatus | null) => void;
}) {
  if (status === "Completed") {
    return (
      <CheckCircle
        onClick={() => handleClick(status)}
        className={"h-6 w-6 " + (selected ? "text-green-500" : "text-gray-500")}
      />
    );
  } else if (status === "Todo") {
    return (
      <ListChecks
        onClick={() => handleClick(status)}
        className={
          "h-6 w-6 " + (selected ? "text-yellow-500" : "text-gray-500")
        }
      />
    );
  } else if (status === "Saved") {
    return (
      <Bookmark
        onClick={() => handleClick(status)}
        className={"h-6 w-6 " + (selected ? "text-blue-500" : "text-gray-500")}
      />
    );
  } else {
    return (
      <BsQuestion
        onClick={() => handleClick(status)}
        className="h-6 w-6 text-gray-500"
      />
    );
  }
}
