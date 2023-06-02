"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/ContextMenu";
import { ResourceType } from "@/lib/content";
import { updateStatusType } from "@/pages/api/updateStatus";
import { ResourceStatus } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ResourceContextMenuProps {
  children: React.ReactNode;
  category: ResourceType;
  currentUserId: string | null;
  resourceId: string;
  resourceUserId: string;
  shareURL: string;
  className?: string;
  resourceStatus: ResourceStatus | null;
}

export default function ResourceContextMenu({
  children,
  category,
  currentUserId,
  resourceId,
  resourceUserId,
  shareURL,
  className,
  resourceStatus,
}: ResourceContextMenuProps) {
  const [bookmarkStatus, setBookmarkStatus] = useState(
    resourceStatus === "Saved" ? true : false
  );
  const [todoStatus, setTodoStatus] = useState(
    resourceStatus === "Todo" ? true : false
  );
  const [completedStatus, setCompletedStatus] = useState(
    resourceStatus === "Completed" ? true : false
  );

  const setStatus = (status: ResourceStatus | null) => {
    if (status === ResourceStatus.Saved) {
      setBookmarkStatus(!bookmarkStatus);
      setTodoStatus(false);
      setCompletedStatus(false);
    } else if (status === ResourceStatus.Todo) {
      setBookmarkStatus(false);
      setTodoStatus(!todoStatus);
      setCompletedStatus(false);
    } else if (status === ResourceStatus.Completed) {
      setBookmarkStatus(false);
      setTodoStatus(false);
      setCompletedStatus(!completedStatus);
    }
  };

  const handleStatusChange = async (
    e: React.MouseEvent,
    status: ResourceStatus
  ) => {
    e.preventDefault();

    if (!currentUserId) {
      toast.error("Login required.");
      return;
    }

    let body: updateStatusType = {
      category: category,
      userId: currentUserId,
      resourceId: resourceId,
      status: status,
    };

    try {
      let req = await axios.post("/api/updateStatus", body);
      setStatus(status);
    } catch {
      toast.error("Something went wrong, please try again.");
    }
  };

  const handleReportClick = async () => {
    toast.success("Reported.");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="border border-slate-300 dark:border-slate-600">
        <ContextMenuItem asChild>
          <a
            href={shareURL}
            download="filename.pdf"
            rel="noopener noreferrer"
            target="_blank"
            className="h-full w-full"
          >
            Download
          </a>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <a href={shareURL} rel="noopener noreferrer" target="_blank">
            Open in new tab
          </a>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuCheckboxItem
          checked={bookmarkStatus}
          onClick={(e) => handleStatusChange(e, ResourceStatus.Saved)}
        >
          Bookmark
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={todoStatus}
          onClick={(e) => handleStatusChange(e, ResourceStatus.Todo)}
        >
          To-do
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={completedStatus}
          onClick={(e) => handleStatusChange(e, ResourceStatus.Completed)}
        >
          Completed
        </ContextMenuCheckboxItem>

        {resourceUserId !== currentUserId && (
          <>
            <ContextMenuSeparator className="" />
            <ContextMenuSub>
              <ContextMenuSubTrigger>Report resource</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={handleReportClick}>
                  Inappropriate filename
                </ContextMenuItem>
                <ContextMenuItem onClick={handleReportClick}>
                  Inappropriate username
                </ContextMenuItem>
                <ContextMenuItem onClick={handleReportClick}>
                  Incorrect module
                </ContextMenuItem>
                <ContextMenuItem onClick={handleReportClick}>
                  Incorrect category
                </ContextMenuItem>
                <ContextMenuItem onClick={handleReportClick}>
                  Incorrect academic year
                </ContextMenuItem>
                <ContextMenuItem onClick={handleReportClick}>
                  Incorrect semester
                </ContextMenuItem>
                {category === "Past Papers" && (
                  <ContextMenuItem>Incorrect exam type</ContextMenuItem>
                )}
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
