"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError([]);

    try {
      const formData = new FormData(e.currentTarget);
      const userHandle = formData.get("codeforces-username") as string;
      const email = formData.get("email") as string;

      // First, verify the Codeforces handle and get the email
      const cfResponse = await fetch(
        `/api/codeforces/user?handle=${userHandle}`
      );
      const cfData = await cfResponse.json();

      if (!cfResponse.ok) {
        setError([cfData.error]);
        return;
      }

      // If the email doesn't match, show error
      if (cfData.email !== email) {
        setError(["Email doesn't match your Codeforces email"]);
        return;
      }

      // Send verification code
      const verifyResponse = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError([verifyData.error]);
        return;
      }

      // Store form data in session storage for later use
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          firstName: formData.get("first-name"),
          lastName: formData.get("last-name"),
          email,
          password: formData.get("password"),
          userHandle,
        })
      );

      // Redirect to verification page
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError([`An error occurred during signup: ${err}`]);
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
                <span className="font-bold">CFA</span>
              </div>
              <h1 className="ml-2 text-xl font-bold">Cf Analyser</h1>
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
                    Join Cf Analyser today
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-red-500 focus:outline-none"
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
                      required
                      disabled={isLoading}
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
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth"
              className="font-medium text-red-600 hover:text-red-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
