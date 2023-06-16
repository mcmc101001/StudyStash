import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { columns, ReportHeaderType } from "@/components/ReportTableColumns";

// Function to convert Date type to string
const dateString = (datetime: Date) => {
  return datetime.toLocaleString("en-SG", {
    minute: "2-digit",
    hour: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }
  const verified = await prisma.user
    .findUnique({
      where: {
        id: user.id,
      },
    })
    .then((user) => user?.verified);

  let reportArr: ReportHeaderType[] = [];

  const cheatsheets = await prisma.cheatsheetReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  if (cheatsheets) {
    cheatsheets.map((report) => {
      reportArr.push({
        reportId: report.id,
        type: report.type,
        category: "Cheatsheets",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved ? "Resolved" : "Unresolved",
        reporterName: report.user.name!,
      });
    });
  }

  const qnpapers = await prisma.questionPaperReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  if (qnpapers) {
    qnpapers.map(async (report) => {
      reportArr.push({
        reportId: report.id,
        type: report.type,
        category: "Past Papers",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved ? "Resolved" : "Unresolved",
        reporterName: report.user.name!,
      });
    });
  }

  const notes = await prisma.notesReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  if (notes) {
    notes.map(async (report) => {
      reportArr.push({
        reportId: report.id,
        type: report.type,
        category: "Notes",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved ? "Resolved" : "Unresolved",
        reporterName: report.user.name!,
      });
    });
  }

  const solns = await prisma.solutionReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  if (solns) {
    solns.map((report) => {
      reportArr.push({
        reportId: report.id,
        type: report.type,
        category: "Solutions",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved ? "Resolved" : "Unresolved",
        reporterName: report.user.name!,
      });
    });
  }

  return (
    <div className="h-screen w-full dark:text-slate-200">
      {verified ? "you are verified" : "you are not verified"}
      <div className="m-16 flex h-3/4 flex-col gap-2 overflow-auto p-1">
        <DataTable columns={columns} data={reportArr} />
      </div>
    </div>
  );
}
