"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

interface RatingProps {
  resourceId: string;
  userId: string;
  totalRating: number;
  userRating: boolean | null;
}

export default function Rating({
  resourceId,
  userId,
  totalRating,
  userRating,
}: RatingProps) {
  let [ratingState, setRatingState] = useState(totalRating);
  let [userRatingState, setUserRatingState] = useState(userRating);

  const handleUpvote = () => {
    if (userRatingState === true) {
      setRatingState(ratingState - 1);
      setUserRatingState(null);
    } else if (userRatingState === false) {
      setRatingState(ratingState + 2);
      setUserRatingState(true);
    } else {
      setRatingState(ratingState + 1);
      setUserRatingState(true);
    }
  };

  const handleDownVote = () => {
    if (userRatingState === true) {
      setRatingState(ratingState - 2);
      setUserRatingState(false);
    } else if (userRatingState === false) {
      setRatingState(ratingState + 1);
      setUserRatingState(null);
    } else {
      setRatingState(ratingState - 1);
      setUserRatingState(false);
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col">
        <button onClick={handleUpvote}>
          <ArrowBigUp
            className={
              " " +
              (userRatingState === true
                ? "fill-orange-500 text-orange-500"
                : "fill-none hover:text-orange-500")
            }
          />
        </button>
        <button onClick={handleDownVote}>
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
      {/* Format total rating to K, M version */}
      {Intl.NumberFormat("en-GB", { notation: "compact" }).format(ratingState)}
    </div>
  );
}
