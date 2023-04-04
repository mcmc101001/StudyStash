import { getCurrentUser } from "@/lib/session";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";

export default async function Home() {

  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <h1>Hello world</h1>
        <LoginButton />
      </>
    );
  }
  else return (
    <>
      <h1>Hello world</h1>
      <LogoutButton />
      <h3>Signed in as {user.name}</h3>
      <Image src={user?.image} alt={user.name ?? 'profile image'} width={ 50 } height={ 50 }/>
    </>
  );  
}