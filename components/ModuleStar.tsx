"use client";

import axios from "axios";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { updateStarredModuleType } from "@/pages/api/updateStarredModule";
import { toast } from "react-hot-toast";

interface ModuleStarProps {
  moduleCode: string;
  userId: string;
  starred: boolean;
}

export default function ModuleStar({
  moduleCode,
  userId,
  starred,
}: ModuleStarProps) {
  const [star, setStar] = useState(starred);

  const handleClick = async () => {
    setStar(!star);
    try {
      const res = await axios.post("/api/updateStarredModule", {
        moduleCode: moduleCode,
        userId: userId,
        value: !star,
      } as updateStarredModuleType);
    } catch (error) {
      toast.error("Error updating starred module, please try again later.");
    }
  };

  return (
    <StarIcon
      onClick={handleClick}
      className={
        "h-8 w-8 cursor-pointer text-slate-900 dark:text-slate-100 " +
        (star
          ? "fill-slate-900 dark:fill-slate-100"
          : "hover:fill-slate-300 dark:hover:fill-slate-700")
      }
    />
  );
}
