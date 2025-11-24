'use client';

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles, Shield, Activity, Store, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import placeholderImg from "@/public/globe.svg";

type ListingCard = {
  id: string;
  category: string;
  availability: string;
  title: string;
  location: string;
  store: string;
  description?: string;
  price: string;
  timeframe: string;
  accent?: string;
  image: string;
};

type ApiListing = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  category?: string;
  isAvailable?: boolean;
  images?: string[];
  owner?: {
    username?: string;
  };
};

type ListingFormState = {
  title: string;
  description: string;
  location: string;
  price: string;
  category: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string;
  images: string;
};

const heroShowcase: ListingCard[] = [
  {
    id: "artisan-speaker",
    category: "Smart Home",
    availability: "Ships in 48h",
    title: "Hand-built Walnut Speaker",
    location: "Portland Makers District",
    store: "Studio Driftwood",
    price: "$620",
    timeframe: "per unit",
    accent: "from-cyan-100/70 via-white/70 to-blue-100/60",
    image: "/globe.svg",
  },
  {
    id: "brand-lab",
    category: "Creative Service",
    availability: "3 slots left",
    title: "Brand Identity Lab",
    location: "Remote · Global",
    store: "Northwind Agency",
    price: "$1.2k",
    timeframe: "per sprint",
    accent: "from-emerald-100/70 via-white/60 to-slate-100/60",
    image: "/globe.svg",
  },
  {
    id: "urban-e-bike",
    category: "Mobility",
    availability: "Verified store",
    title: "Urban Glide E-Bike",
    location: "Berlin Tiergarten",
    store: "Volt Cartel",
    price: "$980",
    timeframe: "per unit",
    accent: "from-slate-100/70 via-white/60 to-zinc-50/60",
    image: "/globe.svg",
  },
];

