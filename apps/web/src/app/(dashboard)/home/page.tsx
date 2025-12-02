"use client";

import { OnboardingHero } from "@/features/p1-dashboard/components/OnboardingHero";

export default function HomePage() {
  return (
    <div className="h-screen overflow-hidden">
      <OnboardingHero modelUrl="/models/drone.glb" />
    </div>
  );
}
