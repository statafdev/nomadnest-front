"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FloatingActionButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Simulate checking authentication status
  // In a real app, you would use a context or hook like useAuth()
  useEffect(() => {
    const checkAuth = () => {
      // Replace this with actual auth check logic
      // For now, we'll assume false (not logged in) as default
      // You can toggle this manually or implement real auth check
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkAuth();
    
    // Listen for storage changes to update state if login happens in another tab
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push("/create-publication");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: -180 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={handleClick}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoggedIn ? (
              <Plus className="h-6 w-6" />
            ) : (
              <LogIn className="h-6 w-6" />
            )}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButton;