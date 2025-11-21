"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.jpeg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />{" "}
        {/* Overlay for readability */}
      </div>

      {/* Floating Decorative Elements - subtle and luxurious */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl z-0"
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-xl md:text-7xl lg:font-8xl font-bold uppercase text-white">
              Experience the Art of
              <span className="block text-light-grey italic mt-2 drop-shadow-md">
                Global Living
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md"
          >
            Curated sanctuaries for the modern wanderer. Immerse yourself in
            inspiring destinations with premium amenities designed for seamless
            remote work and unparalleled comfort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-float transition-smooth rounded-full px-10 py-7 text-base font-medium tracking-wide group"
            >
              Browse Homes
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-primary/30 hover:border-primary hover:bg-primary/5 rounded-full px-10 py-7 text-base font-medium tracking-wide backdrop-blur-sm transition-smooth"
            >
              Publish Your Listing
            </Button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-12 pt-16"
          >
            {[
              { label: "Countries", value: "50+" },
              { label: "Listings", value: "1,000+" },
              { label: "Happy Nomads", value: "5,000+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-card/60 backdrop-blur-xl rounded-xl px-8 py-5 shadow-soft hover:shadow-float transition-smooth border border-border/50"
              >
                <div className="text-4xl font-handwritten text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-light">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 60C1200 45 1320 15 1380 0L1440 0V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
