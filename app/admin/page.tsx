import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ReportTable, { ReportElementType } from "@/components/ReportTable";
import ReportFilters from "@/components/ReportFilters";

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

  let reportArr: ReportElementType[] = [];

  const cheatsheets = await prisma.cheatsheetReport.findMany();
  if (cheatsheets) {
    cheatsheets.map((report) =>
      reportArr.push({
        reportId: report.id,
        type: report.type,
        createdAt: report.createdAt,
        reporterId: report.userId,
        resolved: report.resolved,
      })
    );
  }

  const qnpapers = await prisma.questionPaperReport.findMany();
  if (qnpapers) {
    qnpapers.map((report) =>
      reportArr.push({
        reportId: report.id,
        type: report.type,
        createdAt: report.createdAt,
        reporterId: report.userId,
        resolved: report.resolved,
      })
    );
  }

  const notes = await prisma.notesReport.findMany();
  if (notes) {
    notes.map((report) =>
      reportArr.push({
        reportId: report.id,
        type: report.type,
        createdAt: report.createdAt,
        reporterId: report.userId,
        resolved: report.resolved,
      })
    );
  }

  const solns = await prisma.solutionReport.findMany();
  if (solns) {
    solns.map((report) =>
      reportArr.push({
        reportId: report.id,
        type: report.type,
        createdAt: report.createdAt,
        reporterId: report.userId,
        resolved: report.resolved,
      })
    );
  }

  return (
    <div className="flex flex-col items-center dark:text-slate-200">
      {verified ? "you are verified" : "you are not verified"}
      <div className="m-16 flex h-3/4 flex-col items-center gap-2">
        <ReportFilters />
        <ReportTable
          className="h-5/6 overflow-y-auto border scrollbar-thin"
          reportArr={reportArr}
        />
      </div>
    </div>
  );
}
