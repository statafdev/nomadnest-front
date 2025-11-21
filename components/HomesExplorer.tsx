"use client";
import { motion } from "framer-motion";
import ListingCard from "./ListingCard";

const HomesExplorer = () => {
  const cities = [
    {
      name: "Lisbon",
      country: "PT",
      listings: [
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          title: "Sunny Studio in Alfama",
          location: "Lisbon, Portugal",
          price: 65,
          rating: 4.9,
          host: "Maria",
        },
        {
          image:
            "https://images.unsplash.com/photo-1502672260066-6bc2ec9b7e93?w=800",
          title: "Modern Loft with Ocean View",
          location: "Cascais, Portugal",
          price: 85,
          rating: 4.8,
          host: "João",
        },
        {
          image:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          title: "Coworking-Friendly Apartment",
          location: "Porto, Portugal",
          price: 55,
          rating: 4.7,
          host: "Sofia",
        },
      ],
    },
    {
      name: "Bali",
      country: "ID",
      listings: [
        {
          image:
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
          title: "Jungle Villa with Infinity Pool",
          location: "Ubud, Bali",
          price: 95,
          rating: 5.0,
          host: "Wayan",
        },
        {
          image:
            "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
          title: "Beachfront Workspace Paradise",
          location: "Canggu, Bali",
          price: 110,
          rating: 4.9,
          host: "Made",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
          title: "Rice Field View Studio",
          location: "Ubud, Bali",
          price: 70,
          rating: 4.8,
          host: "Ketut",
        },
      ],
    },
    {
      name: "Mexico City",
      country: "MX",
      listings: [
        {
          image:
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
          title: "Colorful Casa in Roma Norte",
          location: "Mexico City, Mexico",
          price: 60,
          rating: 4.9,
          host: "Carlos",
        },
        {
          image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
          title: "Rooftop Workspace with City Views",
          location: "Condesa, Mexico",
          price: 75,
          rating: 4.7,
          host: "Isabella",
        },
        {
          image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
          title: "Modern Apartment Near Coworking",
          location: "Polanco, Mexico",
          price: 80,
          rating: 4.8,
          host: "Diego",
        },
      ],
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Airy Background Shapes */}
      <motion.div
        animate={{ y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[-100px] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-handwritten text-foreground mb-6">
            Explore Homes Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Handpicked accommodations designed for remote work
          </p>
        </motion.div>

        <div className="space-y-16">
          {cities.map((city, cityIndex) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: cityIndex * 0.1 }}
              className="space-y-6"
            >
              {/* City Header */}
              <div className="flex items-baseline gap-3">
                <h3 className="text-3xl md:text-4xl font-handwritten font-bold text-foreground">
                  {city.name}
                </h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {city.country}
                </span>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {city.listings.map((listing, listingIndex) => (
                    <ListingCard
                      key={listingIndex}
                      {...listing}
                      delay={listingIndex * 0.1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomesExplorer;
