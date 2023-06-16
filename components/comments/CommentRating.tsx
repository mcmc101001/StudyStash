"use client";

import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { ResourceSolutionType } from "@/lib/content";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateCommentVoteType } from "@/pages/api/updateCommentVote";

interface CommentRatingProps {
  category: ResourceSolutionType;
  commentId: string;
  currentUserId: string | null;
  rating: number;
  userRating: boolean | null;
}

export default function CommentRating({
  category,
  commentId,
  currentUserId,
  rating,
  userRating,
}: CommentRatingProps) {
  async function updateCommentVote(value: boolean | null) {
    if (!currentUserId) {
      return null;
    }
    let body: updateCommentVoteType = {
      category: category,
      commentId: commentId,
      userId: currentUserId,
      value: value,
    };
    let req = await axios.post("/api/updateCommentVote", body);
    return req;
  }

  let router = useRouter();

  let [ratingState, setRatingState] = useState(rating);
  let [userRatingState, setUserRatingState] = useState(userRating);

  const handleUpvote = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // stops button click from propogating up parent
    // not logged in
    if (currentUserId === null) {
      toast.error("You must be logged in to vote!");
      return;
    }
    if (userRatingState === true) {
      setRatingState(ratingState - 1);
      setUserRatingState(null);
      try {
        let req = await updateCommentVote(null);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else if (userRatingState === false) {
      setRatingState(ratingState + 2);
      setUserRatingState(true);
      try {
        let req = await updateCommentVote(true);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else {
      setRatingState(ratingState + 1);
      setUserRatingState(true);
      try {
        let req = await updateCommentVote(true);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    }
    router.refresh();
  };

  const handleDownvote = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (currentUserId === null) {
      toast.error("You must be logged in to vote!");
      return;
    }
    if (userRatingState === true) {
      setRatingState(ratingState - 2);
      setUserRatingState(false);
      try {
        let req = await updateCommentVote(false);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else if (userRatingState === false) {
      setRatingState(ratingState + 1);
      setUserRatingState(null);
      try {
        let req = await updateCommentVote(null);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else {
      setRatingState(ratingState - 1);
      setUserRatingState(false);
      try {
        let req = await updateCommentVote(false);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    }
    router.refresh();
  };

  return (
    <div className="flex flex-row items-center gap-x-1">
      <div className="cursor-pointer" onClick={(e) => handleUpvote(e)}>
        <ArrowBigUp
          className={
            " " +
            (userRatingState === true
              ? "fill-orange-500 text-orange-500 hover:fill-orange-600 hover:text-orange-600"
              : "fill-none hover:text-orange-500")
          }
        />
      </div>
      {/* Format total rating to 3K, 2.2M, etc version */}
      {Intl.NumberFormat("en-GB", { notation: "compact" }).format(ratingState)}
      <div className="cursor-pointer" onClick={(e) => handleDownvote(e)}>
        <ArrowBigDown
          className={
            " " +
            (userRatingState === false
              ? "fill-blue-600 text-blue-600 hover:fill-blue-700 hover:text-blue-700"
              : "fill-none hover:text-blue-600")
          }
        />
      </div>
    </div>
  );
}
