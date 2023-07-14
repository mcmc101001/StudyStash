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
import { Edit, MessageCircle, Reply, Trash2, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { setInputHeight } from "@/components/comments/AddCommentSection";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addReplyType } from "@/pages/api/addReply";
import axios from "axios";
import { ResourceSolutionType } from "@/lib/content";
import Button from "@/components/ui/Button";
import ProfileVerifiedIndicator from "@/components/user/ProfileVerifiedIndicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { deleteCommentType } from "@/pages/api/deleteComment";
import { editCommentType } from "@/pages/api/editComment";
import { formatTimeAgo } from "@/lib/utils";
import { deleteReplyType } from "@/pages/api/deleteReply";
import CommentRating from "@/components/comments/CommentRating";
import ReplyRating from "@/components/comments/ReplyRating";
import { editReplyType } from "@/pages/api/editReply";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import ClientDateTime from "@/components/ClientDateTime";
import Link from "next/link";
import ReportCommentIcon from "@/components/comments/ReportCommentIcon";

const DEFAULT_HEIGHT = 48;

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
  const [isEditMode, setIsEditMode] = useState(false);

  const [replyValue, setReplyValue] = useState("");
  const [editValue, setEditValue] = useState(comment.content);
  let inputRef = useRef<HTMLTextAreaElement>(null);
  let editRef = useRef<HTMLTextAreaElement>(null);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setInputHeight(editRef, DEFAULT_HEIGHT);
  });

  let router = useRouter();

  async function handleClickReply() {
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
        inputRef.current.style.height = DEFAULT_HEIGHT + "px";
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

  async function handleClickEdit() {
    if (!currentUser) {
      toast.error("Please log in first!");
      return;
    }
    const edit = editValue.trim();
    if (edit === "") {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsEditLoading(true);
    let body: editCommentType = {
      category: category,
      content: editValue,
      commentId: comment.id,
      userId: currentUser.id,
    };
    try {
      const res = await axios.post("/api/editComment", body);
      toast.success("Comment edited successfully!");
      if (editRef.current) {
        editRef.current.style.height = DEFAULT_HEIGHT + "px";
      }
    } catch (error) {
      toast.error("Error uploading comment.");
    }
    router.refresh();
    setIsEditLoading(false);
    setIsEditMode(false);
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

  if (
    comment.isDeleted &&
    comment.replies.filter((reply) => !reply.isDeleted).length === 0
  ) {
    return null;
  }

  return (
    <>
      <div className="flex w-full flex-col overflow-hidden p-3 text-slate-800 dark:text-slate-200">
        <div className="flex w-full items-center gap-3">
          {comment.isDeleted ? (
            <UserIcon className="h-12 w-12 rounded-full" />
          ) : (
            <Image
              loading="lazy"
              src={comment.user.image!}
              alt={comment.user.name ?? "profile image"}
              referrerPolicy="no-referrer"
              className="h-12 w-12 rounded-full"
              width={40}
              height={40}
            />
          )}
          <div className="flex items-center overflow-x-hidden">
            {comment.isDeleted ? (
              <span>deleted</span>
            ) : (
              <>
                <Link
                  href={`/profile/${comment.user.id}`}
                  className="truncate text-lg font-medium hover:text-violet-700 dark:hover:text-violet-500"
                >
                  {comment.user.name}
                </Link>
                {comment.user.verified && <ProfileVerifiedIndicator />}
              </>
            )}
          </div>
          <div className="flex w-full min-w-fit flex-1 justify-end text-left text-sm font-light text-slate-700 scrollbar-none hover:underline dark:text-slate-400">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger className="cursor-text hover:underline">
                  {formatTimeAgo(comment.createdAt)}{" "}
                  {comment.isEdited && comment.editedAt && "(Edited)"}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Commented: <ClientDateTime datetime={comment.createdAt} />
                  </p>
                  {comment.isEdited && comment.editedAt && (
                    <p>
                      Last Edited:{" "}
                      <ClientDateTime datetime={comment.editedAt} />
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div
          className={
            "mt-2 h-full w-full rounded-xl " +
            (isEditMode
              ? "bg-slate-200 p-4 dark:bg-slate-800"
              : "bg-transparent")
          }
        >
          {isEditMode ? (
            <textarea
              placeholder="Type comment here..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
              value={isEditMode ? editValue : comment.content}
              ref={editRef}
              className={
                `min-h-[${DEFAULT_HEIGHT}px] w-full resize-none overflow-hidden text-slate-800 outline-none scrollbar-none dark:text-slate-200 dark:caret-white ` +
                (isEditMode
                  ? "bg-slate-200 dark:bg-slate-800"
                  : "cursor-text bg-transparent")
              }
              onChange={() => {
                setEditValue(editRef.current?.value || "");
              }}
              disabled={!isEditMode}
            />
          ) : (
            <p className="whitespace-break-spaces break-words">
              {comment.isDeleted ? (
                <span className="italic">This comment is deleted</span>
              ) : (
                comment.content
              )}
            </p>
          )}
          {isEditMode && (
            <div className="mt-2 flex w-full justify-end gap-x-2">
              <Button
                onClick={() => {
                  setIsEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="good"
                isLoading={isEditLoading}
                disabled={editValue.trim() === ""}
                onClick={() => {
                  handleClickEdit();
                }}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
        <div className="mt-3 flex w-full gap-x-3 text-slate-500 @container dark:text-slate-400">
          {comment.isDeleted === false && (
            <CommentRating
              commentId={comment.id}
              category={category}
              currentUserId={currentUser?.id ?? null}
              rating={comment.rating}
              userRating={comment.userRating}
            />
          )}
          {comment.replies.length !== 0 && (
            <div
              className="flex select-none items-center gap-x-1 hover:text-slate-700 dark:hover:text-slate-300"
              role="button"
              onClick={() => setShowReplies(!showReplies)}
            >
              <MessageCircle />
              <span className="hidden overflow-clip text-sm @md:inline @lg:text-base">
                {showReplies
                  ? "Hide replies"
                  : `Show replies (${
                      comment.replies.filter((comment) => !comment.isDeleted)
                        .length
                    })`}
              </span>
            </div>
          )}
          <div
            className={
              "flex select-none items-center gap-x-1 " +
              (showOwnReply
                ? "text-slate-700 dark:text-slate-300"
                : "hover:text-slate-700 dark:hover:text-slate-300")
            }
            role="button"
            onClick={() => {
              if (!currentUser) {
                toast.error("Please log in first!");
              } else {
                setShowOwnReply(!showOwnReply);
              }
            }}
          >
            <Reply />
            <span className="hidden text-sm @md:inline @lg:text-base">
              Reply
            </span>
          </div>
          {currentUser?.id === comment.user.id &&
            comment.isDeleted === false && (
              <>
                <DeleteDialog
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  isDeleteLoading={isDeleteLoading}
                  handleDelete={handleDelete}
                />
                <div
                  className={
                    "flex select-none items-center gap-x-1 " +
                    (isEditMode
                      ? "text-green-600 dark:text-green-400"
                      : "hover:text-slate-700 dark:hover:text-slate-300")
                  }
                  role="button"
                  onClick={() => {
                    if (!currentUser) {
                      toast.error("Please log in first!");
                    } else {
                      setIsEditMode(!isEditMode);
                    }
                  }}
                >
                  <Edit />{" "}
                  <span className="hidden text-sm @md:inline @lg:text-base">
                    Edit
                  </span>
                </div>
              </>
            )}{" "}
          {currentUser?.id !== comment.user.id &&
            comment.isDeleted === false && (
              <ReportCommentIcon
                resourceCategory={category}
                reporterId={currentUser?.id}
                commentId={comment.id}
                isReply={false}
              />
            )}
        </div>
      </div>
      {showOwnReply && (
        <>
          <div className="flex pl-4 pt-2">
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
                autoFocus
                autoComplete="off"
                value={replyValue}
                ref={inputRef}
                className={`min-h-[${DEFAULT_HEIGHT}px] w-full resize-none overflow-hidden rounded-xl bg-slate-200 p-4 text-slate-800 
                outline-none scrollbar-none dark:bg-slate-800 dark:text-slate-200 dark:caret-white`}
                onChange={() => {
                  setReplyValue(inputRef.current?.value || "");
                  setInputHeight(inputRef, DEFAULT_HEIGHT);
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex w-full justify-end gap-x-2">
            <Button
              onClick={() => {
                setEditValue(comment.content);
                setShowOwnReply(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="good"
              isLoading={isReplyLoading}
              disabled={replyValue.trim() === ""}
              onClick={() => handleClickReply()}
            >
              Reply
            </Button>
          </div>
        </>
      )}
      {showReplies &&
        comment.replies.map((reply) => {
          return (
            <ReplyItem
              key={reply.id}
              category={category}
              currentUser={currentUser}
              reply={reply}
            />
          );
        })}
    </>
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [editValue, setEditValue] = useState(reply.content);
  const [isEditLoading, setIsEditLoading] = useState(false);
  let editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInputHeight(editRef, DEFAULT_HEIGHT);
  });

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

  async function handleClickEdit() {
    if (!currentUser) {
      toast.error("Please log in first!");
      return;
    }
    const edit = editValue.trim();
    if (edit === "") {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsEditLoading(true);
    let body: editReplyType = {
      category: category,
      content: editValue,
      replyId: reply.id,
      userId: currentUser.id,
    };
    try {
      const res = await axios.post("/api/editReply", body);
      toast.success("Reply edited successfully!");
      if (editRef.current) {
        editRef.current.style.height = DEFAULT_HEIGHT + "px";
      }
    } catch (error) {
      toast.error("Error editing reply.");
    }
    router.refresh();
    setIsEditLoading(false);
    setIsEditMode(false);
  }

  if (reply.isDeleted) {
    return null;
  }

  return (
    <div className="flex w-full pl-4 pt-2 text-slate-800 @container dark:text-slate-200">
      <Image
        loading="lazy"
        src={reply.user.image!}
        alt={reply.user.name ?? "profile image"}
        referrerPolicy="no-referrer"
        className="h-8 w-8 rounded-full"
        width={40}
        height={40}
      />
      <div className="ml-2 flex w-full flex-col rounded-xl bg-slate-200 p-4 dark:bg-slate-800">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center overflow-x-hidden">
            <Link
              href={`/profile/${reply.user.id}`}
              className="truncate text-lg font-medium hover:text-violet-700 dark:hover:text-violet-500"
            >
              {reply.user.name}
            </Link>
            {reply.user.verified && <ProfileVerifiedIndicator />}
          </div>
          <div className="flex w-full min-w-fit flex-1 justify-end text-left text-sm font-light text-slate-700 scrollbar-none dark:text-slate-400">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger className="cursor-text hover:underline">
                  {formatTimeAgo(reply.createdAt)}{" "}
                  {reply.isEdited && reply.editedAt && "(Edited)"}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Replied: <ClientDateTime datetime={reply.createdAt} />
                  </p>
                  {reply.isEdited && reply.editedAt && (
                    <p>
                      Last Edited: <ClientDateTime datetime={reply.editedAt} />
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div
          className={
            "mt-2 h-full w-full rounded-xl " +
            (isEditMode ? "bg-slate-200 dark:bg-slate-800" : "bg-transparent")
          }
        >
          {isEditMode ? (
            <textarea
              placeholder="Type reply here..."
              spellCheck={false}
              autoComplete="off"
              value={isEditMode ? editValue : reply.content}
              ref={editRef}
              autoFocus
              className={
                `min-h-[${DEFAULT_HEIGHT}px] w-full resize-none overflow-hidden text-slate-800 outline-none scrollbar-none dark:text-slate-200 dark:caret-white ` +
                (isEditMode
                  ? "bg-slate-200 dark:bg-slate-800"
                  : "cursor-text bg-transparent")
              }
              onChange={() => {
                setEditValue(editRef.current?.value || "");
              }}
              disabled={!isEditMode}
            />
          ) : (
            <p className="whitespace-break-spaces break-words">
              {reply.content}
            </p>
          )}
          {isEditMode && (
            <div className="mt-2 flex w-full justify-end gap-x-2">
              <Button
                onClick={() => {
                  setIsEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="good"
                isLoading={isEditLoading}
                disabled={editValue.trim() === ""}
                onClick={() => {
                  handleClickEdit();
                }}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-x-3 text-slate-500 dark:text-slate-400">
          <ReplyRating
            replyId={reply.id}
            category={category}
            currentUserId={currentUser?.id ?? null}
            rating={reply.rating}
            userRating={reply.userRating}
          />
          {currentUser?.id === reply.user.id ? (
            <>
              <DeleteDialog
                isDeleteDialogOpen={isDeleteDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                isDeleteLoading={isDeleteLoading}
                handleDelete={handleDelete}
              />
              <div
                className={
                  "flex select-none items-center gap-x-1 " +
                  (isEditMode
                    ? "text-green-600 dark:text-green-400"
                    : "hover:text-slate-700 dark:hover:text-slate-300")
                }
                role="button"
                onClick={() => {
                  if (!currentUser) {
                    toast.error("Please log in first!");
                  } else {
                    setIsEditMode(!isEditMode);
                  }
                }}
              >
                <Edit />{" "}
                <span className="hidden text-sm @md:inline @lg:text-base">
                  Edit
                </span>
              </div>
            </>
          ) : (
            <ReportCommentIcon
              resourceCategory={category}
              reporterId={currentUser?.id}
              commentId={reply.id}
              isReply={true}
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
          className="flex select-none items-center gap-x-1 hover:text-slate-700 dark:hover:text-slate-300"
          role="button"
          onClick={() => {}}
        >
          <Trash2 />{" "}
          <span className="hidden text-sm @md:inline @lg:text-base">
            Delete
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <div
            data-cy="deleteCommentButtons"
            className="flex w-full gap-x-2 pt-5"
          >
            <div
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1"
            >
              <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-300">
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
