"use client";

import { login } from "@/lib/actions";
import { useActionState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form action={action} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {state?.error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {state.error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {pending ? "Logging in..." : "Login"}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Sign up now
          </Link>
        </p>
      </form>
    </div>
  );
}
