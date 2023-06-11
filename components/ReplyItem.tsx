import {
  CheatsheetReply,
  NotesReply,
  QuestionPaperReply,
  User,
} from "@prisma/client";
import Image from "next/image";
import ProfileVerifiedIndicator from "@/components/ProfileVerifiedIndicator";

interface ReplyItemProps {
  reply:
    | (CheatsheetReply & {
        user: User;
      })
    | (QuestionPaperReply & {
        user: User;
      })
    | (NotesReply & {
        user: User;
      });
}

export default function ReplyItem({ reply }: ReplyItemProps) {
  return (
    <div className="flex">
      <Image
        loading="lazy"
        src={reply.user.image!}
        alt={reply.user.name ?? "profile image"}
        referrerPolicy="no-referrer"
        className="h-8 w-8 rounded-full"
        width={40}
        height={40}
      />
      <div className="ml-2 flex w-full flex-col rounded-md bg-slate-200 p-4 dark:bg-slate-800 dark:text-slate-200">
        <div className="flex items-center">
          <div className="flex items-center">
            <p className="truncate text-lg font-medium">{reply.user.name}</p>
            {reply.user.verified && <ProfileVerifiedIndicator />}
          </div>
          <div className="flex flex-1 justify-end text-sm font-light text-slate-700">
            {reply.createdAt.toUTCString()}
          </div>
        </div>
        <p className="mt-2 whitespace-break-spaces break-words">
          {reply.content}
        </p>
      </div>
    </div>
  );
}
