import { prisma } from "@/lib/prisma";
import { BsStarFill } from "react-icons/bs";

interface DifficultyBreakdownProps {
  resourceId: string;
  difficulty: number;
  difficultyCount: number;
}

export default async function DifficultyBreakdown({
  resourceId,
  difficulty,
  difficultyCount,
}: DifficultyBreakdownProps) {
  const votes = await prisma.questionPaperDifficulty.findMany({
    where: {
      resourceId: resourceId,
    },
  });
  let voteCount = [0, 0, 0, 0, 0];
  votes.forEach((vote) => {
    voteCount[vote.value - 1] += 1;
  });
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <div className="flex gap-x-1">
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
            </div>
          </td>
          <td className="pl-5">{voteCount[4]}</td>
        </tr>
        <tr>
          <td>
            <div className="flex gap-x-1">
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
            </div>
          </td>
          <td className="pl-5">{voteCount[3]}</td>
        </tr>
        <tr>
          <td>
            <div className="flex gap-x-1">
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
            </div>
          </td>
          <td className="pl-5">{voteCount[2]}</td>
        </tr>
        <tr>
          <td>
            <div className="flex gap-x-1">
              <BsStarFill />
              <BsStarFill />
            </div>
          </td>
          <td className="pl-5">{voteCount[1]}</td>
        </tr>
        <tr>
          <td>
            <div className="flex gap-x-1">
              <BsStarFill />
            </div>
          </td>
          <td className="pl-5">{voteCount[0]}</td>
        </tr>
      </tbody>
    </table>
  );
}
