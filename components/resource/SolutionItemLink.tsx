"use client";

import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface SolutionItemLinkProps {
  currentUserId: string | undefined;
  questionPaperId: string;
  solutionId: string;
}

export default function SolutionItemLink({
  currentUserId,
  questionPaperId,
  solutionId,
}: SolutionItemLinkProps) {
  const updateVisited = (currentUserId: string) => {
    let body = {
      userId: currentUserId,
      resourceId: solutionId,
      category: "Solutions",
    };

    try {
      const res = axios.post("/api/updateVisited", body);
    } catch {
      toast.error("Failed to update view history.");
    }
  };

  return (
    <Link
      href={`/resource/${questionPaperId}/past_papers/solutions/${solutionId}`}
      // positioned as such to prevent nesting anchor tags (use z-index to make internal link clickable)
      className="absolute inset-0 z-10"
      onClick={() => (currentUserId ? updateVisited(currentUserId) : null)}
    />
  );
}
