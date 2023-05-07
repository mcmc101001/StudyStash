import { Star } from "lucide-react";

interface DifficultyDisplayProps {
  difficulty: number;
}

export default function DifficultyDisplay({
  difficulty,
}: DifficultyDisplayProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div>
        <span className="text-xl font-semibold">{difficulty}</span>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {" "}
          (43)
        </span>
      </div>
      <div className="flex">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star />
        <span />
      </div>
    </div>
  );
}
