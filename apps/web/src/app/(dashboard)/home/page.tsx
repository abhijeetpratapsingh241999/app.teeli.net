"use client";

import { OnboardingHero } from "@/features/p1-dashboard/components/OnboardingHero";
import { GreetingHero } from "@/features/p1-dashboard/components/GreetingHero";

export default function HomePage() {
  // Demo user - replace with actual auth later
  const demoUser = {
    name: "Abhijeet",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (returning user)
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Greeting Hero - Top Left (below mobile header, adjust for tablets) */}
      <div className="absolute top-16 sm:top-14 md:top-6 left-4 sm:left-5 md:left-6 z-20 tablet-greeting">
        <GreetingHero user={demoUser} />
      </div>

      {/* 3D Onboarding Hero */}
      <OnboardingHero modelUrl="/models/drone.glb" />
    </div>
  );
}
