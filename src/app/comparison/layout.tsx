import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile comparison",
  description:
    "Compare your competitive programming performance with other users. Analyze rating trends, problem-solving patterns, topic proficiency, and contest results side by side.",
};

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
