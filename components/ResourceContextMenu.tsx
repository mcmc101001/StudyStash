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
import {
  ResourceSolutionType,
  ResourceType,
  papersAdditionalReportOptions,
  reportOptions,
} from "@/lib/content";
import { addReportType } from "@/pages/api/addReport";
import { updateStatusType } from "@/pages/api/updateStatus";
import { ReportType, ResourceStatus } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

// export class RepeatReportError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "RepeatReportError";
//   }
// }

interface ResourceContextMenuProps {
  children: React.ReactNode;
  category: ResourceSolutionType;
  currentUserId: string | null;
  resourceId: string;
  resourceUserId: string;
  shareURL: string;
  className?: string;
  // resourceStatus: ResourceStatus | null;
}

export default function ResourceContextMenu({
  children,
  category,
  currentUserId,
  resourceId,
  resourceUserId,
  shareURL,
  className,
}: // resourceStatus,
ResourceContextMenuProps) {
  // const [status, setStatus] = useState<ResourceStatus | null>(resourceStatus);

  let router = useRouter();

  // const handleStatusChange = async (
  //   e: React.MouseEvent,
  //   clickedStatus: ResourceStatus
  // ) => {
  //   e.preventDefault();

  //   if (!currentUserId) {
  //     toast.error("Login required.");
  //     return;
  //   }
  //   if (clickedStatus === status) {
  //     setStatus(null);
  //     let body: updateStatusType = {
  //       category: category,
  //       userId: currentUserId,
  //       resourceId: resourceId,
  //       status: null,
  //     };

  //     try {
  //       let req = await axios.post("/api/updateStatus", body);
  //     } catch {
  //       toast.error("Something went wrong, please try again.");
  //     }
  //   } else {
  //     setStatus(clickedStatus);
  //     let body: updateStatusType = {
  //       category: category,
  //       userId: currentUserId,
  //       resourceId: resourceId,
  //       status: clickedStatus,
  //     };

  //     try {
  //       let req = await axios.post("/api/updateStatus", body);
  //     } catch {
  //       toast.error("Something went wrong, please try again.");
  //     }
  //     router.refresh();
  //   }
  // };

  const handleReportClick = async (type: ReportType) => {
    if (!currentUserId) {
      toast.error("Login required.");
      return;
    }

    let body: addReportType = {
      category: category,
      reporterId: currentUserId,
      resourceId: resourceId,
      reportType: type,
    };

    try {
      let req = await axios.post("/api/addReport", body);
      toast.success("Report successful!");
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        e.message === "Request failed with status code 419"
      ) {
        toast.success("Repeated report.");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
  };

  let reportChoices = reportOptions;
  if (category === "Past Papers") {
    reportChoices.concat(papersAdditionalReportOptions);
  }

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

        {/* <ContextMenuSeparator />

        <ContextMenuCheckboxItem
          checked={status === "Saved"}
          onClick={(e) => handleStatusChange(e, ResourceStatus.Saved)}
        >
          Bookmark
        </ContextMenuCheckboxItem>
        {category === "Past Papers" && (
          <ContextMenuCheckboxItem
            checked={status === "Todo"}
            onClick={(e) => handleStatusChange(e, ResourceStatus.Todo)}
          >
            Todo
          </ContextMenuCheckboxItem>
        )}
        {category === "Past Papers" && (
          <ContextMenuCheckboxItem
            checked={status === "Completed"}
            onClick={(e) => handleStatusChange(e, ResourceStatus.Completed)}
          >
            Completed
          </ContextMenuCheckboxItem>
        )} */}

        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger disabled={resourceUserId === currentUserId}>
            Report resource
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {reportChoices.map((option) => {
              return (
                <ContextMenuItem
                  key={option.value}
                  onClick={() => handleReportClick(option.value)}
                >
                  {option.label}
                </ContextMenuItem>
              );
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
