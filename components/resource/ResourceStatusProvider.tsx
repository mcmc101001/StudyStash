"use client";

import { ResourceSolutionType } from "@/lib/content";
import { atom } from "jotai";

import ResourceStatusComponent from "@/components/resource/ResourceStatusComponent";
import { ResourceStatus } from "@prisma/client";
interface ResourceStatusProviderProps {
  category: ResourceSolutionType;
  resourceId: string;
  currentUserId: string;
  userStatus: ResourceStatus | null;
}

export default function ResourceStatusProvider({
  category,
  resourceId,
  currentUserId,
  userStatus,
}: ResourceStatusProviderProps) {
  const resourceStatusAtom = atom<ResourceStatus | null>(userStatus);

  return (
    <ResourceStatusComponent
      category={category}
      resourceId={resourceId}
      currentUserId={currentUserId}
      resourceStatusAtom={resourceStatusAtom}
    />
  );
}
