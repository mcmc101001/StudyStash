"use client";

import { RefObject, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addCommentType } from "@/pages/api/addComment";
import { ResourceSolutionType } from "@/lib/content";
import axios from "axios";

interface AddCommentSectionProps {
  category: ResourceSolutionType;
  resourceId: string;
  currentUserId: string | undefined;
}

export function setInputHeight(
  element: RefObject<HTMLTextAreaElement>,
  defaultHeight: number
) {
  if (element.current) {
    element.current.style.height = defaultHeight + "px";
    if (element.current.value === "") return;
    element.current.style.height =
      Math.max(element.current.scrollHeight, defaultHeight) + "px";
  }
}

export default function AddCommentSection({
  category,
  resourceId,
  currentUserId,
}: AddCommentSectionProps) {
  let inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const DEFAULT_HEIGHT = 48;

  let router = useRouter();

  async function handleClick() {
    if (!currentUserId) {
      toast.error("Please log in first!");
      return;
    }
    const comment = value.trim();
    if (comment === "") {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsLoading(true);
    let body: addCommentType = {
      category: category,
      content: comment,
      resourceId: resourceId,
      userId: currentUserId,
    };
    try {
      const res = await axios.post("/api/addComment", body);
      toast.success("Comment uploaded successfully!");
      setValue("");
      if (inputRef.current) {
        console.log("please");
        inputRef.current.style.height = DEFAULT_HEIGHT + "px";
      }
    } catch (error) {
      toast.error("Error uploading comment.");
    }
    setIsLoading(false);
    router.refresh();
  }

  return (
    <div className="w-full rounded-xl bg-slate-200 p-4 shadow-md dark:bg-slate-800">
      <textarea
        placeholder="Type comment here..."
        spellCheck={false}
        autoComplete="off"
        value={value}
        ref={inputRef}
        className={`overflow-scroll-y min-h-[${DEFAULT_HEIGHT}px] w-full resize-none bg-slate-200 text-slate-800 outline-none scrollbar-none dark:bg-slate-800 dark:text-slate-200 dark:caret-white`}
        onChange={() => {
          setValue(inputRef.current?.value || "");
          setInputHeight(inputRef, DEFAULT_HEIGHT);
        }}
      />
      <div className="flex w-full justify-end">
        <Button
          variant="good"
          isLoading={isLoading}
          disabled={value.trim() === ""}
          onClick={() => handleClick()}
          className="rounded-xl"
        >
          Comment
        </Button>
      </div>
    </div>
  );
}
