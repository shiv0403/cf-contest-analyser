// import { Lockout } from "@prisma/client";
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React from "react";

const LockoutDetails = ({ lockout, index }: any) => {
  const session = { user: { id: 14 } }; // TODO: Replace this with actual session data

  const handleJoinLockout = async () => {};

  return (
    <tr key={lockout.id} className="hover:bg-gray-50">
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
            className="w-7 h-7 mr-2 rounded-xl"
          />
          <span>
            {lockout.invitee.firstName + " " + lockout.invitee.lastName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{"27/04/2025"}</div>
      </td>
      {session && session.user.id === lockout.invitee.id && (
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => handleJoinLockout()}
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
