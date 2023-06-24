import { authOptions } from "@/lib/auth";
import { ResourceSolutionEnum, ResourceSolutionType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import z from "zod";

const MAX_RECENT_ITEMS = 10;

const updateVisitedSchema = z.object({
  userId: z.string(),
  resourceId: z.string(),
  category: ResourceSolutionEnum,
});

export type updateVisitedType = z.infer<typeof updateVisitedSchema>;
export interface VisitedDataType {
  visitedCheatsheets: string[];
  visitedPastPapers: string[];
  visitedNotes: string[];
  visitedSolutions: string[];
}

function isValidBody(body: any): body is updateVisitedType {
  const { success } = updateVisitedSchema.safeParse(body);
  return success;
}

// const stringify = (array: VisitedElementType[]): string => {
//   let str = "";
//   array.forEach((element) => {
//     str += element.resourceId + "|" + element.category + "$";
//   });
//   return str;
// };

// export const parse = (str: string): VisitedElementType[] => {
//   let array: VisitedElementType[] = [];
//   while (str.indexOf("$") !== -1) {
//     let index = str.indexOf("|");
//     array.push({
//       resourceId: str.substring(0, index),
//       category: str.slice(index + 1, str.indexOf("$")) as ResourceSolutionType,
//     });
//     str = str.slice(str.indexOf("$") + 1);
//   }
//   return array;
// };

export default async function updateVisited(
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
  if (!isValidBody(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }
  if (session.user.id !== req.body.userId) {
    res.status(401).json({ message: "You are not authorized." });
    return;
  }

  // IMPT: REMOVE THIS LATER
  // prisma.user.updateMany({
  //   data: {
  //     visitedData:
  //       '{"visitedCheatsheets":[],"visitedPastPapers":[],"visitedNotes":[],"visitedSolutions":[]}',
  //   },
  // });

  try {
    let { userId, resourceId, category } = req.body;

    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let visitedDataObject: VisitedDataType = JSON.parse(user.visitedData);

    let categoryArray: string[];
    if (category === "Cheatsheets") {
      categoryArray = visitedDataObject.visitedCheatsheets;
    } else if (category === "Past Papers") {
      categoryArray = visitedDataObject.visitedPastPapers;
    } else if (category === "Notes") {
      categoryArray = visitedDataObject.visitedNotes;
    } else if (category === "Solutions") {
      categoryArray = visitedDataObject.visitedSolutions;
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Remove the resource if it already exists
    categoryArray = categoryArray.filter((resource) => resource !== resourceId);

    // Add the resource to the front of the list
    categoryArray.unshift(resourceId);

    // Remove the last item if the list is too long
    if (categoryArray.length > MAX_RECENT_ITEMS) {
      categoryArray.pop();
    }

    // Update the object with the new list
    if (category === "Cheatsheets") {
      visitedDataObject.visitedCheatsheets = categoryArray;
    } else if (category === "Past Papers") {
      visitedDataObject.visitedPastPapers = categoryArray;
    } else if (category === "Notes") {
      visitedDataObject.visitedNotes = categoryArray;
    } else if (category === "Solutions") {
      visitedDataObject.visitedSolutions = categoryArray;
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Save the list
    let update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        visitedData: JSON.stringify(visitedDataObject),
      },
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
