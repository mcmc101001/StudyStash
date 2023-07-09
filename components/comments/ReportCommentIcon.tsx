"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  commentReportOptions,
  CommentReportCategory,
  ResourceSolutionType,
} from "@/lib/content";
import { addCommentReportType } from "@/pages/api/addCommentReport";
import { CommentReportType } from "@prisma/client";
import axios from "axios";
import { Flag } from "lucide-react";
import { toast } from "react-hot-toast";

interface ReportCommentIconProps {
  resourceCategory: ResourceSolutionType;
  reporterId: string | undefined;
  commentId: string;
  isReply?: boolean;
}

export default function ReportCommentIcon({
  commentId,
  reporterId,
  resourceCategory,
  isReply,
}: ReportCommentIconProps) {
  const handleCommentReport = async (reportType: CommentReportType) => {
    let category: CommentReportCategory;
    if (resourceCategory === "Cheatsheets") {
      category = isReply ? "cheatsheetReplyReport" : "cheatsheetCommentReport";
    } else if (resourceCategory === "Past Papers") {
      category = isReply
        ? "questionPaperReplyReport"
        : "questionPaperCommentReport";
    } else if (resourceCategory === "Notes") {
      category = isReply ? "notesReplyReport" : "notesCommentReport";
    } else if (resourceCategory === "Solutions") {
      category = isReply ? "solutionReplyReport" : "solutionCommentReport";
    } else {
      toast.error("Please log in first!");
      return;
    }

    if (!reporterId) {
      toast.error("Please log in first!");
      return;
    }

    let body: addCommentReportType = {
      category: category,
      reporterId: reporterId,
      commentId: commentId,
      reportType: reportType,
    };

    try {
      const req = await axios.post("/api/addCommentReport", body);
      toast.success("Reported successfully!");
    } catch {
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className="flex cursor-pointer flex-row items-center gap-x-1"
          data-cy="reportCommentIcon"
        >
          <Flag size={20} />
          <span className="hidden text-sm @md:inline @lg:text-base">
            Report
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-slate-800" align="start">
        {commentReportOptions.map((option) => {
          return (
            <DropdownMenuItem
              data-cy={option.value}
              key={option.label}
              onClick={() => handleCommentReport(option.value)}
              className="cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
