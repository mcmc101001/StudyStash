"use client";

import { ResourceStatus } from "@prisma/client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle,
  ListChecks,
  MoreHorizontal,
} from "lucide-react";
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
      className="group z-10 w-max cursor-pointer rounded-full bg-slate-400 px-2 py-1 dark:bg-slate-600"
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
            ? "text-green-500"
            : "text-gray-200 hover:text-green-300 dark:text-gray-400 dark:hover:text-green-300")
        }
      />
    );
  } else if (status === "Todo") {
    icon = (
      <ListChecks
        onClick={(e) => handleClick(e, status)}
        className={
          "h-5 w-5 " +
          (selected
            ? "text-yellow-500"
            : "text-gray-200 hover:text-yellow-300 dark:text-gray-400 dark:hover:text-yellow-300")
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
            ? "text-blue-500"
            : "text-gray-200 hover:text-blue-300 dark:text-gray-400 dark:hover:text-blue-300")
        }
      />
    );
  } else {
    icon = (
      <MoreHorizontal
        onClick={(e) => handleClick(e, status)}
        className="h-5 w-5 text-gray-200 dark:text-gray-400"
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
