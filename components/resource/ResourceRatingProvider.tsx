"use client";

import { ResourceSolutionType } from "@/lib/content";
import { atom } from "jotai";
import ResourceRating from "@/components/resource/ResourceRating";

interface ResourceRatingProviderProps {
  category: ResourceSolutionType;
  resourceId: string;
  currentUserId: string | null;
  totalRating: number;
  userRating: boolean | null;
  orientation?: "horizontal" | "vertical";
}

export default function ResourceRatingProvider({
  category,
  resourceId,
  currentUserId,
  totalRating,
  userRating,
  orientation = "vertical",
}: ResourceRatingProviderProps) {
  const ratingAtom = atom<number>(totalRating);
  const userRatingAtom = atom<boolean | null>(userRating);

  return (
    <ResourceRating
      category={category}
      resourceId={resourceId}
      currentUserId={currentUserId}
      ratingAtom={ratingAtom}
      userRatingAtom={userRatingAtom}
      orientation={orientation}
    />
  );
}
