import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database",
  description:
    "The database page of the StudyStash app, allowing you to view all the resources in the database!",
};

export default async function Database() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
        Choose a module!
      </h1>
    </div>
  );
}
