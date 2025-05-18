"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailForm() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    router.push("/auth/signup");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError([]);

    try {
      // First verify the code
      const verifyResponse = await fetch("/api/auth/verify-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError([verifyData.error || "Failed to verify email"]);
        return;
      }

      // Get the stored signup data
      const signupData = sessionStorage.getItem("signupData");
      if (!signupData) {
        setError(["Signup data not found. Please try signing up again."]);
        return;
      }

      // Create the user account
      const createUserResponse = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: signupData,
      });

      const createUserData = await createUserResponse.json();

      if (!createUserResponse.ok) {
        setError([createUserData.error || "Failed to create account"]);
        return;
      }

      // Clear the stored signup data
      sessionStorage.removeItem("signupData");

      // Redirect to login page with success message
      router.push("/auth?success=Account created successfully");
    } catch (err) {
      setError([`An error occurred: ${err}`]);
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Verification Card */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold">Verify your email</h2>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              {error.length > 0 && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <ul className="list-inside list-disc text-sm text-red-500">
                    {error.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="verification-code"
                    className="block text-sm font-medium"
                  >
                    Verification Code
                  </label>
                  <input
                    id="verification-code"
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
                    required
                    disabled={isLoading}
                    placeholder="Enter 6-digit code"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 disabled:opacity-70"
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
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-red-600 hover:text-red-800"
            >
              Go back to signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
