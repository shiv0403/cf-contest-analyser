"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import LiveTimer from "@/app/components/Lockout/LiveTimer";
import LockoutProblemDetails from "@/app/components/Lockout/LockoutProblemDetails";
import LockoutDetailsSkeleton from "@/app/components/Lockout/LockoutDetailsSkeleton";
import { LockoutResponse } from "@/app/types/contest.types";
import { Problem } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const LockoutPage = () => {
  const { id: lockoutId } = useParams();
  const [lockout, setLockout] = useState<LockoutResponse | null>(null);
  const [lockoutProblems, setLockoutProblems] = useState<Array<Problem>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const POLLING_INTERVAL = 5000;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchLockoutDetails = async () => {
      try {
        const submissionResponse = await fetch(
          `/api/lockout/submission?lockoutId=${lockoutId}`
        );

        if (!submissionResponse.ok) {
          throw new Error("Failed fetching users lockout submissions");
        }

        const response = await fetch(
          `/api/lockout/accept?lockoutId=${lockoutId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lockout details");
        }
        const data = await response.json();
        const { data: lockoutData } = data;

        setLockout(lockoutData.lockout);
        setLockoutProblems(lockoutData.problems);
        setIsLoading(false);

        if (lockoutData.lockout.status === "completed" && intervalId) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching lockout details:", error);
        setIsLoading(false);
      }
    };

    // Start polling only if no lockout or it's not completed
    if (!lockout || lockout.status !== "completed") {
      fetchLockoutDetails(); // run once on mount
      intervalId = setInterval(fetchLockoutDetails, POLLING_INTERVAL);
    }
    return () => clearInterval(intervalId);
  }, [lockoutId]);

  if (isLoading) {
    return <LockoutDetailsSkeleton />;
  }

  if (!lockout || lockoutProblems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <i className="fas fa-exclamation-circle text-red-600 text-4xl"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Lockout Not Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            The requested lockout contest could not be found or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">{lockout.name}</h2>
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                lockout.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {lockout.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-clock text-gray-400"></i>
            <LiveTimer endTime={moment(lockout.endTime).unix() * 1000} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              {lockout.host.avatarUrl && (
                <Image
                  src={lockout.host.avatarUrl}
                  alt="Host Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {lockout.host.userHandle}
                </p>
                <p className="text-xs text-gray-500">Host</p>
              </div>
              {lockout.winner?.userHandle === lockout.host.userHandle && (
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                  <Image
                    src="/winner_final.svg"
                    alt="winner"
                    width={24}
                    height={24}
                    className="animate-pulse"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              {lockout.invitee.avatarUrl && (
                <Image
                  src={lockout.invitee.avatarUrl}
                  alt="Opponent Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {lockout.invitee.userHandle}
                </p>
                <p className="text-xs text-gray-500">Opponent</p>
              </div>
              {lockout.winner?.userHandle === lockout.invitee.userHandle && (
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                  <Image
                    src="/winner_final.svg"
                    alt="winner"
                    width={24}
                    height={24}
                    className="animate-pulse"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Problem Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {lockout.host.userHandle}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {lockout.invitee.userHandle}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Solved At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lockoutProblems?.map((problem: { id: any }, index: number) => (
                <LockoutProblemDetails
                  key={problem.id}
                  index={index}
                  problem={problem}
                  lockout={lockout}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LockoutPage;
