"use client";

import { ResourceSolutionType } from "@/lib/content";
import axios from "axios";
import { Loader2 } from "lucide-react";
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
import Button from "@/components/ui/Button";
import UseAnimations from "react-useanimations";
import trash2 from "react-useanimations/lib/trash2";

interface ResourceDeleteButtonProps {
  currentUserId: string;
  resourceId: string;
  category: ResourceSolutionType;
}

export default function ResourceDeleteButton({
  currentUserId,
  resourceId,
  category,
}: ResourceDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async function () {
    setIsLoading(true);
    let body: deleteS3ObjectType = { userId: currentUserId, id: resourceId };
    try {
      const res = await axios.post("/api/deleteS3Object", body);
      try {
        let body: deletePDFType = {
          userId: currentUserId,
          id: resourceId,
          category: category,
        };
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
          <DialogTrigger
            asChild
            className="stroke-slate-800 dark:stroke-slate-200"
          >
            <UseAnimations
              role="button"
              aria-label="Delete resource"
              animation={trash2}
              size={30}
              strokeColor="inherit"
            />
            {/* <Trash2 height={30} width={30} className="cursor-pointer" /> */}
          </DialogTrigger>
          <DialogContent className="text-slate-800 dark:text-slate-200">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
              <div className="flex w-full gap-x-2 pt-5">
                <DialogPrimitive.Close className="flex-1">
                  <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-300">
                    Cancel
                  </div>
                </DialogPrimitive.Close>
                <div className="flex-1">
                  <Button
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
