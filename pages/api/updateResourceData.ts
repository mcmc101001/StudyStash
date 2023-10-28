import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResourceReportType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ResourceEnum } from "@/lib/content";
import z from "zod";
import { isValidBody } from "@/lib/utils";

const updateResourceDataSchema = z.object({
  type: z.nativeEnum(ResourceReportType),
  category: ResourceEnum,
  uploaderId: z.string(),
  resourceId: z.string(),
  newData: z.string().optional(),
});

export type updateResourceDataType = z.infer<typeof updateResourceDataSchema>;

export default async function updateResourceData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  if (!isValidBody(req.body, updateResourceDataSchema)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    let report = req.body;
    let resource;

    if (report.type === "inappropriateFilename") {
      if (report.category === "Cheatsheets") {
        resource = await prisma.cheatsheet.update({
          where: {
            id: report.resourceId,
          },
          data: {
            name: report.newData,
          },
        });
      } else if (report.category === "Past Papers") {
        resource = await prisma.questionPaper.update({
          where: {
            id: report.resourceId,
          },
          data: {
            name: report.newData,
          },
        });
      } else if (report.category === "Notes") {
        resource = await prisma.notes.update({
          where: {
            id: report.resourceId,
          },
          data: {
            name: report.newData,
          },
        });
      }
    } else if (report.type === "inappropriateUsername") {
      resource = await prisma.user.update({
        where: {
          id: report.uploaderId,
        },
        data: {
          name: report.newData,
        },
      });
    } else if (report.type === "incorrectModule") {
      if (report.category === "Cheatsheets") {
        resource = await prisma.cheatsheet.update({
          where: {
            id: report.resourceId,
          },
          data: {
            moduleCode: report.newData,
          },
        });
      } else if (report.category === "Past Papers") {
        resource = await prisma.questionPaper.update({
          where: {
            id: report.resourceId,
          },
          data: {
            moduleCode: report.newData,
          },
        });
      } else if (report.category === "Notes") {
        resource = await prisma.notes.update({
          where: {
            id: report.resourceId,
          },
          data: {
            moduleCode: report.newData,
          },
        });
      }
    } else if (report.type === "incorrectAcadYear") {
      if (report.category === "Cheatsheets") {
        resource = await prisma.cheatsheet.update({
          where: {
            id: report.resourceId,
          },
          data: {
            acadYear: report.newData,
          },
        });
      } else if (report.category === "Past Papers") {
        resource = await prisma.questionPaper.update({
          where: {
            id: report.resourceId,
          },
          data: {
            acadYear: report.newData,
          },
        });
      } else if (report.category === "Notes") {
        resource = await prisma.notes.update({
          where: {
            id: report.resourceId,
          },
          data: {
            acadYear: report.newData,
          },
        });
      }
    } else if (report.type === "incorrectSemester") {
      if (report.category === "Cheatsheets") {
        resource = await prisma.cheatsheet.update({
          where: {
            id: report.resourceId,
          },
          data: {
            // @ts-expect-error wrong type inference
            semester: report.newData,
          },
        });
      } else if (report.category === "Past Papers") {
        resource = await prisma.questionPaper.update({
          where: {
            id: report.resourceId,
          },
          data: {
            // @ts-expect-error wrong type inference
            semester: report.newData,
          },
        });
      } else if (report.category === "Notes") {
        resource = await prisma.notes.update({
          where: {
            id: report.resourceId,
          },
          data: {
            // @ts-expect-error wrong type inference
            semester: report.newData,
          },
        });
      }
    } else if (report.type === "incorrectExamType") {
      if (report.category === "Cheatsheets") {
        resource = await prisma.cheatsheet.update({
          where: {
            id: report.resourceId,
          },
          data: {
            // @ts-expect-error wrong type inference
            type: report.newData,
          },
        });
      } else if (report.category === "Past Papers") {
        resource = await prisma.questionPaper.update({
          where: {
            id: report.resourceId,
          },
          data: {
            // @ts-expect-error wrong type inference
            type: report.newData,
          },
        });
      } else if (report.category === "Notes") {
        resource = await prisma.notes.update({
          where: {
            id: report.resourceId,
          },
          data: {
            // @ts-expect-error wrong type inference
            type: report.newData,
          },
        });
      }
    } else {
      res.status(400).json({ message: "Invalid report type" });
    }

    res.status(200).json({ resource });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
