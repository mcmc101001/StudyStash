"use client";

import { ExamType, ReportType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import { ResourceSolutionType } from "@/lib/content";
import ResolveButton from "./ResolveButton";
import UserNameLink from "../user/UserNameLink";
import { getModuleCodeOptions } from "@/lib/nusmods";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ReportHeaderType = {
  reportId: string;
  type: ReportType;
  category: ResourceSolutionType;
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

export const columns: ColumnDef<ReportHeaderType>[] = [
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
  },
  {
    accessorKey: "uploaderName",
    header: "Uploader",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <UserNameLink
          id={report.uploaderId}
          name={report.uploaderName}
          verified={false}
          className="text-slate-800 dark:text-slate-200"
        />
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
        <UserNameLink
          id={report.reporterId}
          name={report.reporterName}
          verified={false}
          className="text-slate-800 dark:text-slate-100"
        />
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

      return (
        <ResolveButton
          report={report}
          // moduleCodeOptions={await getModuleCodeOptions()}
          moduleCodeOptions={[]}
        />
      );
    },
  },
];
