import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import LogoutButton from "@/components/nav/LogoutButton";
import LoginButton from "@/components/nav/LoginButton";
import Link from "next/link";

async function UserProfilePic() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      {user ? (
        <>
          <Link href={`/profile/${user.id}?filterCategory=cheatsheets`}>
            <Image
              loading="lazy"
              src={user.image!}
              alt={user.name ?? "profile image"}
              referrerPolicy="no-referrer"
              width={60}
              height={60}
              className="rounded-xl"
            />
          </Link>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export default UserProfilePic;
