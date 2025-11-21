"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 248, 225, 0)", "rgba(255, 248, 225, 0.95)"]
  );
  
  const navShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 20px rgba(255, 138, 128, 0.1)"]
  );

  return (
    <motion.nav
      style={{ 
        backgroundColor: navBackground,
        boxShadow: navShadow,
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <h1 className="text-3xl font-handwritten text-primary cursor-pointer hover:scale-105 transition-transform">
              NomadNest
            </h1>
          </motion.div>

          {/* Desktop Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center gap-2 bg-card rounded-full px-6 py-2 shadow-soft hover:shadow-float transition-all"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search destination..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </motion.div>

          {/* Desktop Nav Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:flex items-center gap-4"
          >
            <Button variant="ghost" className="hover:bg-primary/10 transition-smooth">
              Browse Homes
            </Button>
            <Button className="bg-primary hover:bg-primary/90 shadow-soft hover:shadow-float transition-smooth rounded-full">
              Publish Listing
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-smooth"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-4"
          >
            <div className="flex items-center gap-2 bg-card rounded-full px-6 py-2 shadow-soft">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search destination..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full hover:bg-primary/10 transition-smooth">
                Browse Homes
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90 shadow-soft rounded-full">
                Publish Listing
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
