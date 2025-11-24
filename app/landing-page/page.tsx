"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  Laptop,
  Coffee,
  MapPin,
  Search,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api";

interface ListingOwner {
  username?: string;
}
interface Listing {
  _id?: string;
  image?: string;
  title?: string;
  price?: number | string;
  location?: string;
  description?: string;
  owner?: ListingOwner;
}

export default function LandingPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();
      if (data.listings) {
        setListings(data.listings.slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchTerm);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Laptop className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">NomadNest</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-gray-700 hover:text-black font-medium transition-colors"
              >
                Explore
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-black font-medium transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-black font-medium transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-black font-semibold hover:bg-gray-100 rounded-lg transition-colors">
                Login
              </button>
              <button className="px-4 py-2 bg-black text-white font-semibold hover:bg-gray-800 rounded-lg transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Work
              <br />
              <span className="relative inline-block">
                from anywhere
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-gray-200 -z-10"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover perfect stays for digital nomads — high-speed internet,
              dedicated workspaces and comfortable amenities.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 p-2 bg-white border-2 border-black rounded-2xl shadow-lg">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Paris, Berlin, Tokyo..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm((e.target as HTMLInputElement).value)
                    }
                    className="flex-1 outline-none text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: Wifi,
                title: "High-speed Wi-Fi",
                description: "Ultra-fast internet to stay productive",
              },
              {
                icon: Laptop,
                title: "Workspace",
                description: "Dedicated ergonomic desk",
              },
              {
                icon: Coffee,
                title: "Premium Comfort",
                description: "All the essentials for your daily life",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white border-2 border-black rounded-2xl hover:shadow-2xl transition-all"
                >
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-black mb-3">
                Popular listings
              </h2>
              <p className="text-gray-600 text-lg">
                Discover our top destinations
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-3 border-2 border-black rounded-xl font-semibold hover:bg-black hover:text-white transition-colors">
              See all
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4 font-medium">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => {
                const ownerName = listing.owner?.username ?? "Host";
                const ownerInitial = ownerName.charAt(0).toUpperCase();
                return (
                  <div
                    key={listing._id ?? ownerName}
                    className="group bg-white border-2 border-black rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div className="relative overflow-hidden h-64">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          No image
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg border-2 border-black font-bold">
                        {listing.price}/night
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">
                          {listing.location}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2 group-hover:underline">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {ownerInitial}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {ownerName}
                          </span>
                        </div>
                        <button className="text-black font-semibold hover:underline flex items-center gap-1">
                          View details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                No listings available
              </h3>
              <p className="text-gray-600">Check back soon for new offers</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { value: "500+", label: "Listings", icon: TrendingUp },
              { value: "50+", label: "Countries", icon: MapPin },
              { value: "2000+", label: "Happy nomads", icon: Star },
            ].map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="group">
                  <StatIcon className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-lg font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-black mb-6">
            Ready to start your adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of digital nomads who found their ideal workspace
          </p>
          <button className="px-10 py-4 bg-black text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-3 shadow-xl">
            Get started for free
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-50 border-t-2 border-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">NomadNest</span>
              </div>
              <p className="text-gray-600 text-sm">
                The booking platform for digital nomads
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2024 NomadNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
