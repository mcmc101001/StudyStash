import { ResourceSolutionOptions } from "@/lib/content";
import UserResourceTab from "./UserResourceTab";

export default async function DashboardResourcesSection() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Saved resources</h1>
      <UserResourceTab resourceOptions={ResourceSolutionOptions} />
    </>
  );
}
