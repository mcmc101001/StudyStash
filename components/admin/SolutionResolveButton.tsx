"use client";

import { SolutionReportHeaderType } from "@/components/admin/ReportTableColumns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { updateSolutionDataType } from "@/pages/api/updateSolutionData";
import { deleteSolutionReportType } from "@/pages/api/deleteSolutionReport";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function SolutionResolveButton({
  report,
}: {
  report: SolutionReportHeaderType;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(
    report.type !== "incorrectQuestionPaper"
  );
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setDisabled(report.type !== "incorrectQuestionPaper");
      router.refresh();
    }
  }, [open, report.type, router]);

  const resolveSolutionReport = async (isEdit: boolean) => {
    try {
      try {
        if (isEdit) {
          let updateBody: updateSolutionDataType = {
            type: report.type,
            uploaderId: report.uploaderId,
            resourceId: report.resourceId,
            newData: data,
          };
          let update = await axios.post("/api/updateSolutionData", updateBody);
        }
      } catch {
        toast.error("Failed to resolve.");
        return;
      }

      let deleteBody: deleteSolutionReportType = {
        reportId: report.reportId,
      };
      let deleteReport = await axios.post(
        "/api/deleteSolutionReport",
        deleteBody
      );
      toast.success("Successfully resolved!");
    } catch {
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
        ) : report.type === "incorrectQuestionPaper" ? (
          <div>
            <label>Reported for incorrect question paper</label>
            <br />
            Admin should{" "}
            <a
              href={`https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${report.resourceId}`}
              rel="noopener noreferrer"
              target="_blank"
              className="underline"
            >
              download
            </a>{" "}
            and reupload to correct paper.
            <br />
            Or just delete it.
          </div>
        ) : (
          <div>Set up report edit function.</div>
        )}
        <div className="flex flex-row gap-2">
          <Button
            className="w-1/2"
            onClick={async () => {
              setLoading(true);
              await resolveSolutionReport(false);
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
              await resolveSolutionReport(true);
              setOpen(false);
            }}
            disabled={loading || disabled}
          >
            {report.type !== "incorrectQuestionPaper"
              ? "Edit & resolve"
              : "Delete solution"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
