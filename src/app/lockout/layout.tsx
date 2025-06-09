import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lockouts",
  description:
    "Challenge your friends in head-to-head competitive programming duels. Solve problems faster, earn points, and climb the leaderboard in real-time lockout matches.",
};

export default function LockoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
