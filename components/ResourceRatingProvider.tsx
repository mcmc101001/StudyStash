"use client";

import { ResourceType } from "@/lib/content";
import { atom } from "jotai";
import ResourceRating from "@/components/ResourceRating";

interface ResourceRatingProviderProps {
  category: ResourceType;
  resourceId: string;
  currentUserId: string | null;
  totalRating: number;
  userRating: boolean | null;
}

export default function ResourceRatingProvider({
  category,
  resourceId,
  currentUserId,
  totalRating,
  userRating,
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
    />
  );
}
