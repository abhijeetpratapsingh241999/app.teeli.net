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

// Real-time greeting based on browser's local time
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good morning";      // 5 AM - 11:59 AM
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";    // 12 PM - 4:59 PM
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";      // 5 PM - 8:59 PM
  } else {
    return "Good night";        // 9 PM - 4:59 AM
  }
}

export function GreetingHero({ user }: GreetingHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMounted(true);

    // Function to update greeting based on real-time
    const updateGreeting = () => {
      const timeGreeting = getTimeBasedGreeting();
      
      // Format current time for display (optional)
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));

      if (user) {
        const accountAge = now.getTime() - user.createdAt.getTime();
        const isNewUser = accountAge < 24 * 60 * 60 * 1000; // Less than 24 hours

        if (isNewUser) {
          setGreeting(`Welcome to Teeli, ${user.name}!`);
        } else {
          setGreeting(`${timeGreeting}, ${user.name}.`);
        }
      } else {
        // Guest user - still show time-based greeting
        setGreeting(timeGreeting);
      }
    };

    // Initial greeting
    updateGreeting();

    // Update greeting every minute (real-time)
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent leading-tight">
          {greeting}, Explorer!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          Interactive Demo Mode • {currentTime}
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent leading-tight">
          {greeting}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
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
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
        <span className="bg-linear-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
          {greeting}
        </span>
      </h1>
    </motion.div>
  );
}
