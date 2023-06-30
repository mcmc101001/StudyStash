"use client";

import { ResourceReportHeaderType } from "./ReportTableColumns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { deleteResourceReportType } from "@/pages/api/deleteResourceReport";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { examTypeOptions, semesterOptions } from "@/lib/content";
import Button from "@/components/ui/Button";
import StyledSelect, { Option } from "@/components//ui/StyledSelect";
import { getAcadYearOptions } from "@/lib/nusmods";
import { startsWithNumbers, trimUntilNumber } from "@/lib/utils";
import { updateResourceDataType } from "@/pages/api/updateResourceData";

export default function ResourceResolveButton({
  report,
  moduleCodeOptions,
}: {
  report: ResourceReportHeaderType;
  moduleCodeOptions: Option[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setDisabled(true);
      router.refresh();
    }
  }, [open]);

  const acadYearOptions = getAcadYearOptions();

  const resolveResourceReport = async (isEdit: boolean) => {
    try {
      if (isEdit) {
        let updateBody: updateResourceDataType = {
          type: report.type,
          category: report.category,
          uploaderId: report.uploaderId,
          resourceId: report.resourceId,
          newData: data,
        };
        let update = await axios.post("/api/updateResourceData", updateBody);
      }

      let deleteBody: deleteResourceReportType = {
        category: report.category,
        reportId: report.reportId,
      };
      let deleteReport = await axios.post(
        "/api/deleteResourceReport",
        deleteBody
      );
      toast.success("Successfully resolved!");
    } catch (e) {
      toast.error("Failed to resolve.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="border border-slate-800 py-0 dark:border-slate-200"
          onClick={() => setOpen(true)}
        >
          Resolve
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
      >
        {report.type === "inappropriateFilename" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for inappropriate filename</label>
            <Input
              type="text"
              defaultValue={report.filename}
              onChange={({ target }) => {
                setData(target.value);
                setDisabled(false);
              }}
            />
          </div>
        ) : report.type === "inappropriateUsername" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for inappropriate username</label>
            <Input
              type="text"
              defaultValue={report.uploaderName}
              onChange={({ target }) => {
                setData(target.value);
                setDisabled(false);
              }}
            />
          </div>
        ) : report.type === "incorrectModule" ? (
          <StyledSelect
            label="Module Code"
            placeholderText="Select Module Code"
            onChange={(option) => {
              if (option) {
                setData(option.value);
                setDisabled(false);
              } else {
                setDisabled(true);
              }
            }}
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
        ) : report.type === "incorrectAcadYear" ? (
          <StyledSelect
            label="Reported for incorrect acad year"
            options={acadYearOptions}
            onChange={(option) => {
              if (option) {
                setData(option.value);
                setDisabled(false);
              } else {
                setDisabled(true);
              }
            }}
            defaultValue={acadYearOptions.find((option) => {
              return option.value === report.acadYear;
            })}
          />
        ) : report.type === "incorrectSemester" ? (
          <StyledSelect
            label="Reported for incorrect semester"
            options={semesterOptions}
            onChange={(option) => {
              if (option) {
                setData(option.value);
                setDisabled(false);
              } else {
                setDisabled(true);
              }
            }}
            defaultValue={semesterOptions.find((option) => {
              return option.value === report.semester;
            })}
          />
        ) : report.type === "incorrectExamType" ? (
          <StyledSelect
            label="Reported for incorrect exam type"
            options={examTypeOptions}
            onChange={(option) => {
              if (option) {
                setData(option.value);
                setDisabled(false);
              } else {
                setDisabled(true);
              }
            }}
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
              await resolveResourceReport(false);
              setOpen(false);
            }}
            disabled={loading}
          >
            Ignore & resolve
          </Button>
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await resolveResourceReport(true);
              setOpen(false);
            }}
            disabled={loading || disabled}
          >
            Edit & resolve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
