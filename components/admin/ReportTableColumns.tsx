"use client";

import { ExamType, ReportType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import { ResourceSolutionType } from "@/lib/content";
import ResolveButton from "./ResolveButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ReportHeaderType = {
  reportId: string;
  type: ReportType;
  category: ResourceSolutionType;
  createdAt: string;
  filename: string;
  uploaderName: string;
  resourceId: string;
  reporterId: string;
  resolved: string;
  reporterName: string;
  examType?: ExamType;
};

export const columns: ColumnDef<ReportHeaderType>[] = [
  {
    accessorKey: "resolved",
    header: "Status",
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
          className="whitespace-nowrap"
        >
          Time of report
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "filename",
    header: "Filename",
  },
  {
    accessorKey: "uploaderName",
    header: "Uploader",
  },
  {
    accessorKey: "resourceId",
    header: "Resource ID",
  },
  {
    accessorKey: "reporterName",
    header: "Reporter",
  },
  {
    accessorKey: "reporterId",
    header: "Reporter ID",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;

      return <ResolveButton report={report} />;
    },
  },
];
