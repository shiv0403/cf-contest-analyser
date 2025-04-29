import { LockoutSubmissionWithProblemAndSubmission } from "@/app/types/lockoutSubmission";
import { submissionSerializer } from "./submissionSerializer";

export const lockoutSubmissionSerializer = (
  lockoutSubmission: LockoutSubmissionWithProblemAndSubmission
) => {
  if (!lockoutSubmission) {
    return {};
  }

  return {
    lockoutId: lockoutSubmission.lockoutId,
    userHandle: lockoutSubmission.userHandle,
    submission: lockoutSubmission.submission
      ? submissionSerializer(lockoutSubmission.submission)
      : {},
  };
};
