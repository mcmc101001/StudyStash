"use client";

import { Upload } from "lucide-react";

interface PDFUploaderProps {
  fileSelectedHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  fileDropHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  fileName: string | null;
}

export default function PDFUploader(props: PDFUploaderProps) {
  return (
    <div
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-indigo-600"
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
      <Upload className="text-indigo-600" size={70} />
      <span className="mt-2 max-w-[70%] truncate text-center text-xl text-indigo-600">
        {props.fileName || "Select or drop pdf file"}
      </span>
    </div>
  );
}
