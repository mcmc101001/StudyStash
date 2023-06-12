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
        inputRef.current.style.height = 105 + "px";
      }
    } catch (error) {
      toast.error("Error uploading comment.");
    }
    setIsLoading(false);
    router.refresh();
  }

  return (
    <>
      <textarea
        placeholder="Type comment here..."
        spellCheck={false}
        autoComplete="off"
        value={value}
        ref={inputRef}
        className="overflow-scroll-y min-h-[105px] w-full resize-none rounded-xl bg-slate-200 p-4 text-slate-800 shadow-md outline-none scrollbar-none dark:bg-slate-800 dark:text-slate-200 dark:caret-white"
        onChange={() => {
          setValue(inputRef.current?.value || "");
          setInputHeight(inputRef, 105);
        }}
      />
      <div className="mt-2 flex w-full justify-end">
        <Button
          variant="good"
          isLoading={isLoading}
          disabled={value.trim() === ""}
          onClick={() => handleClick()}
        >
          Comment
        </Button>
      </div>
    </>
  );
}
