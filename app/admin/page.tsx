import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import {
  columns,
  ReportHeaderType,
} from "@/components/admin/ReportTableColumns";

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
  if (!verified) {
    redirect("/401");
  }

  let resourceData: ReportHeaderType[] = [];
  let solutionData: ReportHeaderType[] = [];

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
      resourceData.push({
        reportId: report.id,
        type: report.type,
        category: "Cheatsheets",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderId: report.resource.userSubmitted.id,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved,
        reporterName: report.user.name!,
        acadYear: report.resource.acadYear,
        semester: report.resource.semester,
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
      resourceData.push({
        reportId: report.id,
        type: report.type,
        category: "Past Papers",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderId: report.resource.userSubmitted.id,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved,
        reporterName: report.user.name!,
        acadYear: report.resource.acadYear,
        semester: report.resource.semester,
        examType: report.resource.type,
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
      resourceData.push({
        reportId: report.id,
        type: report.type,
        category: "Notes",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderId: report.resource.userSubmitted.id,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved,
        reporterName: report.user.name!,
        acadYear: report.resource.acadYear,
        semester: report.resource.semester,
      });
    });
  }

  const solns = await prisma.solutionReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          questionPaper: true,
          userSubmitted: true,
        },
      },
    },
  });
  if (solns) {
    solns.map((report) => {
      solutionData.push({
        reportId: report.id,
        type: report.type,
        category: "Solutions",
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderId: report.resource.userSubmitted.id,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        resolved: report.resolved,
        reporterName: report.user.name!,
        acadYear: report.resource.questionPaper.acadYear,
        semester: report.resource.questionPaper.semester,
      });
    });
  }

  // By default, sort by date
  resourceData.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  solutionData.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <DataTable
      // params={params}
      columns={columns}
      resourceData={resourceData}
      solutionData={solutionData}
      commentData={[]}
      className="h-screen"
    />
  );
}
