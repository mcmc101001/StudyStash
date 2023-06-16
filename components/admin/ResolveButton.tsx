"use client";

import { ReportHeaderType } from "./ReportTableColumns";
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
import { editResolvedType } from "@/pages/api/editResolve";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { ResourceSolutionType, examTypeOptions } from "@/lib/content";
import Button from "@/components/ui/Button";
import StyledSelect from "../ui/StyledSelect";

export default function ResolveButton({
  report,
}: {
  report: ReportHeaderType;
}) {
  const editResolve = async (
    // userId: string,
    category: ResourceSolutionType,
    reportId: string,
    setResolved: boolean
  ) => {
    let body: editResolvedType = {
      // userId: userId,
      category: category,
      reportId: reportId,
      setResolved: setResolved,
    };

    try {
      let req = await axios.post("/api/editResolve", body);
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

  const handleResolveOrReopen = async (report: ReportHeaderType) => {
    if (report.resolved === "Resolved") {
      await editResolve(report.category, report.reportId, false);
      router.refresh();
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="border border-slate-800 dark:border-slate-200"
          onClick={() => handleResolveOrReopen(report)}
        >
          {report.resolved === "Unresolved" ? "Resolve" : "Reopen"}
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={exitDialog}
        onEscapeKeyDown={exitDialog}
      >
        <DialogHeader>Reported for {report.type}</DialogHeader>
        {report.type === "inappropriateFilename" && (
          <div>
            <label>Edit filename</label>
            <Input type="text" defaultValue={report.filename} />
          </div>
        )}
        {report.type === "inappropriateUsername" && (
          <div>
            <label>Edit username</label>
            <Input type="text" defaultValue={report.uploaderName} />
          </div>
        )}
        {report.type === "incorrectExamType" && (
          <div>
            <StyledSelect
              label="Select Acad Year"
              placeholderText="Acad Year"
              options={examTypeOptions}
              onChange={() => console.log("change acad year")}
              labelExists={false}
              defaultValue={{ value: "Final", label: "Final" }}
            />
          </div>
        )}
        <div className="flex flex-row gap-2">
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await editResolve(report.category, report.reportId, true);
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
              await editResolve(report.category, report.reportId, true);
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
