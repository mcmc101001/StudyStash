"use client";

import {
  CheatsheetComment,
  CheatsheetReply,
  NotesComment,
  NotesReply,
  QuestionPaperComment,
  QuestionPaperReply,
  User,
} from "@prisma/client";
import ReplyItem from "./ReplyItem";
import Image from "next/image";
import { MessageCircle, Reply } from "lucide-react";
import { useRef, useState } from "react";
import { setInputHeight } from "./AddCommentSection";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addReplyType } from "@/pages/api/addReply";
import axios from "axios";
import { ResourceSolutionType } from "@/lib/content";
import Button from "./ui/Button";

interface CommentItemProps {
  category: ResourceSolutionType;
  currentUser: User | null;
  comment:
    | (CheatsheetComment & {
        user: User;
        replies: (CheatsheetReply & {
          user: User;
        })[];
      })
    | (QuestionPaperComment & {
        replies: (QuestionPaperReply & {
          user: User;
        })[];
        user: User;
      })
    | (NotesComment & {
        replies: (NotesReply & {
          user: User;
        })[];
        user: User;
      });
}

export default function CommentItem({
  category,
  currentUser,
  comment,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showOwnReply, setShowOwnReply] = useState(false);

  const [replyValue, setReplyValue] = useState("");
  let inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  let router = useRouter();

  async function handleClick() {
    if (!currentUser) {
      toast.error("Please log in first!");
      return;
    }
    const reply = replyValue.trim();
    if (reply === "") {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsLoading(true);
    let body: addReplyType = {
      category: category,
      content: reply,
      commentId: comment.id,
      userId: currentUser.id,
    };
    try {
      const res = await axios.post("/api/addReply", body);
      toast.success("Reply uploaded successfully!");
      setShowOwnReply(false);
      setShowReplies(true);
      setReplyValue("");
      setInputHeight(inputRef, 105);
    } catch (error) {
      toast.error("Error uploading comment.");
    }
    setIsLoading(false);
    router.refresh();
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-col p-3">
        <div className="flex w-full items-center gap-3">
          <Image
            loading="lazy"
            src={comment.user.image!}
            alt={comment.user.name ?? "profile image"}
            referrerPolicy="no-referrer"
            className="h-12 w-12 rounded-full"
            width={40}
            height={40}
          />
          <div>
            <p className="truncate text-lg font-medium">{comment.user.name}</p>
          </div>
          <div className="flex flex-1 justify-end text-sm font-light text-slate-700">
            {comment.createdAt.toUTCString()}
          </div>
        </div>
        <p className="mt-2 whitespace-break-spaces break-words">
          {comment.content}
        </p>
        <div className="mt-3 flex gap-x-4 text-slate-600">
          {comment.replies.length !== 0 && (
            <div
              className="flex items-center gap-x-1"
              role="button"
              onClick={() => setShowReplies(!showReplies)}
            >
              <MessageCircle />
              {showReplies
                ? "Hide replies"
                : `Show replies (${comment.replies.length})`}
            </div>
          )}
          <div
            className="flex items-center gap-x-1"
            role="button"
            onClick={() => {
              if (!currentUser) {
                toast.error("Please log in first!");
              } else {
                setShowOwnReply(!showOwnReply);
              }
            }}
          >
            <Reply /> Reply
          </div>
        </div>
      </div>
      {showOwnReply && (
        <>
          <div className="ml-10 flex">
            <Image
              loading="lazy"
              src={currentUser ? currentUser.image! : ""}
              alt={currentUser ? currentUser.name ?? "profile image" : ""}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full"
              width={40}
              height={40}
            />
            <div className="ml-2 flex w-full flex-col rounded-md bg-slate-200 shadow-md dark:bg-slate-800 dark:text-slate-200">
              <textarea
                placeholder="Type comment here..."
                spellCheck={false}
                autoComplete="off"
                value={replyValue}
                ref={inputRef}
                className="min-h-[105px] w-full resize-none overflow-hidden rounded-xl bg-slate-200 p-4 text-slate-800 outline-none scrollbar-none dark:bg-slate-800 dark:text-slate-200 dark:caret-white"
                onChange={() => {
                  setReplyValue(inputRef.current?.value || "");
                  setInputHeight(inputRef, 105);
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              isLoading={isLoading}
              disabled={replyValue.trim() === ""}
              onClick={() => handleClick()}
            >
              Comment
            </Button>
          </div>
        </>
      )}
      <ul className={showReplies ? "" : "hidden"}>
        {comment.replies.map((reply) => {
          return (
            <li className="ml-10 mt-2">
              <ReplyItem reply={reply} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
