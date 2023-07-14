import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import {
  resourceColumns,
  solutionColumns,
  commentColumns,
  ResourceReportHeaderType,
  SolutionReportHeaderType,
  CommentReportHeaderType,
} from "@/components/admin/ReportTableColumns";
import { getModuleCodeOptions } from "@/lib/nusmods";
import { reportSectionOptions } from "@/lib/content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyStash | Admin",
  description:
    "The admin page for StudyStash, where you can manage reports against resources and comments",
};

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

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  
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

  const section = searchParams.section;
  if (
    !section ||
    typeof section !== "string" ||
    reportSectionOptions.indexOf(section) === -1
  ) {
    redirect("/admin?section=resource");
  }

  let resourceData: ResourceReportHeaderType[] = [];
  let solutionData: SolutionReportHeaderType[] = [];
  let commentData: CommentReportHeaderType[] = [];

  const cheatsheetsPromise = prisma.cheatsheetReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  const qnpapersPromise = prisma.questionPaperReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  const notesPromise = prisma.notesReport.findMany({
    include: {
      user: true,
      resource: {
        include: {
          userSubmitted: true,
        },
      },
    },
  });
  const solnsPromise = prisma.solutionReport.findMany({
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
  const cheatsheetCommentsPromise = prisma.cheatsheetCommentReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const qnpaperCommentsPromise = prisma.questionPaperCommentReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const notesCommentsPromise = prisma.notesCommentReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const solnsCommentsPromise = prisma.solutionCommentReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const cheatsheetReplyPromise = prisma.cheatsheetReplyReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const qnpaperReplyPromise = prisma.questionPaperReplyReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const notesReplyPromise = prisma.notesReplyReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });
  const solnsReplyPromise = prisma.solutionReplyReport.findMany({
    include: {
      user: true,
      comment: {
        include: {
          user: true,
        },
      },
    },
  });

  const [
    cheatsheets,
    qnpapers,
    notes,
    solns,
    cheatsheetComments,
    qnpaperComments,
    notesComments,
    solnsComments,
    cheatsheetReply,
    qnpaperReply,
    notesReply,
    solnsReply,
  ] = await Promise.all([
    cheatsheetsPromise,
    qnpapersPromise,
    notesPromise,
    solnsPromise,
    cheatsheetCommentsPromise,
    qnpaperCommentsPromise,
    notesCommentsPromise,
    solnsCommentsPromise,
    cheatsheetReplyPromise,
    qnpaperReplyPromise,
    notesReplyPromise,
    solnsReplyPromise,
  ]);

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
        reporterName: report.user.name!,
        acadYear: report.resource.acadYear,
        semester: report.resource.semester,
        moduleCode: report.resource.moduleCode,
      });
    });
  }
  if (qnpapers) {
    qnpapers.map((report) => {
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
        reporterName: report.user.name!,
        acadYear: report.resource.acadYear,
        semester: report.resource.semester,
        moduleCode: report.resource.moduleCode,
        examType: report.resource.type,
      });
    });
  }
  if (notes) {
    notes.map((report) => {
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
        reporterName: report.user.name!,
        acadYear: report.resource.acadYear,
        semester: report.resource.semester,
        moduleCode: report.resource.moduleCode,
      });
    });
  }
  if (solns) {
    solns.map((report) => {
      solutionData.push({
        reportId: report.id,
        type: report.type,
        createdAt: dateString(report.createdAt),
        filename: report.resource.name,
        uploaderId: report.resource.userSubmitted.id,
        uploaderName: report.resource.userSubmitted.name!,
        resourceId: report.resourceId,
        reporterId: report.userId,
        reporterName: report.user.name!,
      });
    });
  }
  if (cheatsheetComments) {
    cheatsheetComments.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "cheatsheetCommentReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (qnpaperComments) {
    qnpaperComments.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "questionPaperCommentReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (notesComments) {
    notesComments.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "notesCommentReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (solnsComments) {
    solnsComments.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "solutionCommentReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (cheatsheetReply) {
    cheatsheetReply.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "cheatsheetReplyReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (qnpaperReply) {
    qnpaperReply.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "questionPaperReplyReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (notesReply) {
    notesReply.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "notesReplyReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }
  if (solnsReply) {
    solnsReply.map((report) => {
      commentData.push({
        reportId: report.id,
        type: report.type,
        category: "solutionReplyReport",
        createdAt: dateString(report.createdAt),
        authorId: report.comment.user.id,
        authorName: report.comment.user.name!,
        commentId: report.commentId,
        reporterId: report.userId,
        reporterName: report.user.name!,
        content: report.comment.content,
      });
    });
  }

  // By default, sort by date (oldest on top)
  resourceData.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  solutionData.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  commentData.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div>
      {section === "resource" ? (
        <DataTable
          columns={resourceColumns}
          data={resourceData}
          moduleCodeOptions={JSON.stringify(await getModuleCodeOptions())}
          className="h-screen"
        />
      ) : section === "solution" ? (
        <DataTable
          columns={solutionColumns}
          data={solutionData}
          className="h-screen"
        />
      ) : section === "comment" ? (
        <DataTable
          columns={commentColumns}
          data={commentData}
          className="h-screen"
        />
      ) : (
        <div>Error.</div>
      )}
    </div>
  );
}
