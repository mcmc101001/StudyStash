"use client";

import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PDFUploader from "@/components/resource/PDFUploader";
import Button from "@/components/ui/Button";
import { Trash2, Upload } from "lucide-react";
import { generateS3PutURLType } from "@/pages/api/generateS3PutURL";
import { deletePDFType } from "@/pages/api/deletePDF";
import { addSolutionPDFType } from "@/pages/api/addSolutionPDF";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10485760; // 10Mb

interface ContributeSolutionProps {
  currentUserId: string;
  questionPaperId: string;
}

export default function ContributeSolutionDialog({
  currentUserId,
  questionPaperId,
}: ContributeSolutionProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let router = useRouter();

  const fileSelectedHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setFile(e.currentTarget.files[0]);
      setFileName(e.currentTarget.files[0].name);
      if (e.currentTarget.files[0].type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        // Set submit to disabled
        setIsDisabled(true);
      } else if (e.currentTarget.files[0].size > MAX_FILE_SIZE) {
        toast.error("Max file size: 10Mb");
        // Set submit to disabled
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  };

  const fileDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
      if (e.dataTransfer.files[0].type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        // Set submit to disabled
        setIsDisabled(true);
      } else if (e.dataTransfer.files[0].size > MAX_FILE_SIZE) {
        toast.error("Max file size: 10Mb");
        // Set submit to disabled
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  };

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsDisabled(true);
    e.preventDefault();

    if (!file || !fileName || file.type != "application/pdf") {
      toast.error("Please upload a PDF file");
      setIsDisabled(false);
      return;
    }

    // if file name exceeds length of varchar(191) in mysql
    if (fileName.length > 191) {
      toast.error("File name too long!");
      setIsDisabled(false);
      return;
    }

    try {
      const newFileName = fileName.replace(/\.[^/.]+$/, "");
      let body: addSolutionPDFType = {
        name: newFileName,
        userId: currentUserId,
        questionPaperId: questionPaperId,
      };
      let { data } = await axios.post("/api/addSolutionPDF", body);

      const solutionId = data.SolutionEntry.id;

      // If prisma does not return ID for some reason
      if (!solutionId) {
        toast.error("Error uploading PDF.");
        setIsDisabled(false);
        return;
      }
      try {
        let body: generateS3PutURLType = {
          userId: currentUserId,
          name: solutionId,
        };
        let { data } = await axios.post("/api/generateS3PutURL", body);

        const url = data.url;

        await axios.put(url, file, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline",
            "Access-Control-Allow-Origin": "*",
          },
        });

        toast.success("PDF uploaded successfully");
      } catch (error) {
        // Delete the database entry if s3 upload fails
        try {
          let body: deletePDFType = {
            userId: currentUserId,
            id: solutionId,
            category: "Solutions",
          };
          await axios.post("/api/deletePDF", body);
        } catch (error) {
          toast.error("Error uploading PDF.");
          setIsDisabled(false);
          return;
        }
        toast.error("Error uploading PDF.");
        setIsDisabled(false);
        return;
      }
    } catch (error) {
      toast.error("Error uploading PDF.");
      setIsDisabled(false);
      return;
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFileName(null);
    setFile(null);
    setIsOpen(false);
    setIsDisabled(false);
    router.refresh();
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="border border-slate-800 dark:border-slate-200"
        >
          Submit solution
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Submit solution</DialogTitle>
        </DialogHeader>
        <div className="inline-block">
          <form
            id="contributeForm"
            onSubmit={(e) => uploadFile(e)}
            className="flex h-full w-full items-center justify-center"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-3 pt-7">
              <PDFUploader
                fileDropHandler={fileDropHandler}
                fileSelectedHandler={fileSelectedHandler}
                fileName={fileName}
                inputRef={inputRef}
                label="Select or drop pdf file"
              />
              <section className="flex w-full flex-row items-center justify-between gap-2">
                <Button
                  variant="dangerous"
                  type="button"
                  className="w-1/2 gap-1 text-lg"
                  onClick={() => {
                    setFileName(null);
                    setFile(null);
                    setIsDisabled(false);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  <Trash2 size={25} /> <p>Clear PDF</p>
                </Button>
                <Button
                  variant="default"
                  isLoading={isDisabled}
                  type="submit"
                  form="contributeForm"
                  className="w-1/2 gap-1 text-lg"
                >
                  <Upload size={25} /> <p>Upload</p>
                </Button>
              </section>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
