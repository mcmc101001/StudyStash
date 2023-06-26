"use client";

import {
  ExamType,
  ResourceReportType,
  SolutionReportType,
  CommentReportType,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import { CommentReportCategory, ResourceType } from "@/lib/content";
import ResourceResolveButton from "./ResourceResolveButton";
import SolutionResolveButton from "./SolutionResolveButton";
import CommentResolveButton from "@/components/admin/CommentResolveButton";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ResourceReportHeaderType = {
  reportId: string;
  type: ResourceReportType;
  category: ResourceType;
  createdAt: string;
  filename: string;
  uploaderId: string;
  uploaderName: string;
  resourceId: string;
  reporterId: string;
  resolved: boolean;
  reporterName: string;
  acadYear: string;
  semester: string;
  moduleCode: string;
  examType?: ExamType;
};

export type SolutionReportHeaderType = {
  reportId: string;
  type: SolutionReportType;
  createdAt: string;
  filename: string;
  uploaderId: string;
  uploaderName: string;
  resourceId: string;
  reporterId: string;
  resolved: boolean;
  reporterName: string;
};

export type CommentReportHeaderType = {
  reportId: string;
  type: CommentReportType;
  category: CommentReportCategory;
  createdAt: string;
  // filename: string;
  authorId: string;
  authorName: string;
  commentId: string;
  reporterId: string;
  resolved: boolean;
  reporterName: string;
  content: string;
};

export const resourceColumns: ColumnDef<ResourceReportHeaderType>[] = [
  {
    accessorKey: "resolved",
    header: "Resolved?",
    cell: ({ row }) => {
      const report = row.original;

      let className = "font-semibold";
      let text = "No";
      if (report.resolved) {
        text = "Yes";
        className += " text-green-500";
      } else {
        className += " text-red-500";
      }

      return <p className={className}>{text}</p>;
    },
  },
  {
    accessorKey: "type",
    header: "Reason",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time of report
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "Filename",
    cell: ({ row }) => {
      const report = row.original;

      let categoryURL =
        report.category === "Cheatsheets"
          ? "cheatsheets"
          : report.category === "Notes"
          ? "notes"
          : "past_papers";

      return (
        <a
          // href={`/database/${report.moduleCode}/${categoryURL}/?id=${report.resourceId}`}
          href={`https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${report.resourceId}`}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:underline"
        >
          {report.filename}
        </a>
      );
    },
  },
  {
    accessorKey: "uploaderName",
    header: "Uploader",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Link
          href={`/profile/${report.uploaderId}`}
          className="hover:underline"
        >
          {report.uploaderName}
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "resourceId",
  //   header: "Resource ID",
  // },
  {
    accessorKey: "reporterName",
    header: "Reporter",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Link
          href={`/profile/${report.reporterId}`}
          className="hover:underline"
        >
          {report.reporterName}
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "reporterId",
  //   header: "Reporter ID",
  // },
  {
    // header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;

      let moduleCodeOptions: {
        value: string;
        label: string;
      }[] = [];
      if (report.type === "incorrectModule") {
        const moduleCodeOptionsString =
          sessionStorage.getItem("moduleCodeOptions");
        if (!moduleCodeOptionsString) redirect("/404");
        moduleCodeOptions = JSON.parse(moduleCodeOptionsString) as {
          value: string;
          label: string;
        }[];
      }

      return (
        <ResourceResolveButton
          report={report}
          moduleCodeOptions={moduleCodeOptions}
        />
      );
    },
  },
];

export const solutionColumns: ColumnDef<SolutionReportHeaderType>[] = [
  {
    accessorKey: "resolved",
    header: "Resolved?",
    cell: ({ row }) => {
      const report = row.original;

      let className = "font-semibold";
      let text = "No";
      if (report.resolved) {
        text = "Yes";
        className += " text-green-500";
      } else {
        className += " text-red-500";
      }

      return <p className={className}>{text}</p>;
    },
  },
  {
    accessorKey: "type",
    header: "Reason",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time of report
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "Filename",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <a
          href={`https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${report.resourceId}`}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:underline"
        >
          {report.filename}
        </a>
      );
    },
  },
  {
    accessorKey: "uploaderName",
    header: "Uploader",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Link
          href={`/profile/${report.uploaderId}`}
          className="hover:underline"
        >
          {report.uploaderName}
        </Link>
      );
    },
  },
  {
    accessorKey: "reporterName",
    header: "Reporter",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Link
          href={`/profile/${report.reporterId}`}
          className="hover:underline"
        >
          {report.reporterName}
        </Link>
      );
    },
  },
  {
    // header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;

      return <SolutionResolveButton report={report} />;
    },
  },
];

export const commentColumns: ColumnDef<CommentReportHeaderType>[] = [
  {
    accessorKey: "resolved",
    header: "Resolved?",
    cell: ({ row }) => {
      const report = row.original;

      let className = "font-semibold";
      let text = "No";
      if (report.resolved) {
        text = "Yes";
        className += " text-green-500";
      } else {
        className += " text-red-500";
      }

      return <p className={className}>{text}</p>;
    },
  },
  {
    accessorKey: "type",
    header: "Reason",
  },
  {
    accessorKey: "category",
    header: "Comment",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>{report.category}</TooltipTrigger>
            <TooltipContent className="max-w-md whitespace-normal">
              {report.content}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time of report
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "authorName",
    header: "Author",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Link href={`/profile/${report.authorId}`} className="hover:underline">
          {report.authorName}
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "resourceId",
  //   header: "Resource ID",
  // },
  {
    accessorKey: "reporterName",
    header: "Reporter",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Link
          href={`/profile/${report.reporterId}`}
          className="hover:underline"
        >
          {report.reporterName}
        </Link>
      );
    },
  },
  {
    // header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;

      return <CommentResolveButton report={report} />;
    },
  },
];
