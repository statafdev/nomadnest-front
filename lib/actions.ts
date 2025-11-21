"use server"; // Mark this file as server-side only

import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";
import { z } from "zod"; // Import Zod for input validation

// Define validation schema for login form
// This ensures the data meets our requirements before we try to use it
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Server Action for handling login
 * This function is called when the login form is submitted
 * @param prevState Previous form state (used by useActionState hook)
 * @param formData Form data containing email and password
 */
export async function login(prevState: any, formData: FormData) {
  console.log(formData);
  let role = "";
  // Extract form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate the input using Zod schema
  const result = LoginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: "Invalid email or password format" };
  }

  try {
    // Call your API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      return { error: "Invalid credentials" };
    }

    const { token, user } = await response.json();

    // Store token in cookie
    await createSession(token);

    role = user.role;
  } catch (error) {
    return { error: "Something went wrong" };
  }

  // Redirect to dashboard
  redirect(role === "admin" ? "/admin" : "/client");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
