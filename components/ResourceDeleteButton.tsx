"use client";

import { ResourceType } from "@/lib/content";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ResourceDeleteButtonProps {
  resourceId: string;
  category: ResourceType;
}

export default function ResourceDeleteButton({
  resourceId,
  category,
}: ResourceDeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async function () {
    try {
      const res = await axios.post("/api/deleteS3Object", {
        id: resourceId,
      });
      try {
        await axios.post("/api/deletePDF", {
          id: resourceId,
          category: category,
        });
      } catch (error) {
        toast.error("Error deleting resource, please try again later.");
        return;
      }
    } catch (error) {
      toast.error("Error deleting resource, please try again later.");
      return;
    }
    router.refresh;
  };

  return (
    <Trash2
      onClick={() => handleDelete()}
      height={30}
      width={30}
      className="cursor-pointer"
    />
  );
}
