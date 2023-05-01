import { getCurrentUser } from "@/lib/session";

export default function UserResources() {
  const user = getCurrentUser();
  return <div></div>;
}
