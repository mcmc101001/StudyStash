"use client";

import { CommentReportHeaderType } from "./ReportTableColumns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { CommentReportCategory } from "@/lib/content";
import Button from "@/components/ui/Button";
import { editCommentResolvedType } from "@/pages/api/editCommentResolve";

export default function CommentResolveButton({
  report,
}: {
  report: CommentReportHeaderType;
}) {
  const editCommentResolve = async (
    category: CommentReportCategory,
    reportId: string,
    setResolved: boolean
  ) => {
    let body: editCommentResolvedType = {
      category: category,
      reportId: reportId,
      setResolved: setResolved,
    };

    try {
      let req = await axios.post("/api/editCommentResolve", body);
      setResolved
        ? toast.success("Successfully resolved!")
        : toast.success("Successfully reopened!");
    } catch (e) {
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

  const handleResolveOrReopen = async (report: CommentReportHeaderType) => {
    if (report.resolved) {
      await editCommentResolve(report.category, report.reportId, false);
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
        {report.type === "inappropriateUsername" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for Inappropriate Username</label>
            <Input type="text" defaultValue={report.authorName} />
          </div>
        ) : report.type === "spam" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for spam</label>
            <textarea
              defaultValue={report.content}
              className="min-h-[15rem] resize-none overflow-auto rounded bg-slate-300 px-3 py-2 text-slate-800 outline-none scrollbar-thin scrollbar-thumb-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:caret-white"
            />
          </div>
        ) : report.type === "harassment" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for harassment</label>
            <textarea
              defaultValue={report.content}
              className="min-h-[15rem] resize-none overflow-auto rounded bg-slate-300 px-3 py-2 text-slate-800 outline-none scrollbar-thin scrollbar-thumb-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:caret-white"
            />
          </div>
        ) : (
          <div>Set up report edit function.</div>
        )}
        <div className="flex flex-row gap-2">
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await editCommentResolve(report.category, report.reportId, true);
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
              await editCommentResolve(report.category, report.reportId, true);
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
