import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import DifficultyBreakdown from "@/components/resource/DifficultyBreakdown";
import DifficultyDisplay from "@/components/resource/DifficultyDisplay";
import { Separator } from "@/components/ui/Separator";

interface DifficultyDisplayDialogProps {
  resourceId: string;
  difficulty: number;
  difficultyCount: number;
}

export default function DifficultyDisplayDialog({
  resourceId,
  difficulty,
  difficultyCount,
}: DifficultyDisplayDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="hover:scale-110 focus:outline-none">
        <DifficultyDisplay
          difficulty={difficulty}
          difficultyCount={difficultyCount}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            Difficulty breakdown
          </DialogTitle>
          {/* <DialogDescription></DialogDescription> */}
        </DialogHeader>
        <div className="flex w-full items-center justify-center gap-x-14">
          {/* @ts-expect-error Server component */}
          <DifficultyBreakdown resourceId={resourceId} />
          <Separator orientation="vertical" className="mr-2 bg-slate-200" />
          <div className="scale-150">
            <DifficultyDisplay
              difficulty={difficulty}
              difficultyCount={difficultyCount}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
