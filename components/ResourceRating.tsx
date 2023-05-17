"use client";

import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { ResourceType } from "@/lib/content";
import axios from "axios";
import { updateVoteType } from "@/pages/api/updateVote";
import { toast } from "react-hot-toast";
import { PrimitiveAtom, useAtom } from "jotai";
import { useRouter } from "next/navigation";

interface ResourceRatingProps {
  category: ResourceType;
  resourceId: string;
  currentUserId: string | null;
  ratingAtom: PrimitiveAtom<number>;
  userRatingAtom: PrimitiveAtom<boolean | null>;
}

export default function ResourceRating({
  category,
  resourceId,
  currentUserId,
  ratingAtom,
  userRatingAtom,
}: ResourceRatingProps) {
  async function updateVote(value: boolean | null) {
    if (!currentUserId) {
      return null;
    }
    let body: updateVoteType = {
      category: category,
      resourceId: resourceId,
      userId: currentUserId,
      value: value,
    };
    let req = await axios.post("/api/updateVote", body);
    return req;
  }

  let router = useRouter();

  let [ratingState, setRatingState] = useAtom(ratingAtom);
  let [userRatingState, setUserRatingState] = useAtom(userRatingAtom);

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
        let req = await updateVote(null);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else if (userRatingState === false) {
      setRatingState(ratingState + 2);
      setUserRatingState(true);
      try {
        let req = await updateVote(true);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else {
      setRatingState(ratingState + 1);
      setUserRatingState(true);
      try {
        let req = await updateVote(true);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    }
    // router.refresh();
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
        let req = await updateVote(false);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else if (userRatingState === false) {
      setRatingState(ratingState + 1);
      setUserRatingState(null);
      try {
        let req = await updateVote(null);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    } else {
      setRatingState(ratingState - 1);
      setUserRatingState(false);
      try {
        let req = await updateVote(false);
      } catch (error) {
        toast.error("Error updating vote, please try again later.");
      }
    }
    // router.refresh();
  };

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col items-center">
        <div className="cursor-pointer" onClick={(e) => handleUpvote(e)}>
          <ArrowBigUp
            className={
              " " +
              (userRatingState === true
                ? "fill-orange-500 text-orange-500"
                : "fill-none hover:text-orange-500")
            }
          />
        </div>
        {/* Format total rating to 3K, 2.2M, etc version */}
        {Intl.NumberFormat("en-GB", { notation: "compact" }).format(
          ratingState
        )}
        <div className="cursor-pointer" onClick={(e) => handleDownvote(e)}>
          <ArrowBigDown
            className={
              " " +
              (userRatingState === false
                ? "fill-blue-600 text-blue-600"
                : "fill-none hover:text-blue-600")
            }
          />
        </div>
      </div>
    </div>
  );
}
