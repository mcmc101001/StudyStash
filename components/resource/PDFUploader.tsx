"use client";

import { UploadCloud } from "lucide-react";

interface PDFUploaderProps {
  fileSelectedHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  fileDropHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  fileName: string | null;
  label: string;
}

export default function PDFUploader(props: PDFUploaderProps) {
  return (
    <div
      aria-label="PDF drop area"
      className="flex h-full min-h-[16rem] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-indigo-600 py-10 dark:border-indigo-500"
      onClick={() => props.inputRef.current?.click()}
      onDrop={(e) => props.fileDropHandler(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept=".pdf"
        ref={props.inputRef}
        onChange={(e) => props.fileSelectedHandler(e)}
        hidden={true}
      ></input>
      <UploadCloud className="text-indigo-600 dark:text-indigo-500" size={70} />
      <span className="mt-2 max-w-[70%] truncate text-center text-xl text-indigo-600 dark:text-indigo-500">
        {props.fileName || props.label}
      </span>
    </div>
  );
}