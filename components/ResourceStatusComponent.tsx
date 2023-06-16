"use client";

import { ResourceStatus } from "@prisma/client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Calendar, CheckCircle, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { updateStatusType } from "@/pages/api/updateStatus";
import { ResourceSolutionType } from "@/lib/content";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { PrimitiveAtom, useAtom } from "jotai";

export default function ResourceStatusComponent({
  currentUserId,
  category,
  resourceId,
  resourceStatusAtom,
}: {
  currentUserId: string;
  category: ResourceSolutionType;
  resourceId: string;
  resourceStatusAtom: PrimitiveAtom<ResourceStatus | null>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  let [status, setStatus] = useAtom(resourceStatusAtom);

  let router = useRouter();

  const handleClick = async (
    e: React.MouseEvent,
    clickedStatus: ResourceStatus | null
  ) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    if (status === clickedStatus) {
      setStatus(null);
      let body: updateStatusType = {
        category: category,
        userId: currentUserId,
        resourceId: resourceId,
        status: null,
      };

      try {
        let req = await axios.post("/api/updateStatus", body);
      } catch {
        toast.error("Something went wrong, please try again.");
      }
    } else {
      setStatus(clickedStatus);
      let body: updateStatusType = {
        category: category,
        userId: currentUserId,
        resourceId: resourceId,
        status: clickedStatus,
      };

      try {
        let req = await axios.post("/api/updateStatus", body);
      } catch {
        toast.error("Something went wrong, please try again.");
      }
    }
    router.refresh();
  };

  return (
    <motion.div
      className="group z-10 w-max cursor-pointer rounded-full bg-slate-300 px-2 py-1 dark:bg-slate-600"
      onHoverEnd={() => setIsOpen(false)}
      onClick={(e) => e.stopPropagation()}
      layout="size"
      transition={{ duration: 0.1 }}
    >
      {!isOpen ? (
        <StatusIcon selected={true} handleClick={handleClick} status={status} />
      ) : (
        <div className="flex justify-between gap-x-2">
          <StatusIcon
            selected={status === "Todo"}
            handleClick={handleClick}
            status="Todo"
          />
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
        </div>
      )}
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
  let icon: JSX.Element;
  if (status === "Completed") {
    icon = (
      <CheckCircle
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected
            ? "text-green-600 dark:text-green-500"
            : "text-gray-400 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500")
        }
      />
    );
  } else if (status === "Todo") {
    icon = (
      <Calendar
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected
            ? "text-amber-600 dark:text-amber-300"
            : "text-gray-400 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-300")
        }
      />
    );
  } else if (status === "Saved") {
    icon = (
      <Bookmark
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected
            ? "text-blue-500 dark:text-blue-500"
            : "text-gray-400 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500")
        }
      />
    );
  } else {
    icon = (
      <MoreHorizontal
        onClick={(e) => handleClick(e, status)}
        className="h-5 w-5 text-gray-400 dark:text-gray-400"
      />
    );
  }
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">{status ? status : "Add status"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
