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
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ResourceContextMenuProps {
  children: React.ReactNode;
  category: ResourceType;
  currentUserId: string | null;
  resourceUserId: string;
  className?: string;
}

export default function ResourceContextMenu({
  children,
  category,
  currentUserId,
  resourceUserId,
  className,
}: ResourceContextMenuProps) {
  console.log(`resource_id: ${resourceUserId}`);
  console.log(`curr_user_id: ${currentUserId}`);

  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [todoStatus, setTodoStatus] = useState(false);
  const [todoLoading, setTodoLoading] = useState(false);
  const [completedStatus, setCompletedStatus] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);

  const handleDownloadClick = () => {
    toast.success("Virus downloaded.");
  };
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      toast.error("Login required to bookmark.");
      return null;
    }
    setBookmarkLoading(true);

    setBookmarkStatus(!bookmarkStatus);
  };
  const handleTodoClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setTodoStatus(!todoStatus);
    setCompletedStatus(false);
  };
  const handleCompletedClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCompletedStatus(!completedStatus);
    setTodoStatus(false);
  };

  const handleReportClick = async () => {
    toast.success("Reported.");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="border border-slate-300 dark:border-slate-600">
        <ContextMenuItem onClick={handleDownloadClick}>
          <a
            href="randomerror.pdf"
            rel="noopener noreferrer"
            target="_blank"
            download
          >
            Download
          </a>
        </ContextMenuItem>
        <ContextMenuItem>
          <a
            href="https://medicine.nus.edu.sg/nursing/wp-content/uploads/sites/2/2019/11/Form-withdrawal-from-univ.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in new tab
          </a>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={bookmarkStatus}
          onClick={handleBookmarkClick}
          isLoading={bookmarkLoading}
        >
          Bookmark
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={todoStatus}
          onClick={handleTodoClick}
          isLoading={todoLoading}
        >
          To-do
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={completedStatus}
          onClick={handleCompletedClick}
          isLoading={completedLoading}
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
