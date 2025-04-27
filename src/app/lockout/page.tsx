/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Lockout } from "@prisma/client";
import React from "react";
import LockoutDetails from "../components/Lockout/LockoutDetails";

const Lockouts = () => {
  const lockouts: any = [
    {
      id: 1,
      name: "Demo Lockout",
      invitee: {
        id: 14,
        userHandle: "shiv@g.coma",
        email: "shiv0403gupta@gmail.coma",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl: "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      status: "invited",
      host: {
        id: 1,
        userHandle: "dope0403",
        email: "shiv0403gupta@gmail.com",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl: "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      durationSeconds: 3600,
      inviteCode: "123456",
      problemIds: [2001, 2002, 2003],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Demo Lockout",
      invitee: {
        id: 14,
        userHandle: "shiv@g.coma",
        email: "shiv0403gupta@gmail.coma",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl: "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      status: "invited",
      host: {
        id: 1,
        userHandle: "dope0403",
        email: "shiv0403gupta@gmail.com",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl: "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      durationSeconds: 3600,
      inviteCode: "123456",
      problemIds: [2001, 2002, 2003],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Demo Lockout",
      invitee: {
        id: 14,
        userHandle: "shiv@g.coma",
        email: "shiv0403gupta@gmail.coma",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl: "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      status: "invited",
      host: {
        id: 1,
        userHandle: "dope0403",
        email: "shiv0403gupta@gmail.com",
        firstName: "Shivansh",
        lastName: "Gupta",
        avatarUrl: "https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
      },
      durationSeconds: 3600,
      inviteCode: "123456",
      problemIds: [2001, 2002, 2003],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Lockout Contests
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
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
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Opponent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lockouts.map((lockout: { id: any }, index: number) => (
                  <LockoutDetails
                    key={lockout.id}
                    index={index}
                    lockout={lockout}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lockouts;
