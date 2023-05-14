"use client";

import { ResourceType } from "@/lib/content";
import { updateStatusType } from "@/pages/api/updateStatus";
import { ResourceStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

interface ResourceStatusComponentProps {
  category: ResourceType;
  resourceId: string;
  currentUserId: string;
  status: ResourceStatus | null;
}

export default function ResourceStatusComponent({
  category,
  resourceId,
  currentUserId,
  status,
}: ResourceStatusComponentProps) {
  async function updateStatus(status: ResourceStatus | null) {
    if (!currentUserId) {
      return null;
    }
    let body: updateStatusType = {
      category: category,
      resourceId: resourceId,
      userId: currentUserId,
      status: status,
    };
    let req = await axios.post("/api/updateStatus", body);
    return req;
  }

  let router = useRouter();

  let [statusState, setStatusState] = useState(status);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // stops button click from propogating up parent
    let req = await updateStatus(statusState);
    router.refresh();
  };

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col items-center">
        <button onClick={(e) => handleClick(e)}>Butoon</button>
      </div>
    </div>
  );
}
