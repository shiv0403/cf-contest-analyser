"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import LiveTimer from "@/app/components/Lockout/LiveTimer";
import LockoutProblemDetails from "@/app/components/Lockout/LockoutProblemDetails";
import { LockoutResponse } from "@/app/types/contest.types";
import { Problem } from "@prisma/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const LockoutPage = () => {
  const { id: lockoutId } = useParams();
  const [lockout, setLockout] = useState<LockoutResponse | null>(null);
  const [lockoutProblems, setLockoutProblems] = useState<Array<Problem>>([]);

  const fetchLockoutDetails = async () => {
    try {
      const response = await fetch(
        `/api/lockout/accept?lockoutId=${lockoutId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lockout details");
      }
      const data = await response.json();

      setLockout(data.lockout);
      setLockoutProblems(data.problems);
    } catch (error) {
      console.error("Error fetching lockout details:", error);
    }
  };

  useEffect(() => {
    fetchLockoutDetails();
  }, [lockoutId]);

  return (
    lockout &&
    lockoutProblems.length > 0 && (
      <div className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{lockout.name}</h2>
            <div>
              {/* Live Timer which is decreasing till the lockout end time */}
              <LiveTimer endTime={1745775436000} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      <div className="flex items-center">
                        {lockout.host.avatarUrl && (
                          <Image
                            src={lockout.host.avatarUrl}
                            alt="Logo"
                            width={24}
                            height={24}
                            className="w-6 h-6 mr-2 rounded-xl"
                          />
                        )}

                        <div>{lockout.host.userHandle + " (You)"}</div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        {lockout.invitee.avatarUrl && (
                          <Image
                            src={lockout.invitee.avatarUrl}
                            alt="Logo"
                            width={24}
                            height={24}
                            className="w-6 h-6 mr-2 rounded-xl"
                          />
                        )}

                        <div>{lockout.invitee.userHandle + " (Opponent)"}</div>
                      </div>
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
                  {lockoutProblems?.map(
                    (problem: { id: any }, index: number) => (
                      <LockoutProblemDetails
                        key={problem.id}
                        index={index}
                        problem={problem}
                        lockout={lockout}
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    )
  );
};

export default LockoutPage;
