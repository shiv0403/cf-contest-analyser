"use client";

import type React from "react";
import { useState, useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, formAction] = useActionState(signup, { errors: [] });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          {/* Logo and Header */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
                <span className="font-bold">CF</span>
              </div>
              <h1 className="ml-2 text-xl font-bold">
                Codeforces Contest Analyzer
              </h1>
            </div>
          </div>

          {/* Auth Card */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="w-full">
              {/* Tabs */}
              <div className="grid w-full grid-cols-2 bg-gray-50">
                <Link
                  href="/auth"
                  className="rounded-none border-b-2 border-transparent py-3 text-center font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-none border-b-2 border-red-500 bg-white py-3 text-center font-medium"
                >
                  Sign Up
                </Link>
              </div>

              {/* Signup Tab */}
              <div className="p-6">
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold">Create an account</h2>
                  <p className="text-sm text-gray-500">
                    Join Codeforces Contest Analyzer today
                  </p>
                </div>

                <form action={formAction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium"
                      >
                        First name
                      </label>
                      <input
                        id="first-name"
                        name="first-name"
                        placeholder="John"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium"
                      >
                        Last name
                      </label>
                      <input
                        id="last-name"
                        name="last-name"
                        placeholder="Doe"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="codeforces-username"
                      className="block text-sm font-medium"
                    >
                      Codeforces Username
                    </label>
                    <input
                      name="codeforces-username"
                      id="codeforces-username"
                      placeholder="Enter your codeforces username"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <span className="text-xs">HIDE</span>
                        ) : (
                          <span className="text-xs">SHOW</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="mr-2 inline h-4 w-4 animate-spin"
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
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {formState.errors && (
                    <div className="mt-4">
                      <ul className="list-disc list-inside text-red-500">
                        {formState.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                          fill="currentColor"
                        />
                      </svg>
                      GitHub
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M12 24c6.627 0 12-5.373 12-12s-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 24c6.627 0 12-5.373 12-12s-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12z"
                          fill="white"
                        />
                        <path
                          d="M12.24 11.5v3.5h4.92c-.18 1.3-1.44 3.8-4.92 3.8-2.95 0-5.36-2.45-5.36-5.47 0-3.02 2.4-5.47 5.36-5.47 1.68 0 2.82.72 3.46 1.33l2.36-2.28C16.46 5.39 14.52 4.5 12.24 4.5 7.92 4.5 4.5 7.92 4.5 12.24c0 4.32 3.42 7.74 7.74 7.74 4.48 0 7.46-3.14 7.46-7.54 0-.5-.06-.89-.12-1.27h-7.34v.33z"
                          fill="#4285F4"
                        />
                      </svg>
                      Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
