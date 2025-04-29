/* eslint-disable @typescript-eslint/no-explicit-any */
import { LockoutSubmissionResponse } from "@/app/types/contest.types";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const LockoutProblemDetails = ({ problem, lockout, index }: any) => {
  const [lockoutSubmissionHost, setLockoutSubmissionHost] =
    useState<LockoutSubmissionResponse>();
  const [lockoutSubmissionInvitee, setLockoutSubmissionInvitee] =
    useState<LockoutSubmissionResponse>();
  const [solvedAt, setSolvedAt] = useState(Infinity);

  useEffect(() => {
    const lockoutSubmissions = lockout.lockoutSubmissions;

    if (lockoutSubmissions.length > 0) {
      const problemSubmissions = lockoutSubmissions.filter(
        (lkSubmission: { submission: { problem: { id: number } } }) =>
          lkSubmission.submission.problem.id === problem.id
      );

      if (problemSubmissions.length > 0) {
        const hostSubmission = problemSubmissions.filter(
          (submission: { userHandle: string }) =>
            submission.userHandle === lockout.host.userHandle
        )[0];
        const inviteeSubmission = problemSubmissions.filter(
          (submission: { userHandle: string }) =>
            submission.userHandle === lockout.invitee.userHandle
        )[0];

        let solveTime = Infinity;
        if (hostSubmission) {
          solveTime = Math.min(
            solvedAt,
            hostSubmission.submission.creationTimeSeconds
          );
        }
        if (inviteeSubmission) {
          solveTime = Math.min(
            solveTime,
            inviteeSubmission.submission.creationTimeSeconds
          );
        }

        setSolvedAt(solveTime);
        setLockoutSubmissionHost(hostSubmission);
        setLockoutSubmissionInvitee(inviteeSubmission);
      }
    }
  }, [lockout, problem, solvedAt]);

  return (
    <tr key={problem.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
            {index + 1}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <Link href={problem.link} target="_blank">
                {problem.name}
              </Link>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            lockoutSubmissionHost?.submission.verdict === "OK" ||
            lockoutSubmissionInvitee?.submission.verdict === "OK"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {lockoutSubmissionHost?.submission.verdict === "OK" ||
          lockoutSubmissionInvitee?.submission.verdict === "OK"
            ? "Solved"
            : "Unsolved"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lockoutSubmissionHost ? (
          <span>{`${Math.ceil(
            (lockoutSubmissionHost.submission.creationTimeSeconds -
              moment(lockout.startTime).unix()) /
              60
          )} mins`}</span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lockoutSubmissionInvitee ? (
          <span>{`${Math.ceil(
            (lockoutSubmissionInvitee.submission.creationTimeSeconds -
              moment(lockout.startTime).unix()) /
              60
          )} mins`}</span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {solvedAt != Infinity ? (
            <div className="flex flex-col">
              <span className="font-medium">
                {moment.unix(solvedAt).format("h:mm A")}
              </span>
              <span className="text-xs text-gray-500">
                {moment.unix(solvedAt).format("MMM D, YYYY")}
              </span>
            </div>
          ) : (
            "-"
          )}
        </div>
      </td>
    </tr>
  );
};

export default LockoutProblemDetails;
