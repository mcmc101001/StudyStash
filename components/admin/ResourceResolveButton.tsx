"use client";

import { ResourceReportHeaderType } from "./ReportTableColumns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { useState } from "react";
import axios from "axios";
import { editResourceResolvedType } from "@/pages/api/editResourceResolve";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import {
  ResourceType,
  categoryOptions,
  examTypeOptions,
  semesterOptions,
} from "@/lib/content";
import Button from "@/components/ui/Button";
import StyledSelect, { Option } from "@/components//ui/StyledSelect";
import { ResourceReportType } from "@prisma/client";
import { getAcadYearOptions } from "@/lib/nusmods";
import { startsWithNumbers, trimUntilNumber } from "@/lib/utils";

export default function ResourceResolveButton({
  report,
  moduleCodeOptions,
}: {
  report: ResourceReportHeaderType;
  moduleCodeOptions: Option[];
}) {
  const editResourceResolve = async (
    // userId: string,
    category: ResourceType,
    reportId: string,
    setResolved: boolean
  ) => {
    let body: editResourceResolvedType = {
      // userId: userId,
      category: category,
      reportId: reportId,
      setResolved: setResolved,
    };

    try {
      let req = await axios.post("/api/editResourceResolve", body);
      if (setResolved) {
        toast.success("Successfully resolved!");
      } else {
        toast.success("Successfully reopened!");
      }
    } catch (e) {
      // if (e instanceof Error) toast.error(e.message);
      toast.error("Something went wrong, please try again.");
    }
  };

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const exitDialog = () => {
    setOpen(false);
    setLoading(false);
    router.refresh();
  };

  const handleResolveOrReopen = async (report: ResourceReportHeaderType) => {
    if (report.resolved) {
      await editResourceResolve(report.category, report.reportId, false);
      router.refresh();
    } else {
      setOpen(true);
    }
  };

  const acadYearOptions = getAcadYearOptions();

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="border border-slate-800 py-0 dark:border-slate-200"
          onClick={() => handleResolveOrReopen(report)}
        >
          {!report.resolved ? "Resolve" : "Reopen"}
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={exitDialog}
        onEscapeKeyDown={exitDialog}
      >
        {report.type === "inappropriateFilename" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for Inappropriate Filename</label>
            <Input type="text" defaultValue={report.filename} />
          </div>
        ) : report.type === "inappropriateUsername" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for Inappropriate Username</label>
            <Input type="text" defaultValue={report.uploaderName} />
          </div>
        ) : report.type === "incorrectModule" ? (
          <StyledSelect
            label="Module Code"
            placeholderText="Select Module Code"
            onChange={() => console.log("handle change")}
            options={moduleCodeOptions}
            noOptionsMessage={({ inputValue }) =>
              inputValue.trimStart().length < 1
                ? "Type to search..."
                : "No options"
            }
            filterOption={(
              option: { value: string; label: string },
              query: string
            ) => {
              const trimmed_query = query.trimStart();
              if (trimmed_query.length < 1) {
                return false;
              }
              // If matches prefix
              if (
                option.value
                  .toLowerCase()
                  .startsWith(trimmed_query.toLowerCase())
              ) {
                return true;
              } else if (startsWithNumbers(trimmed_query)) {
                // If matches number
                const trimmedOption = trimUntilNumber(
                  option.value.toLowerCase()
                );
                if (trimmedOption.startsWith(trimmed_query.toLowerCase())) {
                  return true;
                }
              }
              return false;
            }}
            defaultValue={moduleCodeOptions.find((option) => {
              return option.label === report.moduleCode;
            })}
          />
        ) : report.type === "incorrectCategory" ? (
          <StyledSelect
            label="Reported for incorrect category"
            options={categoryOptions}
            onChange={() => console.log("handlechange")}
            defaultValue={categoryOptions.find((option) => {
              return option.label === report.category;
            })}
          />
        ) : report.type === "incorrectAcadYear" ? (
          <StyledSelect
            label="Reported for incorrect AY"
            options={acadYearOptions}
            onChange={() => console.log("handlechange")}
            defaultValue={acadYearOptions.find((option) => {
              return option.value === report.acadYear;
            })}
          />
        ) : report.type === "incorrectSemester" ? (
          <StyledSelect
            label="Reported for incorrect semester"
            options={semesterOptions}
            onChange={() => console.log("handlechange")}
            defaultValue={semesterOptions.find((option) => {
              return option.value === report.semester;
            })}
          />
        ) : report.type === "incorrectExamType" ? (
          <StyledSelect
            label="Reported for incorrect exam type"
            options={examTypeOptions}
            onChange={() => console.log("handlechange")}
            defaultValue={examTypeOptions.find((option) => {
              return option.value === report.examType;
            })}
          />
        ) : (
          <div>Set up report edit function.</div>
        )}
        <div className="flex flex-row gap-2">
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await editResourceResolve(report.category, report.reportId, true);
              exitDialog();
            }}
            disabled={loading}
          >
            Ignore & resolve
          </Button>
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await editResourceResolve(report.category, report.reportId, true);
              exitDialog();
            }}
          >
            Edit & resolve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
