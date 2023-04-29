import { ResourceType } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import PDFSheetLauncher from "./PDFSheetLauncher";
import Rating from "@/components/Rating";

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
        <Rating resourceId={id} userId={userId} />
      </td>
      <td>
        <PDFSheetLauncher id={id}>
          <div className="h-full w-full text-slate-800 hover:underline dark:text-slate-200">
            {name}
          </div>
        </PDFSheetLauncher>
      </td>
      <td>{user?.name}</td>
      <td>
        {createdAt.toLocaleString("en-GB", {
          minute: "2-digit",
          hour: "numeric",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td>{`${acadYear} S${semester}`}</td>
      {category !== "Notes" ? <td>{examType}</td> : <></>}
    </tr>
  );
}
