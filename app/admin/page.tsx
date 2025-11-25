"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Users,
  Home,
  BarChart3,
  Loader2,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
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
  createdAt?: string;
};

type Stats = {
  totalUsers: number;
  totalListings: number;
  adminUsers?: number;
  regularUsers?: number;
  avgPrice?: number;
  listingsByLocation?: Array<{ _id: string; count: number }>;
  newUsersLastWeek?: number;
  newListingsLastWeek?: number;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalListings: 0,
  });
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
    let lastErr: any = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          credentials: "include",
          ...(options || {}),
        });
        if (res.ok) return res;
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

      const fetchedUsers: User[] = (uJson && (uJson.users || uJson)) || [];
      const fetchedListings: Listing[] =
        (lJson && (lJson.data || lJson.listings || lJson)) || [];

      setUsers(fetchedUsers);
      setListings(fetchedListings);

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
            const ownerId =
              typeof l.owner === "string" ? l.owner : l.owner?._id;
            return ownerId !== id;
          })
        );
        setStats((s) => ({
          ...s,
          totalUsers: Math.max(0, s.totalUsers - 1),
          regularUsers: s.regularUsers
            ? Math.max(0, s.regularUsers - 1)
            : undefined,
        }));
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

    const deleteUrls = [
      `${API_URL}/admin/listings/${id}`,
      `${API_URL}/listings/admin/${id}`,
      `${API_URL}/listings/${id}`,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8" /> Admin Dashboard
          </h1>
        </div>
      </header>

      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              message.type === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "stats"
                ? "bg-black text-white shadow-lg"
                : "bg-white border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <BarChart3 className="inline w-4 h-4 mr-2" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "listings"
                ? "bg-black text-white shadow-lg"
                : "bg-white border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Home className="inline w-4 h-4 mr-2" />
            Listings ({stats.totalListings})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "users"
                ? "bg-black text-white shadow-lg"
                : "bg-white border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Users className="inline w-4 h-4 mr-2" />
            Users ({stats.totalUsers})
          </button>
        </div>

        {activeTab === "stats" && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">
                      Total Users
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                      {stats.totalUsers}
                    </p>
                    {stats.regularUsers !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">
                        {stats.regularUsers} regular, {stats.adminUsers} admin
                      </p>
                    )}
                  </div>
                  <Users className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">
                      Total Listings
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                      {stats.totalListings}
                    </p>
                    {stats.avgPrice !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">
                        Avg: ${stats.avgPrice.toFixed(0)}/night
                      </p>
                    )}
                  </div>
                  <Home className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>

              {stats.newUsersLastWeek !== undefined && (
                <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase">
                        New Users (7d)
                      </h3>
                      <p className="text-4xl font-bold mt-2">
                        {stats.newUsersLastWeek}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Last week</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
                  </div>
                </div>
              )}

              {stats.newListingsLastWeek !== undefined && (
                <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase">
                        New Listings (7d)
                      </h3>
                      <p className="text-4xl font-bold mt-2">
                        {stats.newListingsLastWeek}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Last week</p>
                    </div>
                    <Calendar className="w-12 h-12 text-orange-500 opacity-20" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Top Locations
                </h4>
                {stats.listingsByLocation &&
                stats.listingsByLocation.length > 0 ? (
                  <div className="space-y-3">
                    {stats.listingsByLocation.map((loc, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{loc._id}</span>
                            <span className="text-sm text-gray-500">
                              {loc.count} listings
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-black h-2 rounded-full transition-all"
                              style={{
                                width: `${
                                  (loc.count / stats.totalListings) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No location data available</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Users
                </h4>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{u.username}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No users yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Recent Listings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.slice(0, 6).map((l) => (
                  <div
                    key={l._id}
                    className="border-2 border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h5 className="font-semibold mb-2">{l.title}</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {l.location || "Unknown"}
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {l.price ? `$${l.price}/night` : "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        By:{" "}
                        {typeof l.owner === "string"
                          ? "—"
                          : l.owner?.username || "—"}
                      </p>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <p className="text-gray-500 col-span-3 text-center py-4">
                    No listings yet
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "listings" && (
          <section>
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-4 text-left font-semibold">Title</th>
                      <th className="p-4 text-left font-semibold">Location</th>
                      <th className="p-4 text-left font-semibold">Price</th>
                      <th className="p-4 text-left font-semibold">Owner</th>
                      <th className="p-4 text-left font-semibold">Created</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((l) => (
                      <tr key={l._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{l.title}</td>
                        <td className="p-4 text-gray-600">
                          {l.location || "—"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {l.price ? `$${l.price}` : "—"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {typeof l.owner === "string"
                            ? "—"
                            : l.owner?.username || "—"}
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          {l.createdAt
                            ? new Date(l.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteListing(l._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {listings.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No listings found
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section>
            <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-4 text-left font-semibold">Username</th>
                      <th className="p-4 text-left font-semibold">Email</th>
                      <th className="p-4 text-left font-semibold">Role</th>
                      <th className="p-4 text-left font-semibold">
                        Registered
                      </th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{u.username}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {u.role || "user"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="p-4">
                          {u.role !== "admin" ? (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Protected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
