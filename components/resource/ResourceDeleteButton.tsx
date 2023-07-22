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
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async function () {
    setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            asChild
            className="-mx-2 stroke-slate-800 dark:stroke-slate-200"
          >
            <UseAnimations
              role="button"
              aria-label="Delete resource"
              animation={trash2}
              size={45}
              strokeColor="inherit"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full gap-x-2">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                variant="dangerous"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
