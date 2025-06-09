import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Analysis",
  description:
    "Get personalized AI-powered insights and recommendations for improving your competitive programming skills. Analyze your strengths, weaknesses, and receive tailored improvement strategies.",
};

export default function AiAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
