import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/nav/ThemeProvider";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyStash",
  description:
    "Studystash is a one stop solution for all your revision needs. Gain access to user contributed cheatsheets, notes, as well as past papers and solutions!",
  openGraph: {
    type: "website",
    title: "StudyStash",
    description:
      "Studystash is a one stop solution for all your revision needs. Gain access to user contributed cheatsheets, notes, as well as past papers and solutions!",
    url: "https://studystash.vercel.app",
    siteName: "StudyStash",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark overflow-hidden">
      <body className={inter.className}>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Toaster />
          <main className="hidden w-full min-w-fit flex-row bg-slate-100 transition-colors duration-500 dark:bg-slate-950 lg:flex">
            {children}
          </main>
          <main className="flex h-screen w-screen flex-col items-center justify-center p-10 text-center lg:hidden">
            <h1 className="font-bold">
              This app is optimised only for desktop use!
            </h1>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