const navLinks = [
  { label: "Categories", href: "#categories" },
  { label: "Listings", href: "#listings" },
  { label: "Stores", href: "#stores" },
  { label: "Sell", href: "#sell" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const normalizeListing = (listing: ApiListing): ListingCard => ({
  id: listing._id,
  category: listing.category || "General",
  availability: listing.isAvailable === false ? "Temporarily unavailable" : "Available now",
  title: listing.title || "Untitled Listing",
  location: listing.location || "Worldwide",
  store: listing.owner?.username || "Independent Seller",
  description: listing.description,
  price: listing.price ? currencyFormatter.format(listing.price) : "$0",
  timeframe: "per stay",
  image: listing.images?.[0] || placeholderImg.src,
});

export default function Home() {
  const initialFormState: ListingFormState = {
    title: "",
    description: "",
    location: "",
    price: "",
    category: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
    images: "",
  };

  const [listings, setListings] = useState<ListingCard[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [listingForm, setListingForm] = useState<ListingFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleListingChange = (field: keyof ListingFormState, value: string) => {
    setListingForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchListings = useCallback(async () => {
    setIsLoadingListings(true);
    setListingsError(null);
    try {
      const response = await fetch("/api/listings", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load listings");
      }
      const data = Array.isArray(payload?.data) ? payload.data : payload?.data?.data || [];
      const normalized = data.map((listing: ApiListing) => normalizeListing(listing));
      setListings(normalized);
    } catch (error) {
      setListingsError(
        error instanceof Error ? error.message : "Something went wrong while loading listings"
      );
    } finally {
      setIsLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleAddListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);
    try {
      const payload = {
        title: listingForm.title,
        description: listingForm.description,
        location: listingForm.location,
        price: Number(listingForm.price),
        category: listingForm.category,
        amenities: listingForm.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        maxGuests: Number(listingForm.maxGuests),
        bedrooms: Number(listingForm.bedrooms),
        bathrooms: Number(listingForm.bathrooms),
        images: listingForm.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to create listing");
      }

      setFormMessage({ type: "success", text: "Listing published successfully" });
      setListingForm(initialFormState);
      await fetchListings();
    } catch (error) {
      setFormMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to publish listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6fbff] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_45%)]" />

      <header className="sticky top-4 z-50 mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-6 py-3 shadow-xl shadow-slate-200/60 backdrop-blur-3xl">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 shadow-inner shadow-white">
            <Sparkles className="h-5 w-5 text-slate-900" />
          </div>
          NomadNest
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="border border-black/10 bg-transparent text-slate-900">
            Log in
          </Button>
          <Button className="border border-black bg-black text-white hover:bg-black/90">
            Launch App
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16 lg:px-8">
        <section
          id="hero"
          className="grid gap-10 rounded-3xl border border-white/60 bg-white/80 p-10 shadow-2xl shadow-slate-200/80 backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-green-400" />
              Live marketplace
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A curated marketplace for products, services, and flagship stores.
              </h1>
              <p className="text-lg text-slate-500 sm:text-xl">
                Dive into living categories, compare listings, follow standout stores, and publish
                ads that reach serious buyers. NomadNest blends commerce-grade reliability with a
                premium browsing experience built for modern makers and service pros.
              </p>
              <ul className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                <li className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                  • Browse categories with smart filters
                </li>
                <li className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                  • View listings spanning goods & services
                </li>
                <li className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                  • Discover flagship community stores
                </li>
                <li className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                  • Post ads that showcase your next launch
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="border border-black bg-black px-6 py-6 text-base text-white hover:bg-black/90">
                Explore Marketplace
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="border border-black/10 bg-transparent px-6 py-6 text-base">
                Become a seller
              </Button>
            </div>

            <dl className="grid gap-6 text-sm text-slate-500 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-inner shadow-white/60">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Sparkles className="h-4 w-4" />
                  Premium listings
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-950">340+</dd>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-inner shadow-white/60">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Shield className="h-4 w-4" />
                  Verified sellers
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-950">120</dd>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-inner shadow-white/60">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Activity className="h-4 w-4" />
                  Avg. review score
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-950">4.97</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 -left-12 hidden w-[2px] bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
            <div className="space-y-4">
              {heroShowcase.map((listing, index) => (
                <article
                  key={listing.id}
                  className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${listing.accent} p-6 shadow-xl shadow-slate-200/60 backdrop-blur`}
                  style={{ transform: `translateY(${index * 8}px)` }}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                    <span>{listing.category}</span>
                    <span>{listing.availability}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                    {listing.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {listing.availability}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {listing.location}
                    </p>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Store className="h-3.5 w-3.5" />
                    {listing.store}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1 text-slate-950">
                    <span className="text-3xl font-semibold">{listing.price}</span>
                    <span className="text-sm text-slate-500">/ {listing.timeframe}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="sell"
          className="grid gap-10 rounded-3xl border border-white/60 bg-white/80 p-10 shadow-2xl shadow-slate-200/60 backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">
              Sell with ease
            </p>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
              Post ads that surface in the live listing rail.
            </h2>
            <p className="text-slate-500">
              Use this micro form to experiment with your product or service copy. Every entry
              instantly appears in the listing section so you can preview how buyers will experience
              your card.
            </p>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>• Highlight the category and fulfillment promise.</li>
              <li>• Add your store or studio name for credibility.</li>
              <li>• Use the price and cadence to set purchase expectations.</li>
            </ul>
          </div>

          <form onSubmit={handleAddListing} className="space-y-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
            <div className="space-y-2">
              <Label htmlFor="title">Listing title</Label>
              <Input
                id="title"
                placeholder="Hand-built Walnut Speaker"
                value={listingForm.title}
                onChange={(event) => handleListingChange("title", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product or service in a few sentences"
                value={listingForm.description}
                onChange={(event) => handleListingChange("description", event.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Portland Makers District"
                  value={listingForm.location}
                  onChange={(event) => handleListingChange("location", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Smart Home"
                  value={listingForm.category}
                  onChange={(event) => handleListingChange("category", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="620"
                  value={listingForm.price}
                  onChange={(event) => handleListingChange("price", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities / tags</Label>
                <Input
                  id="amenities"
                  placeholder="Hi-fi audio, walnut, bluetooth"
                  value={listingForm.amenities}
                  onChange={(event) => handleListingChange("amenities", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max guests / qty</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  placeholder="2"
                  value={listingForm.maxGuests}
                  onChange={(event) => handleListingChange("maxGuests", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={listingForm.bedrooms}
                  onChange={(event) => handleListingChange("bedrooms", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={listingForm.bathrooms}
                  onChange={(event) => handleListingChange("bathrooms", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (comma separated)</Label>
              <Input
                id="images"
                placeholder="https://images..., https://cdn..."
                value={listingForm.images}
                onChange={(event) => handleListingChange("images", event.target.value)}
              />
            </div>

            {formMessage && (
              <p
                className={`text-sm ${
                  formMessage.type === "error" ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {formMessage.text}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-black bg-black py-6 text-base text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Publish listing via API"}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </section>

        <section id="listings" className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Your listings
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
                Every product or service you add shows up here instantly.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Use this gallery to preview exactly how buyers will experience your cards across
                devices. Add multiple ads to experiment with different categories, pricing models,
                and fulfillment promises.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Button
                type="button"
                variant="ghost"
                onClick={fetchListings}
                disabled={isLoadingListings}
                className="border border-black/10 bg-transparent px-4 text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingListings ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <span>
                {isLoadingListings
                  ? "Loading listings..."
                  : listings.length > 0
                    ? `${listings.length} live listings`
                    : "No listings yet"}
              </span>
            </div>
          </div>

          {listingsError && (
            <div className="rounded-3xl border border-red-100 bg-red-50/70 p-4 text-sm text-red-600">
              {listingsError}
            </div>
          )}

          {isLoadingListings ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-64 rounded-3xl border border-white/60 bg-white/50 shadow-inner shadow-white/70 animate-pulse"
                />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 p-10 text-center text-slate-500 shadow-inner shadow-white/60">
              <p className="text-lg font-medium text-slate-900">No listings posted yet</p>
              <p className="mt-2 text-sm">
                Use the form above to create your first product or service card. It will appear here
                instantly.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {listings.map((listing) => (
                <article
                  key={`card-${listing.id}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-slate-200/70 backdrop-blur-xl transition-transform hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{listing.category}</span>
                      <span>{listing.availability}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{listing.title}</h3>
                    {listing.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{listing.description}</p>
                    )}
                    <div className="mt-3 space-y-1">
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        {listing.location}
                      </p>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                      <Store className="h-3.5 w-3.5" />
                      {listing.store}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-semibold text-slate-950">{listing.price}</span>
                        <span className="text-sm text-slate-400">/ {listing.timeframe}</span>
                      </div>
                      <Button className="border border-black bg-black px-5 text-white hover:bg-black/90">
                        Explore
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
