"use server"; // 👈 Important: Ensure this is a Server Action

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session"; // Adjust path if needed

export async function login(prevState: any, formData: FormData) {
  // 1. FIX: Extract values from the FormData object
  const email = formData.get("email");
  const password = formData.get("password");

  // Basic validation
  if (!email || !password) {
    return { error: "Email and Password are required" };
  }

  try {
    // 2. FIX: Use Backticks (`) not single quotes (') for dynamic URLs
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      return { error: "Invalid credentials" };
    }

    const data = await response.json();

    // 3. Create the session
    await createSession(data.token);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong" };
  }

  // 4. Redirect happens ONLY if we get here (success)
  // Note: redirect throws an error internally, so it must be outside try/catch
  // or it will be caught as "Something went wrong"
  redirect("/dashboard");
}
