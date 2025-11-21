"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 🟢 We enforce the Role as 'admin' here
    const payload = {
      ...form,
      role: "admin",
    };

    try {
      console.log("Creating Admin User:", payload);
      // TODO: Connect to Backend API -> POST /api/auth/register

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay

      // Redirect to login after creation
      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg bg-white border-0">
        <CardHeader className="space-y-1">
          {/* 1. CHANGED TITLE */}
          <CardTitle className="text-2xl font-bold text-center">
            Create an Admin
          </CardTitle>
          <CardDescription className="text-center">
            Add a new administrator to NomadNest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="AdminUser"
                required
                value={form.username}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@nomadnest.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* 2. CHANGED BUTTON LABEL */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </CardContent>
        {/* 3. REMOVED FOOTER (Already have an account...) */}
      </Card>
    </div>
  );
}
