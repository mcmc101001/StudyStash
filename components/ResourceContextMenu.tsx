"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/ContextMenu";
import {
  ResourceSolutionType,
  ResourceType,
  papersAdditionalReportOptions,
  reportOptions,
} from "@/lib/content";
import { addReportType } from "@/pages/api/addReport";
import { ReportType } from "@prisma/client";
import axios from "axios";
import fileDownload from "js-file-download";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// export class RepeatReportError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "RepeatReportError";
//   }
// }

interface ResourceContextMenuProps {
  children: React.ReactNode;
  category: ResourceSolutionType;
  currentUserId: string | null;
  resourceId: string;
  resourceTitle: string;
  resourceUserId: string;
  shareURL: string;
  className?: string;
  disabled?: boolean;
  // resourceStatus: ResourceStatus | null;
}

export default function ResourceContextMenu({
  children,
  category,
  currentUserId,
  resourceId,
  resourceTitle,
  resourceUserId,
  shareURL,
  className,
  disabled,
}: // resourceStatus,
ResourceContextMenuProps) {
  // const [status, setStatus] = useState<ResourceStatus | null>(resourceStatus);

  let router = useRouter();

  // const handleStatusChange = async (
  //   e: React.MouseEvent,
  //   clickedStatus: ResourceStatus
  // ) => {
  //   e.preventDefault();

  //   if (!currentUserId) {
  //     toast.error("Login required.");
  //     return;
  //   }
  //   if (clickedStatus === status) {
  //     setStatus(null);
  //     let body: updateStatusType = {
  //       category: category,
  //       userId: currentUserId,
  //       resourceId: resourceId,
  //       status: null,
  //     };

  //     try {
  //       let req = await axios.post("/api/updateStatus", body);
  //     } catch {
  //       toast.error("Something went wrong, please try again.");
  //     }
  //   } else {
  //     setStatus(clickedStatus);
  //     let body: updateStatusType = {
  //       category: category,
  //       userId: currentUserId,
  //       resourceId: resourceId,
  //       status: clickedStatus,
  //     };

  //     try {
  //       let req = await axios.post("/api/updateStatus", body);
  //     } catch {
  //       toast.error("Something went wrong, please try again.");
  //     }
  //     router.refresh();
  //   }
  // };

  const handleReportClick = async (type: ReportType) => {
    if (!currentUserId) {
      toast.error("Login required.");
      return;
    }

    let body: addReportType = {
      category: category,
      reporterId: currentUserId,
      resourceId: resourceId,
      reportType: type,
    };

    try {
      let req = await axios.post("/api/addReport", body);
      toast.success("Report successful!");
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        e.message === "Request failed with status code 419"
      ) {
        toast.success("Repeated report.");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
  };

  let reportChoices = reportOptions;
  if (category === "Past Papers") {
    reportChoices.concat(papersAdditionalReportOptions);
  }

  // const onDownloadClick = () => {
  //   fetch(shareURL)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const blobURL = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = blobURL;
  //       a.download = resourceTitle + ".pdf";

  //       document.body.appendChild(a);
  //       a.click();
  //     });
  // };

  const onDownloadClick = () => {
    axios.get(shareURL, { responseType: "blob" }).then((res) => {
      fileDownload(res.data, resourceTitle + ".pdf");
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={disabled} className={className}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="border border-slate-300 dark:border-slate-600">
        <ContextMenuItem asChild>
          {/* <a
            href={shareURL.slice(8)}
            download={resourceTitle + ".pdf"}
            rel="noopener noreferrer"
            target="_blank"
            className="h-full w-full"
          >
            Download
          </a> */}
          <button onClick={onDownloadClick} className="h-full w-full">
            Download
          </button>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <a href={shareURL} rel="noopener noreferrer" target="_blank">
            Open in new tab
          </a>
        </ContextMenuItem>

        {/* <ContextMenuSeparator />

        <ContextMenuCheckboxItem
          checked={status === "Saved"}
          onClick={(e) => handleStatusChange(e, ResourceStatus.Saved)}
        >
          Bookmark
        </ContextMenuCheckboxItem>
        {category === "Past Papers" && (
          <ContextMenuCheckboxItem
            checked={status === "Todo"}
            onClick={(e) => handleStatusChange(e, ResourceStatus.Todo)}
          >
            Todo
          </ContextMenuCheckboxItem>
        )}
        {category === "Past Papers" && (
          <ContextMenuCheckboxItem
            checked={status === "Completed"}
            onClick={(e) => handleStatusChange(e, ResourceStatus.Completed)}
          >
            Completed
          </ContextMenuCheckboxItem>
        )} */}

        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger disabled={resourceUserId === currentUserId}>
            Report resource
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {reportChoices.map((option) => {
              return (
                <ContextMenuItem
                  key={option.value}
                  onClick={() => handleReportClick(option.value)}
                >
                  {option.label}
                </ContextMenuItem>
              );
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
