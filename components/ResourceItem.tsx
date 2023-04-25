import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import PDFSheetLauncher from "./PDFSheetLauncher";

interface ResourceItemProps {
  name: string;
  id: string;
  userId: string;
  createdAt: Date;
  acadYear: string;
  semester: string;
  category: ResourceType;
  examType?: string;
}

export default async function ResourceItem({
  name,
  id,
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
      <td>
        <PDFSheetLauncher id={id}>{name}</PDFSheetLauncher>
      </td>
      <td>{user?.name}</td>
      <td>{createdAt.toISOString()}</td>
      <td>{`${acadYear} S${semester}`}</td>
      {category !== "Notes" ? <td>{examType}</td> : <></>}
    </tr>
  );
}
