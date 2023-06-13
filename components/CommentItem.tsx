"use client";

import {
  CheatsheetComment,
  CheatsheetCommentVote,
  CheatsheetReply,
  CheatsheetReplyVote,
  NotesComment,
  NotesCommentVote,
  NotesReply,
  NotesReplyVote,
  QuestionPaperComment,
  QuestionPaperCommentVote,
  QuestionPaperReply,
  QuestionPaperReplyVote,
  SolutionComment,
  SolutionCommentVote,
  SolutionReply,
  SolutionReplyVote,
  User,
} from "@prisma/client";
import Image from "next/image";
import { MessageCircle, Reply, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { setInputHeight } from "@/components/AddCommentSection";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addReplyType } from "@/pages/api/addReply";
import axios from "axios";
import { ResourceSolutionType } from "@/lib/content";
import Button from "@/components/ui/Button";
import ProfileVerifiedIndicator from "@/components/ProfileVerifiedIndicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { deleteCommentType } from "@/pages/api/deleteComment";
import { formatTimeAgo } from "@/lib/utils";
import { deleteReplyType } from "@/pages/api/deleteReply";
import CommentRating from "./CommentRating";
import ReplyRating from "./ReplyRating";

interface CommentItemProps {
  category: ResourceSolutionType;
  currentUser: User | null;
  comment:
    | (CheatsheetComment & {
        replies: (CheatsheetReply & {
          user: User;
          votes: CheatsheetReplyVote[];
          rating: number;
          userRating: boolean | null;
        })[];
        user: User;
        votes: CheatsheetCommentVote[];
        rating: number;
        userRating: boolean | null;
      })
    | (QuestionPaperComment & {
        replies: (QuestionPaperReply & {
          user: User;
          votes: QuestionPaperReplyVote[];
          rating: number;
          userRating: boolean | null;
        })[];
        user: User;
        votes: QuestionPaperCommentVote[];
        rating: number;
        userRating: boolean | null;
      })
    | (NotesComment & {
        replies: (NotesReply & {
          user: User;
          votes: NotesReplyVote[];
          rating: number;
          userRating: boolean | null;
        })[];
        user: User;
        votes: NotesCommentVote[];
        rating: number;
        userRating: boolean | null;
      })
    | (SolutionComment & {
        replies: (SolutionReply & {
          user: User;
          votes: SolutionReplyVote[];
          rating: number;
          userRating: boolean | null;
        })[];
        user: User;
        votes: SolutionCommentVote[];
        rating: number;
        userRating: boolean | null;
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
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    setIsReplyLoading(true);
    let body: addReplyType = {
      category: category,
      content: reply,
      commentId: comment.id,
      userId: currentUser.id,
    };
    try {
      const res = await axios.post("/api/addReply", body);
      toast.success("Reply uploaded successfully!");
      if (inputRef.current) {
        console.log("please");
        inputRef.current.style.height = 105 + "px";
      }
      setShowOwnReply(false);
      setShowReplies(true);
      setReplyValue("");
    } catch (error) {
      toast.error("Error uploading comment.");
    }
    setIsReplyLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!currentUser) {
      toast.error("Please log in first!");
      return;
    }
    setIsDeleteLoading(true);
    let body: deleteCommentType = {
      category: category,
      commentId: comment.id,
      userId: currentUser.id,
    };
    try {
      const res = await axios.post("/api/deleteComment", body);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Error deleting comment.");
    }
    setIsDeleteLoading(false);
    setIsDeleteDialogOpen(false);
    router.refresh();
  }

