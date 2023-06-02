// import dynamic from "next/dynamic";

// const PDF = dynamic(() => import("@/components/PDFViewer"), {
//   ssr: false,
// });

export default async function Home() {
  return (
    <>
      <h1 className="text-slate-200">Hello world</h1>
      {/* <PDF /> */}
    </>
  );
}
