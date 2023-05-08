import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

interface DifficultyDisplayProps {
  difficulty: number;
}

export default function DifficultyDisplay({
  difficulty,
}: DifficultyDisplayProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div>
        <span className="text-lg font-semibold">{difficulty} </span>
      </div>
      <div className="flex">
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
      <div>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          43 reviews
        </span>
      </div>
    </div>
  );
}
