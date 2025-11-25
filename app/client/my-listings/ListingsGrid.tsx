"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// ---- Types ----
interface Listing {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
}

export default function ListingsGrid(props: any) {
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/listings/user/my-listings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${props.session}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);

        // S'assurer que data.listings est bien un tableau
        setListings(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching listings", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen w-full px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-gray-50">
      {listings.map((item, index) => (
        <motion.div
          key={item._id ?? index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden">
            <div className="relative w-full h-48">
              {(() => {
                const src = item.images?.[0] || "/placeholder.jpg";
                const isExternal =
                  typeof src === "string" && /^https?:\/\//i.test(src);

                if (isExternal) {
                  return (
                    <img
                      src={src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  );
                }

                return (
                  <Image
                    src={src}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                );
              })()}
            </div>

            <CardHeader>
              <h2 className="text-lg font-semibold line-clamp-1">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.location}
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-md font-bold text-blue-600">
                {item.price} DA / nuit
              </p>
              <Button
                onClick={() => router.push(`/client/my-listings/${item._id}`)}
                className="mt-3 w-full cursor-pointer"
              >
                Voir plus
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
