"use client";
import { motion } from "framer-motion";
import { Wifi, Briefcase, Shield, Globe, Zap, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Wifi,
      title: "Fast Internet",
      description: "Guaranteed high-speed fiber connection for seamless work",
    },
    {
      icon: Briefcase,
      title: "Dedicated Workspace",
      description: "Ergonomic setup with desk, chair, and natural light",
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "JWT authentication and admin moderation for safety",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Listings in 50+ countries across all continents",
    },
    {
      icon: Zap,
      title: "Easy Management",
      description: "Publish and edit your listings from your dashboard",
    },
    {
      icon: Users,
      title: "Nomad Community",
      description: "Connect with like-minded remote workers worldwide",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Airy Background Shapes */}
      <motion.div
        animate={{ y: [0, -40, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 40, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"
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
            Why NomadNest?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need for the perfect remote work experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="h-full p-10 rounded-2xl bg-card shadow-soft hover:shadow-float transition-smooth border border-border/30">
                <div className="flex flex-col items-center text-center space-y-5">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-smooth"
                  >
                    <feature.icon className="w-7 h-7 text-accent transition-smooth" />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-handwritten text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-light text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="h-0.5 bg-accent/40 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
