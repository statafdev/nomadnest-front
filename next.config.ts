import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "example.com",
      "localhost",
      "fq3on1usp0ruto0i.public.blob.vercel-storage.com",
    ], // ajoute ici les domaines de tes images
  },
};

export default nextConfig;
