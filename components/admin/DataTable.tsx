"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import StyledSelect from "@/components/ui/StyledSelect";
import {
  resolvedOptions,
  resourceReportOptions,
  papersAdditionalReportOptions,
  categoryOptions,
  solutionReportOptions,
  commentReportOptions,
} from "@/lib/content";
import useQueryParams from "@/hooks/useQueryParams";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  moduleCodeOptions?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  moduleCodeOptions,
  className,
}: DataTableProps<TData, TValue>) {
  let { queryParams, setQueryParams } = useQueryParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (moduleCodeOptions) {
    sessionStorage.setItem("moduleCodeOptions", moduleCodeOptions);
  }
  const section = queryParams?.get("section");
  let reasonOptions;
  if (section === "resource") {
    reasonOptions = resourceReportOptions.concat(papersAdditionalReportOptions);
  } else if (section === "solution") {
    reasonOptions = solutionReportOptions;
  } else {
    reasonOptions = commentReportOptions;
  }

  return (
    <div className={className}>
      <div className="flex h-screen w-auto flex-col px-16 py-10">
        <h1 className="mb-6 text-4xl font-semibold text-slate-400 dark:text-slate-700">
          <button
            disabled={section === "resource"}
            onClick={() => setQueryParams({ section: "resource" })}
            className="text-slate-400 disabled:text-slate-800 dark:text-slate-700 dark:disabled:text-slate-200"
          >
            Resource
          </button>
          /
          <button
            disabled={section === "solution"}
            onClick={() => setQueryParams({ section: "solution" })}
            className="text-slate-400 disabled:text-slate-800 dark:text-slate-700 dark:disabled:text-slate-200"
          >
            Solution
          </button>
          /
          <button
            disabled={section === "comment"}
            onClick={() => setQueryParams({ section: "comment" })}
            className="text-slate-400 disabled:text-slate-800 dark:text-slate-700 dark:disabled:text-slate-200"
          >
            Comment
          </button>
          <span className="text-slate-800 dark:text-slate-200">
            {" reports"}
          </span>
        </h1>

        <div className="mb-2 flex items-center gap-4">
          <div className="w-1/5">
            <StyledSelect
              label="Select reason"
              labelExists={false}
              placeholderText="Select reason"
              options={reasonOptions}
              onChange={(option) =>
                table.getColumn("type")?.setFilterValue(option?.value)
              }
            />
          </div>
          {section === "resource" && (
            <div className="w-1/5">
              <StyledSelect
                label="Select category"
                labelExists={false}
                placeholderText="Select category"
                options={categoryOptions}
                onChange={(option) => {
                  table.getColumn("category")?.setFilterValue(option?.label);
                }}
              />
            </div>
          )}
          <DropdownMenu open={dropdownOpen} modal={false}>
            <DropdownMenuTrigger
              asChild
              className="border border-slate-800 dark:border-slate-200"
            >
              <Button
                variant="ghost"
                className="ml-auto select-none"
                onClick={() => setDropdownOpen(true)}
                disabled={dropdownOpen}
              >
                Manage columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onPointerDownOutside={() => setDropdownOpen(false)}
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="max-h-[75vh] overflow-auto rounded-md border scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-md dark:scrollbar-thumb-slate-700">
          <Table className="overflow-auto">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[10rem] overflow-x-auto whitespace-nowrap py-1.5 scrollbar-none"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-5 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex select-none items-center justify-end space-x-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border border-slate-800 dark:border-slate-200"
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border border-slate-800 dark:border-slate-200"
        >
          Next
        </Button>
      </div> */}
      </div>
    </div>
  );
}
