"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Users as UsersIcon,
  Home as HomeIcon,
  BarChart3,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "http://localhost:5000";

type User = {
  _id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
};

type Listing = {
  _id: string;
  title: string;
  location?: string;
  price?: number;
  image?: string;
  owner?: { _id: string; username: string; email?: string } | string;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0 });
  const [activeTab, setActiveTab] = useState<"stats" | "listings" | "users">(
    "stats"
  );
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchWithFallback(urls: string[], options?: RequestInit) {
    // Try each URL in order until one succeeds (res.ok). Return the Response or throw last error.
    let lastErr: any = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          credentials: "include",
          ...(options || {}),
        });
        if (res.ok) return res;
        // keep response but treat as failure for fallback
        lastErr = new Error(
          `Request to ${url} failed with status ${res.status}`
        );
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  }

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch users: prefer /admin/users, fallback to /users
      const usersUrls = [`${API_URL}/admin/users`, `${API_URL}/users`];
      const listingsUrl = `${API_URL}/listings`;

      const [uResPromise, lResPromise] = [
        fetchWithFallback(usersUrls).catch((e) => null),
        fetch(listingsUrl, { credentials: "include" }).catch((e) => null),
      ];

      const [uRes, lRes] = await Promise.all([uResPromise, lResPromise]);

      const uJson =
        uRes && uRes.ok ? await uRes.json().catch(() => null) : null;
      const lJson =
        lRes && lRes.ok ? await lRes.json().catch(() => null) : null;

      // users may be returned as { users: [...] } or an array directly depending on backend.
      const fetchedUsers: User[] = (uJson && (uJson.users || uJson)) || [];

      const fetchedListings: Listing[] =
        (lJson && (lJson.listings || lJson)) || [];

      setUsers(fetchedUsers);
      setListings(fetchedListings);

      // try stats endpoint, fallback to computed (you already had this)
      try {
        const sRes = await fetch(`${API_URL}/admin/stats`, {
          credentials: "include",
        });
        if (sRes.ok) {
          const sJson = await sRes.json().catch(() => null);
          if (sJson && sJson.stats) {
            setStats(sJson.stats);
          } else {
            setStats({
              totalUsers: fetchedUsers.length,
              totalListings: fetchedListings.length,
            });
          }
        } else {
          setStats({
            totalUsers: fetchedUsers.length,
            totalListings: fetchedListings.length,
          });
        }
      } catch (err) {
        setStats({
          totalUsers: fetchedUsers.length,
          totalListings: fetchedListings.length,
        });
      }
    } catch (err) {
      console.error("Admin fetch error", err);
      setMessage({ text: "Failed to load admin data", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function tryDeleteSequential(urls: string[]) {
    // Try DELETE on each URL until one succeeds (res.ok). Return true on success.
    let lastErr: any = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) return true;
        lastErr = new Error(`DELETE ${url} returned ${res.status}`);
      } catch (err) {
        lastErr = err;
      }
    }
    console.error("tryDeleteSequential lastErr:", lastErr);
    return false;
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Delete user? This removes all their listings.")) return;

    // Try both admin and non-admin delete endpoints
    const deleteUrls = [
      `${API_URL}/admin/users/${id}`,
      `${API_URL}/users/${id}`,
    ];

    try {
      const ok = await tryDeleteSequential(deleteUrls);
      if (ok) {
        setUsers((s) => s.filter((u) => u._id !== id));
        setListings((s) =>
          s.filter((l) => {
            // owner may be an object or an id string depending on your backend
            const ownerId =
              typeof l.owner === "string" ? l.owner : l.owner?._id;
            return ownerId !== id;
          })
        );
        setStats((s) => ({ ...s, totalUsers: Math.max(0, s.totalUsers - 1) }));
        setMessage({ text: "User deleted", type: "success" });
      } else {
        setMessage({ text: "Failed to delete user", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error", type: "error" });
    }
  }

  async function handleDeleteListing(id: string) {
    if (!confirm("Delete listing?")) return;

    // Try both frontend-expected admin path and the alternative listing-router admin path
    const deleteUrls = [
      `${API_URL}/admin/listings/${id}`, // frontend originally used this
      `${API_URL}/listings/admin/${id}`, // many backends (like your listing router) use this
      `${API_URL}/listings/${id}`, // final fallback (protected user delete) — may fail if not admin
    ];

    try {
      const ok = await tryDeleteSequential(deleteUrls);
      if (ok) {
        setListings((s) => s.filter((l) => l._id !== id));
        setStats((s) => ({
          ...s,
          totalListings: Math.max(0, s.totalListings - 1),
        }));
        setMessage({ text: "Listing deleted", type: "success" });
      } else {
        setMessage({ text: "Failed to delete listing", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error", type: "error" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 /> Admin Dashboard
          </h1>
        </div>
      </header>

      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded shadow ${
              message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded ${
              activeTab === "stats" ? "bg-black text-white" : "bg-white border"
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 rounded ${
              activeTab === "listings"
                ? "bg-black text-white"
                : "bg-white border"
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded ${
              activeTab === "users" ? "bg-black text-white" : "bg-white border"
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === "stats" && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded border">
                <h3 className="text-sm font-semibold text-gray-500">
                  Total Users
                </h3>
                <p className="text-4xl font-bold mt-4">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded border">
                <h3 className="text-sm font-semibold text-gray-500">
                  Total Listings
                </h3>
                <p className="text-4xl font-bold mt-4">{stats.totalListings}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-2">Recent Users</h4>
                <ul className="space-y-2">
                  {users.slice(0, 6).map((u) => (
                    <li key={u._id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{u.username}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {u.role === "admin" ? "Admin" : "User"}
                      </div>
                    </li>
                  ))}
                  {users.length === 0 && (
                    <li className="text-gray-500">No users</li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-2">Recent Listings</h4>
                <ul className="space-y-2">
                  {listings.slice(0, 6).map((l) => (
                    <li key={l._id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{l.title}</div>
                        <div className="text-xs text-gray-500">
                          {l.location}
                        </div>
                      </div>
                      <div className="text-sm">
                        {l.price ? `${l.price}/night` : "—"}
                      </div>
                    </li>
                  ))}
                  {listings.length === 0 && (
                    <li className="text-gray-500">No listings</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === "listings" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Listings</h2>
            <div className="bg-white rounded border overflow-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Owner</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l._id} className="border-b">
                      <td className="p-3">{l.title}</td>
                      <td className="p-3">{l.location}</td>
                      <td className="p-3">{l.price ?? "—"}</td>
                      <td className="p-3">
                        {typeof l.owner === "string"
                          ? "—"
                          : l.owner?.username ?? "—"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteListing(l._id)}
                          className="px-3 py-1 bg-black text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <div className="bg-white rounded border overflow-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Registered</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="p-3">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role ?? "User"}</td>
                      <td className="p-3">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-3">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="px-3 py-1 bg-black text-white rounded"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
