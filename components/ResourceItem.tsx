import { FC } from "react";
import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";

interface ResourceItemProps {
  name: string;
  userId: string;
  createdAt: Date;
  acadYear: string;
  semester: string;
  category: ResourceType;
  examType?: string;
}

export default async function ResourceItem({
  name,
  userId,
  createdAt,
  acadYear,
  semester,
  examType,
  category,
}: ResourceItemProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return (
    <tr>
      <td>{name}</td>
      <td>{user?.name}</td>
      <td>{createdAt.toISOString()}</td>
      <td>{`${acadYear} S${semester}`}</td>
      {category !== "Notes" ? <td>{examType}</td> : <></>}
    </tr>
  );
}
