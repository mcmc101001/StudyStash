import Navbar from "@/components/nav/NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="h-screen w-[calc(100vw-6rem)]">{children}</div>
    </>
  );
}
