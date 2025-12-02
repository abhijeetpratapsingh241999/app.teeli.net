"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface User {
  name: string;
  createdAt: Date;
}

interface GreetingHeroProps {
  user?: User | null;
}

export function GreetingHero({ user }: GreetingHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setMounted(true);

    // Only calculate greeting on client-side to avoid hydration mismatch
    if (user) {
      const now = new Date();
      const accountAge = now.getTime() - user.createdAt.getTime();
      const isNewUser = accountAge < 24 * 60 * 60 * 1000; // Less than 24 hours

      if (isNewUser) {
        setGreeting(`Welcome to Teeli, ${user.name}!`);
      } else {
        // Returning user - timezone-aware greeting
        const hour = now.getHours();
        let timeGreeting = "";

        if (hour >= 5 && hour < 12) {
          timeGreeting = "Good morning";
        } else if (hour >= 12 && hour < 18) {
          timeGreeting = "Good afternoon";
        } else {
          timeGreeting = "Good evening";
        }

        setGreeting(`${timeGreeting}, ${user.name}.`);
      }
    }
  }, [user]);

  // Prevent hydration mismatch by not rendering time-based content until mounted
  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="h-14 w-96 bg-slate-200/20 rounded-lg animate-pulse" />
        <div className="h-6 w-64 bg-slate-200/20 rounded-lg animate-pulse" />
      </div>
    );
  }

  // Condition A: Guest User
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col justify-center h-16 space-y-1"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent leading-tight">
          Experience 3D Magic.
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Interactive Demo Mode Active.
        </p>
      </motion.div>
    );
  }

  // Check if new user (account created < 24h)
  const now = new Date();
  const accountAge = now.getTime() - user.createdAt.getTime();
  const isNewUser = accountAge < 24 * 60 * 60 * 1000;

  // Condition B: New User
  if (isNewUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col justify-center h-16 space-y-1"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent leading-tight">
          {greeting}
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Your creative journey starts here.
        </p>
      </motion.div>
    );
  }

  // Condition C: Returning User (Timezone-Aware Greeting)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-center h-16"
    >
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
        <span className="bg-linear-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
          {greeting}
        </span>
      </h1>
    </motion.div>
  );
}
