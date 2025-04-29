"use client";
import React, { useEffect, useState } from "react";
import LockoutDetails from "../components/Lockout/LockoutDetails";
import { Lockout } from "@prisma/client";

const Lockouts = () => {
  const session = { user: { id: 14 } }; // TODO: Replace this with actual session data
  const [lockouts, setLockouts] = useState<Array<Lockout>>([]);

  const fetchCurrentUserLockouts = async () => {
    try {
      const response = await fetch(`/api/lockout?userId=${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lockouts");
      }
      const data = await response.json();
      setLockouts(data);
    } catch (error) {
      console.error("Error fetching lockouts:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUserLockouts();
  }, []);

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
                {lockouts.map((lockout: { id: number }, index: number) => (
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
