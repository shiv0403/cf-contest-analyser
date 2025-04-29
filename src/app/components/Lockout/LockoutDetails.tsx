// import { Lockout } from "@prisma/client";
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import moment from "moment";
import { useAuth } from "@/contexts/AuthContext";

const LockoutDetails = ({ lockout, index }: any) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleJoinLockout = async () => {
    try {
      const response = await fetch(`/api/lockout/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lockoutId: lockout.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to Join the lockout contest");
      }

      router.push(`/lockout/${lockout.id}`);
    } catch (error) {
      console.error("Error Joining lockout contest:", error);
    }
  };

  const handleNavigate = () => {
    if (lockout.status === "pending") {
      alert("You cannot join a pending lockout");
      return;
    }
    router.push(`/lockout/${lockout.id}`);
  };

  return (
    <tr
      key={lockout.id}
      className="hover:bg-gray-50"
      onClick={() => handleNavigate()}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
            {index + 1}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {lockout.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            lockout.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {lockout.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {`${lockout.durationSeconds / 60} mins`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-900">
          <Image
            src={lockout.invitee.avatarUrl}
            alt="Logo"
            width={24}
            height={24}
            className="w-8 h-8 mr-2 rounded-2xl"
          />
          <span>
            {lockout.invitee.firstName + " " + lockout.invitee.lastName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {moment(lockout.createdAt).format("Do MMMM, YYYY")}
        </div>
      </td>

      {user &&
        user.id === lockout.invitee.id &&
        lockout.status === "invited" && (
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleJoinLockout();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer"
            >
              Join
            </button>
          </td>
        )}
    </tr>
  );
};

export default LockoutDetails;
