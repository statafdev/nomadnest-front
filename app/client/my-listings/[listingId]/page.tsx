"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Listing {
  _id: string;
  title: string;
  location: string;
  price: number;
  description?: string;
  images?: string[];
}

export default function Page() {
  const params = useParams();
  const id = params?.listingId;

  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState(false);

  const fetchListings = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(true);
        return;
      }

      setListing(data?.data || data?.listing || null);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    if (id) fetchListings();
  }, [id]);

  if (error || !listing) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Impossible de charger cette publication.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">{listing.title}</h1>
      <p className="text-gray-500">{listing.location}</p>

      {listing.images?.map((image) => (
        <div
          key={image}
          className="relative w-full h-80 mt-6 rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src={image}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
      ))}

      <p className="mt-6 text-blue-600 font-semibold text-xl">
        {listing.price} DA / nuit
      </p>

      <p className="mt-4 text-gray-700 leading-relaxed">
        {listing.description || "Aucune description disponible."}
      </p>
    </div>
  );
}
