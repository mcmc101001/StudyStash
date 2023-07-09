"use client";

import { updateDifficultyType } from "@/pages/api/updateDifficulty";
import axios from "axios";
import { stagger, useAnimate } from "framer-motion";
import { useRouter } from "next/navigation";
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
  async function updateDifficulty(value: number) {
    if (!currentUserId) {
      return null;
    }
    let body: updateDifficultyType = {
      resourceId: resourceId,
      userId: currentUserId,
      value: value,
    };
    let req = await axios.post("/api/updateDifficulty", body);
    return req;
  }

  const [difficulty, setDifficulty] = useState(userDifficulty);
  const [hovered, setHovered] = useState(0);

  let router = useRouter();

  let [ref, animate] = useAnimate();

  const handleClick = async (star: number) => {
    if (!currentUserId) {
      toast.error("You must be logged in!");
    } else {
      if (star === difficulty) {
        setDifficulty(0);
        animate(
          ".star",
          { rotate: [0, -10, 10, 0], opacity: [1, 0.5, 1] },
          { duration: 0.3, delay: stagger(0.075) }
        );
        try {
          updateDifficulty(0);
        } catch (error) {
          toast.error("Error updating difficulty, please try again later.");
        }
      } else {
        setDifficulty(star);
        animate(
          ".star",
          { scale: [1, 1.25, 1] },
          { duration: 0.3, delay: stagger(0.075) }
        );
        try {
          updateDifficulty(star);
        } catch (error) {
          toast.error("Error updating difficulty, please try again later.");
        }
      }
    }
    router.refresh();
  };

  const stars = [1, 2, 3, 4, 5];
  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center">
      {stars.map((star) => {
        return (
          <div
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleClick(star)}
            key={star}
            className={
              "cursor-pointer p-[2px] " + (star <= hovered ? "star" : " ")
            }
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
