import Button from "@/components/ui/Button";
import ResizableTextArea from "@/components/ui/ResizableTextArea";

export default async function SolutionCommentsPage() {
  return (
    <div className="w-full p-2">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
        List of comments
      </h1>
      <ResizableTextArea placeholder="Type comment here..." />
      <Button>Comment</Button>
    </div>
  );
}
