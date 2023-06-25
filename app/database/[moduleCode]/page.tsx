import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { moduleCode: string };
}) {
  redirect(`/database/${params.moduleCode}/cheatsheets`);
}
