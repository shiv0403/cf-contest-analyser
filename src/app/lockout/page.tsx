"use client";
import React, { useEffect, useState } from "react";
import LockoutDetails from "../components/Lockout/LockoutDetails";
import { Lockout } from "@prisma/client";
import LockoutSkeleton from "../components/Lockout/LockoutSkeleton";
import { useAuth } from "@/contexts/AuthContext";

const Lockouts = () => {
  const { user, isAuthenticated } = useAuth();
  const [lockouts, setLockouts] = useState<Array<Lockout>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opponentHandle, setOpponentHandle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchCurrentUserLockouts = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/lockout?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lockouts");
      }
      const data = await response.json();
      setLockouts(data);
    } catch (error) {
      console.error("Error fetching lockouts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLockout = async () => {
    if (!opponentHandle.trim() || !user?.id) return;

    setIsCreating(true);
    try {
      const response = await fetch(`/api/lockout/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostId: user.id,
          opponentHandle: opponentHandle.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create lockout");
      }

      // Refresh the lockouts list
      await fetchCurrentUserLockouts();
      setOpponentHandle("");
    } catch (error) {
      console.error("Error creating lockout:", error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUserLockouts();
    }
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lockout Contests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Challenge your friends to head-to-head programming contests
        </p>
      </div>

      {/* Create Lockout Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="opponent-handle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Opponent&apos;s Codeforces Handle
            </label>
            <div className="relative">
              <input
                id="opponent-handle"
                type="text"
                placeholder="Enter opponent's handle"
                value={opponentHandle}
                onChange={(e) => setOpponentHandle(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                disabled={!isAuthenticated || isLoading}
              />
              <i className="fas fa-user absolute right-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCreateLockout}
              disabled={
                !opponentHandle.trim() ||
                isCreating ||
                !isAuthenticated ||
                isLoading
              }
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Lockout"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lockout Table */}
      {isLoading ? (
        <LockoutSkeleton />
      ) : lockouts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <i className="fas fa-trophy text-red-600 text-4xl"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Lockout Contests Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Create your first lockout contest by entering your opponent&apos;s
            Codeforces handle above.
          </p>
        </div>
      )}
    </div>
  );
};

export default Lockouts;
