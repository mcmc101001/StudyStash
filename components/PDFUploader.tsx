/*
 * Please note: TO CHANGE
 * Use unique file id as key to upload file
 * Take note
 */

"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRef } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "./ui/Button";

const MAX_FILE_SIZE = 10485760; // 10Mb

const cleanup = function (str: string) {
  return str.replace(/[^a-zA-Z0-9_.{}\- ]/g, "-");
};

export default function PDFUploader() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileSelectedHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setFile(e.currentTarget.files[0]);
      setFileName(e.currentTarget.files[0].name);
      if (e.currentTarget.files[0].type != "application/pdf") {
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

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsDisabled(true);
    e.preventDefault();
    if (!file || file.type != "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    } else {
      const safeFileName = cleanup(file.name);
      try {
        let { data } = await axios.post("/api/addPDF", {
          name: safeFileName,
          type: file.type,
        });

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
        console.log(error);
        toast.error("Error uploading PDF.");
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setFileName(null);
      setFile(null);
      setIsDisabled(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-start">
      <form
        id="pdfUploader"
        className="flex flex-col justify-center items-center border-dashed border-2 border-indigo-600 rounded-md h-60 w-96 cursor-pointer"
        onSubmit={(e) => uploadFile(e)}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf"
          ref={inputRef}
          onChange={(e) => fileSelectedHandler(e)}
          hidden={true}
        ></input>
        <Upload className="text-indigo-600" size={70} />
        <span className="text-indigo-600">{fileName || "Select file"}</span>
      </form>
      <section className="w-full mt-4 flex flex-row justify-between items-center">
        <Button
          size="sm"
          variant="default"
          isLoading={isDisabled}
          type="submit"
          form="pdfUploader"
        >
          Upload
        </Button>
        <Trash2
          className="text-slate-800 dark:text-slate-200 cursor-pointer"
          size={20}
          onClick={() => {
            setFileName(null);
            setFile(null);
            setIsDisabled(false);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        />
      </section>
    </div>
  );
}
