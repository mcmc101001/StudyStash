"use client";

import { CommentReportHeaderType } from "@/components/admin/ReportTableColumns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { deleteCommentReportType } from "@/pages/api/deleteCommentReport";
import { updateCommentDataType } from "@/pages/api/updateCommentData";

export default function CommentResolveButton({
  report,
}: {
  report: CommentReportHeaderType;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(
    report.type === "inappropriateUsername"
  );
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setDisabled(report.type === "inappropriateUsername");
      router.refresh();
    }
  }, [open, report.type, router]);

  const resolveCommentReport = async (isEdit: boolean) => {
    try {
      if (isEdit) {
        let updateBody: updateCommentDataType = {
          type: report.type,
          category: report.category,
          authorId: report.authorId,
          commentId: report.commentId,
          newData: data,
        };
        let update = await axios.post("/api/updateCommentData", updateBody);
      }

      let deleteBody: deleteCommentReportType = {
        category: report.category,
        reportId: report.reportId,
      };
      let deleteReport = await axios.post(
        "/api/deleteCommentReport",
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
        {report.type === "inappropriateUsername" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for Inappropriate Username</label>
            <Input
              type="text"
              defaultValue={report.authorName}
              onChange={({ target }) => {
                setData(target.value);
                setDisabled(false);
              }}
            />
          </div>
        ) : report.type === "spam" || report.type === "harassment" ? (
          <div className="flex flex-col gap-1">
            <label>Reported for {report.type}</label>
            <textarea
              defaultValue={report.content}
              disabled
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
              await resolveCommentReport(false);
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
              await resolveCommentReport(true);
              setOpen(false);
            }}
            disabled={loading || disabled}
          >
            {report.type === "inappropriateUsername"
              ? "Edit & resolve"
              : "Delete comment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
