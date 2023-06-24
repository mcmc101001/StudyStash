"use client";

import { SolutionReportHeaderType } from "./ReportTableColumns";
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
import { editSolutionResolvedType } from "@/pages/api/editSolutionResolve";
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

export default function SolutionResolveButton({
  report,
}: {
  report: SolutionReportHeaderType;
}) {
  const editSolutionResolve = async (
    // userId: string,
    reportId: string,
    setResolved: boolean
  ) => {
    let body: editSolutionResolvedType = {
      // userId: userId,
      reportId: reportId,
      setResolved: setResolved,
    };

    try {
      let req = await axios.post("/api/editSolutionResolve", body);
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

  const handleResolveOrReopen = async (report: SolutionReportHeaderType) => {
    if (report.resolved) {
      await editSolutionResolve(report.reportId, false);
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
            <label>Reported for Inappropriate Filename</label>
            <Input type="text" defaultValue={report.uploaderName} />
          </div>
        ) : report.type === "incorrectQuestionPaper" ? (
          <div>How to change qnpaper hmmmmm</div>
        ) : (
          <div>Set up report edit function.</div>
        )}
        <div className="flex flex-row gap-2">
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await editSolutionResolve(report.reportId, true);
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
              await editSolutionResolve(report.reportId, true);
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
