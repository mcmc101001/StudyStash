"use client";

import { ResourceSolutionType } from "@/lib/content";
import { updateStatusType } from "@/pages/api/updateStatus";
import { ResourceStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

interface ResourceStatusComponentProps {
  category: ResourceSolutionType;
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
    try {
      let req = await updateStatus(statusState);
    } catch (error) {
      console.log(error);
    }
    router.refresh();
  };

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col items-center">
        {/* Mock dropdown */}
        <div className="group relative inline-block text-left">
          <button className="mr-2 h-6 w-6 rounded-md bg-slate-950 text-slate-200">
            ✓
          </button>
          <div className="invisible absolute z-10 flex w-36 flex-col bg-slate-900 p-4 text-slate-200 group-hover:visible">
            <div className="flex">
              <div className="w-8 pr-2 text-right">✓</div> Completed
            </div>
            <div className="flex">
              <div className="w-8 pr-2 text-right">-</div>Todo
            </div>
            <div className="flex">
              <div className="w-8 pr-2 text-right">🔖</div>Bookmark
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
