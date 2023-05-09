"use client";

import { updateDifficultyType } from "@/pages/api/updateDifficulty";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsStarFill, BsStar } from "react-icons/bs";

interface DifficultyDisplayProps {
  resourceId: string;
  userDifficulty: number; // 0 to represent not rated
  currentUserId: string | null;
}

export default function RateDifficulty({
  resourceId,
  userDifficulty,
  currentUserId,
}: DifficultyDisplayProps) {
  const [difficulty, setDifficulty] = useState(userDifficulty);
  const [hovered, setHovered] = useState(0);

  const handleClick = async (star: number) => {
    if (!currentUserId) {
      toast.error("You must be logged in!");
    } else {
      if (star === difficulty) {
        setDifficulty(0);
        let req = await axios.post("/api/updateDifficulty", {
          resourceId: resourceId,
          userId: currentUserId,
          value: 0,
        } as updateDifficultyType);
        console.log(req);
      } else {
        setDifficulty(star);
        let req = await axios.post("/api/updateDifficulty", {
          resourceId: resourceId,
          userId: currentUserId,
          value: star,
        } as updateDifficultyType);
        console.log(req);
      }
    }
  };

  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex h-full w-full items-center justify-center">
      {stars.map((star) => {
        return (
          <div
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleClick(star)}
            key={star}
            className={"cursor-pointer p-1 " + (star === hovered ? "" : "")}
          >
            {hovered === 0 ? (
              star <= difficulty ? (
                <BsStarFill className={star === hovered ? "scale-125" : ""} />
              ) : (
                <BsStar />
              )
            ) : star <= hovered ? (
              <BsStarFill className={star === hovered ? "scale-125" : ""} />
            ) : (
              <BsStar />
            )}
          </div>
        );
      })}
    </div>
  );
}
