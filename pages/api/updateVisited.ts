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

export interface visitedElementType {
  resourceId: string;
  category: ResourceSolutionType;
}

function isValidBody(body: any): body is updateVisitedType {
  const { success } = updateVisitedSchema.safeParse(body);
  return success;
}

const stringify = (array: visitedElementType[]): string => {
  let str = "";
  array.forEach((element) => {
    str += element.resourceId + "|" + element.category + "$";
  });
  return str;
};

const parse = (str: string): visitedElementType[] => {
  let array: visitedElementType[] = [];
  while (str.indexOf("$") !== -1) {
    let index = str.indexOf("|");
    array.push({
      resourceId: str.substring(0, index),
      category: str.slice(index + 1, str.indexOf("$")) as ResourceSolutionType,
    });
    str = str.slice(str.indexOf("$") + 1);
  }
  return array;
};

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

    let visitedArray: visitedElementType[];

    if (user.visitedData !== "") {
      // Parse string into list
      visitedArray = parse(user.visitedData);

      // Remove the resource if it already exists
      visitedArray = visitedArray.filter(
        (resource) => resourceId !== resource.resourceId
      );

      // Add the resource to the front of the list
      visitedArray.unshift({ resourceId, category });

      // Remove the last item if the list is too long
      if (visitedArray.length > MAX_RECENT_ITEMS) {
        visitedArray.pop();
      }
    } else {
      visitedArray = [{ resourceId, category }];
    }

    // Save the list
    let update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        visitedData: stringify(visitedArray),
      },
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
