import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import LogoutButton from "@/components/nav/LogoutButton";
import LoginButton from "@/components/nav/LoginButton";

async function UserProfilePic() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      {user ? (
        <>
          <Image
            loading="lazy"
            src={user.image!}
            alt={user.name ?? "profile image"}
            referrerPolicy="no-referrer"
            width={65}
            height={65}
          />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export default UserProfilePic;
