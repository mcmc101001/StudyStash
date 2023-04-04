import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PDFUploader from "@/components/PDFUploader";
import PDFViewer from "@/components/PDFViewer";

export default async function Home() {

    const user = await getCurrentUser();
    if (!user) {
      redirect(authOptions?.pages?.signIn || "api/auth/signin");
    }

    return (
        <>
            < PDFUploader />
            < PDFViewer url="https://orbital2023.s3.ap-southeast-1.amazonaws.com/Verilog_Tutorial.pdf" />
        </>
    )
}