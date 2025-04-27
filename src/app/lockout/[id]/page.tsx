"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import LiveTimer from "@/app/components/Lockout/LiveTimer";
import LockoutProblemDetails from "@/app/components/Lockout/LockoutProblemDetails";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const LockoutPage = () => {
  const { id: lockoutId } = useParams();
  const [lockout, setLockout] = useState({
    name: "",
    startTime: 0,
    problems: [{ id: 0, name: "", submissions: [{}] }],
    invitee: {},
    host: {},
  });

  const fetchLockoutDetails = async () => {
    setLockout({
      name: "Demo Lockout",
      startTime: 1745774436,
      invitee: {
        id: 14,
        userHandle: "shiv@g.coma",
        email: "shiv0403gupta@gmail.coma",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl:
          "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      host: {
        id: 1,
        userHandle: "dope0403",
        email: "shiv0403gupta@gmail.com",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl:
          "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      problems: [
        {
          id: 1,
          name: "Problem A",
          submissions: [
            {
              verdict: "OK",
              creationTimeSeconds: 1745775436,
            },
          ],
        },
        {
          id: 2,
          name: "Problem B",
          submissions: [],
        },
        {
          id: 3,
          name: "Problem C",
          submissions: [],
        },
      ],
    });
  };

  useEffect(() => {
    fetchLockoutDetails();
  }, [lockoutId]);

  return (
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
                {lockout.problems?.map(
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
  );
};

export default LockoutPage;
