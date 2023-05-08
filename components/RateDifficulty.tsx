"use client";

import { useState } from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

interface DifficultyDisplayProps {
  UserDifficulty: number; // 0 to represent not rated
}

export default function DifficultyDisplay({
  UserDifficulty,
}: DifficultyDisplayProps) {
  const [difficulty, setDifficulty] = useState(UserDifficulty);
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex h-full w-full">
      {stars.map((star) => {
        return (
          <span key={star}>
            {star <= difficulty ? (
              <BsStarFill />
            ) : star <= difficulty + 0.5 ? (
              <BsStarHalf />
            ) : (
              <BsStar />
            )}
          </span>
        );
      })}
    </div>
  );
}
