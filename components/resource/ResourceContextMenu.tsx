"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/ContextMenu";
import {
  ResourceSolutionType,
  ResourceType,
  papersAdditionalReportOptions,
  resourceReportOptions,
  solutionReportOptions,
} from "@/lib/content";
import { addResourceReportType } from "@/pages/api/addResourceReport";
import { addSolutionReportType } from "@/pages/api/addSolutionReport";
import { ResourceReportType, SolutionReportType } from "@prisma/client";
import axios from "axios";
import fileDownload from "js-file-download";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

interface ResourceContextMenuProps {
  children: React.ReactNode;
  category: ResourceSolutionType;
  currentUserId: string | null;
  resourceId: string;
  resourceTitle: string;
  resourceUserId: string;
  shareURL: string;
  className?: string;
  disabled?: boolean;
  isSolution?: boolean;
}

export default function ResourceContextMenu({
  children,
  category,
  currentUserId,
  resourceId,
  resourceTitle,
  resourceUserId,
  shareURL,
  className,
  disabled,
  isSolution,
}: ResourceContextMenuProps) {
  const [open, setOpen] = useState(false);

  const handleReportClick = async (
    type: ResourceReportType | SolutionReportType
  ) => {
    if (!currentUserId) {
      toast.error("Login required.");
      return;
    }

    let body: addResourceReportType | addSolutionReportType;
    if (!isSolution) {
      body = {
        category: category as ResourceType,
        reporterId: currentUserId,
        resourceId: resourceId,
        reportType: type as ResourceReportType,
      };
    } else {
      body = {
        reporterId: currentUserId,
        resourceId: resourceId,
        reportType: type as SolutionReportType,
      };
    }

    try {
      if (!isSolution) {
        let req = await axios.post("/api/addResourceReport", body);
      } else {
        let req = await axios.post("/api/addSolutionReport", body);
      }
      toast.success("Reported successfully!");
    } catch {
      toast.error("Something went wrong, please try again.");
    }
  };

  let reportChoices;
  if (isSolution) {
    reportChoices = solutionReportOptions;
  } else {
    reportChoices = resourceReportOptions;
    if (category === "Past Papers") {
      reportChoices = reportChoices.concat(papersAdditionalReportOptions);
    }
  }

  const handleDownloadClick = async () => {
    try {
      await axios.get(shareURL, { responseType: "blob" }).then((res) => {
        fileDownload(res.data, resourceTitle + ".pdf");
      });
    } catch {
      toast.error("Download failed.");
    }
  };

  let router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ContextMenu>
        <ContextMenuTrigger disabled={disabled} className={className}>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="border border-slate-300 dark:border-slate-600">
          <ContextMenuItem asChild>
            <button onClick={handleDownloadClick} className="h-full w-full">
              Download
            </button>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <a href={shareURL} rel="noopener noreferrer" target="_blank">
              Open in new tab
            </a>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <DialogTrigger>Open</DialogTrigger>
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
            <ContextMenuSubTrigger
              data-cy="report-resource"
              disabled={resourceUserId === currentUserId}
            >
              Report resource
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {reportChoices.map((option) => {
                return (
                  <ContextMenuItem
                    data-cy={option.value}
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Button
            onClick={() => {
              router.refresh();
              setOpen(false);
            }}
            className="flex-1"
          >
            <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-300">
              Cancel
            </div>
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
