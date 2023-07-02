import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database",
  description:
    "The database page of the StudyStash app, allowing you to view all the resources in the database!",
};

export default async function Page({
  params,
}: {
  params: { moduleCode: string };
}) {
  redirect(`/database/${params.moduleCode}/cheatsheets`);
}
