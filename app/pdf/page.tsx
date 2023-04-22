import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PDFViewer from "@/components/PDFViewer";

export default async function PDFPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "api/auth/signin/google");
  }

  return (
    <>
      <PDFViewer url="https://orbital2023.s3.ap-southeast-1.amazonaws.com/Verilog_Tutorial.pdf" />
    </>
  );
}
