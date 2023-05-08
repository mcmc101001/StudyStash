"use client";

import { useState } from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

interface DifficultyDisplayProps {
  UserDifficulty: number; // 0 to represent not rated
}

export default function RateDifficulty({
  UserDifficulty,
}: DifficultyDisplayProps) {
  const [difficulty, setDifficulty] = useState(UserDifficulty);
  const [hovered, setHovered] = useState(0);

  const handleClick = (star: number) => {
    setDifficulty(star);
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
