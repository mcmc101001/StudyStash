"use client";

import { ResourceSolutionType, sortOptions, sortValue } from "@/lib/content";
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
import { useState } from "react";
import CommentItem from "./CommentItem";
import StyledSelect from "./ui/StyledSelect";

interface CommentsSorterProps {
  category: ResourceSolutionType;
  currentUser: User | null;
  comments:
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
      })[]
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
      })[]
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
      })[]
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
      })[];
}

export default function CommentsSorter({
  category,
  currentUser,
  comments,
}: CommentsSorterProps) {
  let sortedComments:
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
      })[]
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
      })[]
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
      })[]
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
      })[];

  const [sort, setSort] = useState<sortValue>("rating"); // default sort by rating

  if (sort === "rating") {
    sortedComments = comments.sort((a, b) => {
      return b.rating - a.rating;
    });
  } else if (sort === "rating_flip") {
    sortedComments = comments.sort((a, b) => {
      return a.rating - b.rating;
    });
  } else if (sort === "date") {
    sortedComments = comments.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } else if (sort === "date_flip") {
    sortedComments = comments.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  return (
    <>
      <div className="w-56">
        <StyledSelect
          label="Sort"
          placeholderText="Sort by"
          options={sortOptions}
          onChange={(option) =>
            setSort((option?.value as sortValue) ?? "rating")
          } // default sort by rating
          labelExists={false}
          defaultValue={sortOptions.find((option) => {
            return option.value === sort;
          })}
        />
      </div>
      <ul className="flex flex-col gap-y-2">
        {comments.map((comment) => {
          return (
            <li key={comment.id}>
              <CommentItem
                category={category}
                currentUser={currentUser}
                comment={comment}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
