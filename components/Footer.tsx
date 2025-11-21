"use client";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Mail, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-foreground/5 pt-20 pb-8 overflow-hidden">
      {/* Animated Wave */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <motion.path
            initial={{ x: 0 }}
            animate={{ x: [0, -1440] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            d="M0 0L60 10C120 20 240 40 360 45C480 50 600 40 720 35C840 30 960 30 1080 35C1200 40 1320 50 1380 55L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-4xl font-handwritten font-bold text-primary">
              NomadNest
            </h3>
            <p className="text-muted-foreground max-w-md">
              Connecting digital nomads with work-friendly homes around the world. 
              Your next adventure starts here.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Mail, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -4 }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-handwritten text-xl font-bold text-foreground">
              Explore
            </h4>
            <ul className="space-y-2">
              {["Browse Homes", "Destinations", "Host Guide", "About Us"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-handwritten text-xl font-bold text-foreground">
              Support
            </h4>
            <ul className="space-y-2">
              {["Help Center", "Safety", "Terms", "Privacy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 NomadNest. Made with ❤️ for digital nomads.
          </p>
          
          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:shadow-float transition-smooth"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