  return (
    <div className="w-full text-slate-800 dark:text-slate-200">
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
          <div className="flex items-center">
            <p className="truncate text-lg font-medium">{comment.user.name}</p>
            {comment.user.verified && <ProfileVerifiedIndicator />}
          </div>
          <div className="flex flex-1 justify-end text-sm font-light text-slate-700 dark:text-slate-400">
            {formatTimeAgo(comment.createdAt)}
          </div>
        </div>
        <p className="mt-2 whitespace-break-spaces break-words">
          {comment.content}
        </p>
        <div className="mt-3 flex gap-x-4 text-slate-600 dark:text-slate-400">
          <CommentRating
            commentId={comment.id}
            category={category}
            currentUserId={currentUser?.id ?? null}
            rating={comment.rating}
            userRating={comment.userRating}
          />
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
          {currentUser?.id === comment.user.id && (
            <DeleteDialog
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              isDeleteLoading={isDeleteLoading}
              handleDelete={handleDelete}
            />
          )}
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
          <div className="mt-2 flex w-full justify-end gap-x-2">
            <Button
              onClick={() => {
                setShowOwnReply(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="good"
              isLoading={isReplyLoading}
              disabled={replyValue.trim() === ""}
              onClick={() => handleClick()}
            >
              Reply
            </Button>
          </div>
        </>
      )}
      <ul className={showReplies ? "" : "hidden"}>
        {comment.replies.map((reply) => {
          return (
            <li key={reply.id} className="ml-10 mt-2">
              <ReplyItem
                category={category}
                currentUser={currentUser}
                reply={reply}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface ReplyItemProps {
  category: ResourceSolutionType;
  currentUser: User | null;
  reply:
    | (CheatsheetReply & {
        user: User;
        rating: number;
        userRating: boolean | null;
      })
    | (QuestionPaperReply & {
        user: User;
        rating: number;
        userRating: boolean | null;
      })
    | (NotesReply & {
        user: User;
        rating: number;
        userRating: boolean | null;
      });
}

function ReplyItem({ category, currentUser, reply }: ReplyItemProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  let router = useRouter();

  async function handleDelete() {
    if (!currentUser) {
      toast.error("Please log in first!");
      return;
    }
    setIsDeleteLoading(true);
    let body: deleteReplyType = {
      category: category,
      replyId: reply.id,
      userId: currentUser.id,
    };
    try {
      const res = await axios.post("/api/deleteReply", body);
      toast.success("Reply deleted successfully!");
    } catch (error) {
      toast.error("Error deleting reply.");
    }
    setIsDeleteLoading(false);
    setIsDeleteDialogOpen(false);
    router.refresh();
  }

  return (
    <div className="flex text-slate-800 dark:text-slate-200">
      <Image
        loading="lazy"
        src={reply.user.image!}
        alt={reply.user.name ?? "profile image"}
        referrerPolicy="no-referrer"
        className="h-8 w-8 rounded-full"
        width={40}
        height={40}
      />
      <div className="ml-2 flex w-full flex-col rounded-md bg-slate-200 p-4 dark:bg-slate-900">
        <div className="flex items-center">
          <div className="flex items-center">
            <p className="truncate text-lg font-medium">{reply.user.name}</p>
            {reply.user.verified && <ProfileVerifiedIndicator />}
          </div>
          <div className="flex flex-1 justify-end text-sm font-light text-slate-700 dark:text-slate-400">
            {formatTimeAgo(reply.createdAt)}
          </div>
        </div>
        <p className="mt-2 whitespace-break-spaces break-words">
          {reply.content}
        </p>
        <div className="mt-3 flex gap-x-4 text-slate-600 dark:text-slate-400">
          <ReplyRating
            replyId={reply.id}
            category={category}
            currentUserId={currentUser?.id ?? null}
            rating={reply.rating}
            userRating={reply.userRating}
          />
          {currentUser?.id === reply.user.id && (
            <DeleteDialog
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              isDeleteLoading={isDeleteLoading}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isDeleteLoading,
  handleDelete,
}: {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteLoading: boolean;
  handleDelete: () => void;
}) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger>
        <div
          className="flex items-center gap-x-1"
          role="button"
          onClick={() => {}}
        >
          <Trash2 /> Delete
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <div className="flex w-full gap-x-2 pt-5">
            <div
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1"
            >
              <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-300">
                Cancel
              </div>
            </div>
            <div className="flex-1">
              <Button
                className="w-full"
                variant="dangerous"
                isLoading={isDeleteLoading}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
