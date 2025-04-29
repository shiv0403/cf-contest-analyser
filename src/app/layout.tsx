import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CF Contest Analyser",
  description:
    "This is a platform where user will be able to analyse their codeforces contest performance by selecting the contest which they have given",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <div className="min-h-screen bg-gray-50">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
