"use server"; // Mark this file as server-side only

import { createSession, deleteSession, getSession } from "./session";
import { redirect } from "next/navigation";
import { z } from "zod"; // Import Zod for input validation
import { put } from "@vercel/blob";

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

type FormState =
  | {
      error?: string;
    }
  | undefined;

export async function login(prevState: FormState, formData: FormData) {
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

// Schéma simplifié pour la démonstration
const ListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.string().pipe(z.coerce.number().min(0)),
  location: z.string().min(2),
});

export async function createListing(prevState: any, formData: FormData) {
  // 1. Validation des champs texte
  const validation = ListingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    location: formData.get("location"),
  });

  if (!validation.success) {
    return {
      message: "Erreur de validation des champs.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { title, description, price, location } = validation.data;

  // 2. Traitement des images (Vercel Blob)
  const imageFiles = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  if (imageFiles.length === 0 || imageFiles[0].size === 0) {
    return { message: "Au moins une image est requise." };
  }

  try {
    // Upload de chaque image
    for (const file of imageFiles) {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      imageUrls.push(blob.url);
    }

    console.log(imageUrls);
  } catch (error) {
    console.error("Vercel Blob Upload Error:", error);
    return { message: "Échec de l'upload des images." };
  }

  // 3. Récupération du Token de Session (Côté Serveur)
  const sessionCookie = await getSession();
  if (!sessionCookie) {
    return { message: "Session expirée. Veuillez vous reconnecter." };
  }

  console.log(sessionCookie);

  // Assurez-vous que votre token JWT est stocké proprement dans ce cookie.
  // Si le cookie est un token JWT, on l'envoie dans le Header Authorization.
  const token = sessionCookie;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Le Sésame pour le Middleware Express
        },
        body: JSON.stringify({
          title,
          description,
          price,
          location,
          images: imageUrls, // On envoie les URLs et non les fichiers binaires
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // L'API Express a renvoyé une erreur (ex: 403 Forbidden)
      return {
        message:
          errorData.message ||
          "Impossible de créer l'annonce (vérifiez le rôle).",
      };
    }
  } catch (error) {
    console.error("Express API Call Error:", error);
    return { message: "Erreur de connexion avec l'API Backend." };
  }

  // 5. Succès et Redirection (en dehors du try/catch)
  redirect("/client/my-listings");
}
