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
import { useState } from "react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { deleteS3ObjectType } from "@/pages/api/deleteS3Object";
import { deletePDFType } from "@/pages/api/deletePDF";

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

  const handleDelete = async function () {
    setOpen(false);

    if (!currentUserId) {
      toast.error("Unauthorized.");
      return;
    }

    let body: deleteS3ObjectType = { userId: currentUserId, id: resourceId };
    try {
      const res = await axios.post("/api/deleteS3Object", body);
      try {
        let body: deletePDFType = {
          userId: currentUserId,
          id: resourceId,
          category: category,
        };
        await axios.post("/api/deletePDF", body);
      } catch (error) {
        toast.error("Error deleting resource, please try again later.");
        return;
      }
    } catch (error) {
      toast.error("Error deleting resource, please try again later.");
      return;
    }
    router.refresh();
    toast.success("Resource deleted successfully!");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={disabled} className={className}>
        {children}
      </ContextMenuTrigger>
      <Dialog open={open} onOpenChange={setOpen}>
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

          {resourceUserId === currentUserId && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem asChild>
                <DialogTrigger className="w-full"> Delete item </DialogTrigger>
              </ContextMenuItem>
            </>
          )}
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

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex w-full gap-x-2">
            <Button className="w-1/2" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="w-1/2"
              variant="dangerous"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  );
}
