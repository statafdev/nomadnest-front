"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Edit, DollarSign } from "lucide-react";

const ForHostsSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Photos",
      description: "Showcase your space with beautiful images via Vercel Blob",
    },
    {
      icon: Edit,
      title: "Manage Listings",
      description: "Edit and update your properties from your personal dashboard",
    },
    {
      icon: DollarSign,
      title: "Set Your Price",
      description: "Full control over pricing and availability",
    },
  ];

  return (
    <section className="py-32 bg-linear-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Decorative Elements - more subtle */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl"
      />
      
      {/* Additional Airy Shape */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-background/50 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Illustration/Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-float">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                alt="Digital nomad workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-secondary/30" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 bg-card p-6 rounded-2xl shadow-float border border-border"
            >
              <div className="text-sm text-muted-foreground mb-1">Monthly earnings</div>
              <div className="text-3xl font-handwritten font-bold text-primary">$2,450</div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-handwritten text-foreground leading-tight">
                Become a Host
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Share your space with digital nomads from around the world. Create your listing in minutes and start earning.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="shrink w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-smooth">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-smooth" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-float hover:shadow-glow transition-smooth rounded-full px-8 py-6 text-lg group"
            >
              Start Hosting
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForHostsSection;
