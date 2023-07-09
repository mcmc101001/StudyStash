"use client";

import {
  ExamType,
  ResourceReportType,
  SolutionReportType,
  CommentReportType,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { CommentReportCategory, ResourceType } from "@/lib/content";
import ResourceResolveButton from "@/components/admin/ResourceResolveButton";
import SolutionResolveButton from "@/components/admin/SolutionResolveButton";
import CommentResolveButton from "@/components/admin/CommentResolveButton";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  reporterName: string;
};

export type CommentReportHeaderType = {
  reportId: string;
  type: CommentReportType;
  category: CommentReportCategory;
  createdAt: string;
  authorId: string;
  authorName: string;
  commentId: string;
  reporterId: string;
  reporterName: string;
  content: string;
};

export const resourceColumns: ColumnDef<ResourceReportHeaderType>[] = [
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
    accessorKey: "type",
    header: "Reason",
  },
  {
    accessorKey: "moduleCode",
    header: "Module",
  },
  {
    accessorKey: "category",
    header: "Category",
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
    accessorKey: "type",
    header: "Reason",
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
    accessorKey: "type",
    header: "Reason",
  },
  {
    accessorKey: "category",
    header: "Comment",
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
