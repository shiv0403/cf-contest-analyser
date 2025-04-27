"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathName = usePathname();

  const getLinkCss = (path: string) => {
    const isNotActiveCss =
      "text-gray-800 font-medium hover:text-red-500 cursor-pointer";
    const isActiveCss =
      "text-red-500 font-medium border-b-2 border-red-500 cursor-pointer";
    return pathName === path ? isActiveCss : isNotActiveCss;
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
            className={getLinkCss("/contest-analysis")}
          >
            Contests
          </Link>
          <Link href="/comparison" className={getLinkCss("/comparison")}>
            Comparison
          </Link>
          <Link href="/lockout" className={getLinkCss("/lockout")}>
            Lockout
          </Link>
          <Link href="/ai-analysis" className={getLinkCss("/ai-analysis")}>
            AI Analysis
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <span className="hidden md:inline text-sm font-medium">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
