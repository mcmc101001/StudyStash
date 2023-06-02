import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";
// import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Orbital 2023",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark overflow-hidden">
      <body className={inter.className}>
        {/* show DOM content after loaded to prevent dark mode flickering */}
        {/* <Script src='/theme.js' strategy='afterInteractive' /> */}
        <Suspense>
          <Toaster />
        </Suspense>

        <main className="flex w-full min-w-fit flex-row bg-white transition-colors duration-500 dark:bg-slate-950">
          {/* @ts-expect-error Server component */}
          <NavBar />
          <div className="h-screen w-[calc(100vw-8rem)]">{children}</div>
        </main>
      </body>
    </html>
  );
}
