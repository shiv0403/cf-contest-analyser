import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export const metadata: Metadata = {
  title: "CF Contest Analyser",
  description:
    "This is a platform where user will be able to analyse their codeforces contest performance by selecting the contest which they have given",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="min-h-screen bg-gray-50">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
