"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Users,
  Home,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Use NEXT_PUBLIC_API_URL if provided (dev/prod), otherwise fall back to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalListings: number;
  }>({
    totalUsers: 0,
    totalListings: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("stats");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch(`${API_URL}/admin/stats`, {
        credentials: "include",
      });
      const statsData = await statsRes.json();
      if (statsData.stats) setStats(statsData.stats);

      // Fetch users
      const usersRes = await fetch(`${API_URL}/admin/users`, {
        credentials: "include",
      });
      const usersData = await usersRes.json();
      if (usersData.users) setUsers(usersData.users);

      // Fetch all listings
      const listingsRes = await fetch(`${API_URL}/listings`, {
        credentials: "include",
      });
      const listingsData = await listingsRes.json();
      if (listingsData.listings) setListings(listingsData.listings);
    } catch (error) {
      showMessage("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user and all their listings?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUsers(users.filter((u: any) => u._id !== userId));
        setListings(listings.filter((l: any) => l.owner._id !== userId));
        setStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
        }));
        showMessage("User deleted successfully");
      } else {
        showMessage("Error deleting", "error");
      }
    } catch (error) {
      showMessage("Server error", "error");
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/listings/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setListings(listings.filter((l: any) => l._id !== listingId));
        setStats((prev) => ({
          ...prev,
          totalListings: prev.totalListings - 1,
        }));
        showMessage("Listing deleted successfully");
      } else {
        showMessage("Error deleting", "error");
      }
    } catch (error) {
      showMessage("Server error", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-black animate-spin mx-auto mb-4" />
          <p className="text-gray-900 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-black" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">NomadNest - Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 ${
              message.type === "error"
                ? "bg-white border-red-500 text-red-600"
                : "bg-white border-green-500 text-green-600"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-4">
          {[
            { id: "stats", label: "Statistics", icon: BarChart3 },
            { id: "listings", label: "Listings", icon: Home },
            { id: "users", label: "Users", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Global Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                      Total Users
                    </p>
                    <p className="text-6xl font-bold text-black mt-3">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-black rounded-2xl p-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                      Total Listings
                    </p>
                    <p className="text-6xl font-bold text-black mt-3">
                      {stats.totalListings}
                    </p>
                  </div>
                  <div className="bg-black rounded-2xl p-4">
                    <Home className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Manage Listings
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-black">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.map((listing) => (
                      <tr
                        key={listing._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-semibold">
                            {listing.title}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{listing.location}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-bold">
                            {listing.price}/night
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">
                            {listing.owner.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {listing.owner.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
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
                  <div className="text-center py-16">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No listings found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              User Management
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-black">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-semibold">
                            {user.username}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border-2 ${
                              user.role === "admin"
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-black"
                            }`}
                          >
                            {user.role === "admin" ? "👑 Admin" : "👤 User"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600 font-medium">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US"
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No users found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
