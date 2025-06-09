import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contest Analysis",
  description:
    "Analyze your Codeforces contest performance with detailed insights and statistics. Track your progress, identify patterns, and improve your competitive programming skills.",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
