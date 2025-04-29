"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Codeforces Contest Analyzer
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/contest-analysis"
            className={`px-3 py-2 text-sm font-medium ${
              isActive("/contest-analysis")
                ? "text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Contest Analysis
          </Link>
          <Link
            href="/comparison"
            className={`px-3 py-2 text-sm font-medium ${
              isActive("/comparison")
                ? "text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Compare
          </Link>
          <Link
            href="/lockout"
            className={`px-3 py-2 text-sm font-medium ${
              isActive("/lockout")
                ? "text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lockout
          </Link>
          <Link
            href="/ai-analysis"
            className={`px-3 py-2 text-sm font-medium ${
              isActive("/ai-analysis")
                ? "text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            AI Analysis
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
          ) : session?.user ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium text-gray-900">
                  {session.user.name}
                </span>
                <span className="ml-1 text-gray-500">
                  ({session.user.userHandle})
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
