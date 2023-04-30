"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { ResourceType } from "@/lib/content";
import axios from "axios";
import { updateVoteType } from "@/pages/api/updateVote";
import { toast } from "react-hot-toast";

interface RatingProps {
  category: ResourceType;
  resourceId: string;
  currentUserId: string | null;
  totalRating: number;
  userRating: boolean | null;
}

export default function Rating({
  category,
  resourceId,
  currentUserId,
  totalRating,
  userRating,
}: RatingProps) {
  let [ratingState, setRatingState] = useState(totalRating);
  let [userRatingState, setUserRatingState] = useState(userRating);

  const handleUpvote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // stops button click from propogating up parent
    // not logged in
    if (currentUserId === null) {
      toast.error("You must be logged in to vote!");
      return;
    }
    if (userRatingState === true) {
      setRatingState(ratingState - 1);
      setUserRatingState(null);
      let req = await axios.post("/api/updateVote", {
        category: category,
        resourceId: resourceId,
        userId: currentUserId,
        value: null,
      } as updateVoteType);
    } else if (userRatingState === false) {
      setRatingState(ratingState + 2);
      setUserRatingState(true);
      let req = await axios.post("/api/updateVote", {
        category: category,
        resourceId: resourceId,
        userId: currentUserId,
        value: true,
      } as updateVoteType);
    } else {
      setRatingState(ratingState + 1);
      setUserRatingState(true);
      let req = await axios.post("/api/updateVote", {
        category: category,
        resourceId: resourceId,
        userId: currentUserId,
        value: true,
      } as updateVoteType);
    }
  };

  const handleDownvote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentUserId === null) {
      toast.error("You must be logged in to vote!");
      return;
    }
    if (userRatingState === true) {
      setRatingState(ratingState - 2);
      setUserRatingState(false);
      let req = await axios.post("/api/updateVote", {
        category: category,
        resourceId: resourceId,
        userId: currentUserId,
        value: false,
      } as updateVoteType);
    } else if (userRatingState === false) {
      setRatingState(ratingState + 1);
      setUserRatingState(null);
      let req = await axios.post("/api/updateVote", {
        category: category,
        resourceId: resourceId,
        userId: currentUserId,
        value: null,
      } as updateVoteType);
    } else {
      setRatingState(ratingState - 1);
      setUserRatingState(false);
      let req = await axios.post("/api/updateVote", {
        category: category,
        resourceId: resourceId,
        userId: currentUserId,
        value: false,
      } as updateVoteType);
    }
  };

  return (
    <div className="flex flex-row items-center font-light">
      <div className="flex flex-col items-center">
        <button onClick={(e) => handleUpvote(e)}>
          <ArrowBigUp
            className={
              " " +
              (userRatingState === true
                ? "fill-orange-500 text-orange-500"
                : "fill-none hover:text-orange-500")
            }
          />
        </button>
        {Intl.NumberFormat("en-GB", { notation: "compact" }).format(
          ratingState
        )}
        <button onClick={(e) => handleDownvote(e)}>
          <ArrowBigDown
            className={
              " " +
              (userRatingState === false
                ? "fill-blue-600 text-blue-600"
                : "fill-none hover:text-blue-600")
            }
          />
        </button>
      </div>
      {/* Format total rating to 3K, 2.2M, etc version */}
    </div>
  );
}
