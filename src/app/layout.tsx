import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Codeforces Analyser",
    template: "%s | Codeforces Analyser",
  },
  description:
    "Analyze your Codeforces contest performance with detailed insights and statistics. Track your progress, identify patterns, and improve your competitive programming skills.",
  twitter: {
    card: "summary_large_image",
    title: "Codeforces Analyser",
    description:
      "Analyze your Codeforces contest performance with detailed insights and statistics. Track your progress, identify patterns, and improve your competitive programming skills.",
    images: ["/opengraph.png"],
  },
  openGraph: {
    title: "Codeforces Analyser",
    description:
      "Analyze your Codeforces contest performance with detailed insights and statistics. Track your progress, identify patterns, and improve your competitive programming skills.",
    images: ["/opengraph.png"],
  },
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
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <div className="min-h-screen bg-gray-50">{children}</div>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
