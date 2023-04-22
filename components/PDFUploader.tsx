/*
 * Please note: TO CHANGE
 * Use unique file id as key to upload file
 * Take note
 */

"use client";

import { FC } from "react";
import { Upload } from "lucide-react";

interface PDFUploaderProps {
  fileSelectedHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  fileName: string | null;
}

const PDFUploader: FC<PDFUploaderProps> = (props) => {
  return (
    <div
      className="flex flex-col justify-center items-center border-dashed border-2 border-indigo-600 rounded-md h-60 w-full cursor-pointer"
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
      <span className="text-indigo-600">{props.fileName || "Select file"}</span>
    </div>
  );
};

export default PDFUploader;
