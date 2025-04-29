import { problemSerializer } from "./problemSerializer";
import { SubmissionWithProblem } from "@/app/types/submission";

export const submissionSerializer = (submission: SubmissionWithProblem) => {
  if (!submission) {
    return {};
  }
  console.log({ sb: submission.problem });
  return {
    contestId: submission.contestId,
    problem: submission.problem ? problemSerializer(submission.problem) : {},
    userHandle: submission.userHandle,
    verdict: submission.verdict,
    language: submission.language,
    creationTimeSeconds: submission.creationTimeSeconds,
    relativeTimeSeconds: submission.relativeTimeSeconds,
  };
};
