import Navbar from "@/components/nav/NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* @ts-expect-error Server component */}
      <Navbar />
      <div className="h-screen w-[calc(100vw-8rem)]">{children}</div>
    </>
  );
}
