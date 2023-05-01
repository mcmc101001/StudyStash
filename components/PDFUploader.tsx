"use client";

import { Upload } from "lucide-react";

interface PDFUploaderProps {
  fileSelectedHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  fileName: string | null;
}

export default function PDFUploader(props: PDFUploaderProps) {
  return (
    <div
      className="flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-indigo-600"
      onClick={() => props.inputRef.current?.click()}
    >
      <input
        type="file"
        accept=".pdf"
        ref={props.inputRef}
        onChange={(e) => props.fileSelectedHandler(e)}
        hidden={true}
      ></input>
      <Upload className="text-indigo-600" size={70} />
      <span className="text-center text-indigo-600">
        {props.fileName || "Select file"}
      </span>
    </div>
  );
}
