"use client";

import { ResourceType } from "@/lib/content";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteS3ObjectType } from "@/pages/api/deleteS3Object";
import { deletePDFType } from "@/pages/api/deletePDF";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Button from "./ui/Button";

interface ResourceDeleteButtonProps {
  resourceId: string;
  category: ResourceType;
}

export default function ResourceDeleteButton({
  resourceId,
  category,
}: ResourceDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async function () {
    setIsLoading(true);
    let body: deleteS3ObjectType = { id: resourceId };
    try {
      const res = await axios.post("/api/deleteS3Object", body);
      try {
        let body: deletePDFType = { id: resourceId, category: category };
        await axios.post("/api/deletePDF", body);
      } catch (error) {
        toast.error("Error deleting resource, please try again later.");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      toast.error("Error deleting resource, please try again later.");
      setIsLoading(false);
      return;
    }
    router.refresh();
    toast.success("Resource deleted successfully!");
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader2 height={30} width={30} className="animate-spin" />
      ) : (
        <Dialog>
          <DialogTrigger>
            <Trash2 height={30} width={30} className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="text-slate-800 dark:text-slate-200">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
              <div className="flex w-full gap-x-2 pt-5">
                <DialogPrimitive.Close className="flex-1">
                  <Button className="w-full">Cancel</Button>
                </DialogPrimitive.Close>
                <div className="flex-1">
                  <Button
                    isLoading={isLoading}
                    className="w-full"
                    variant="dangerous"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
