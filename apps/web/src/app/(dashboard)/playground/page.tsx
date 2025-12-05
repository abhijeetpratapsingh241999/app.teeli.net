"use client";

import { OnboardingHero } from "@/features/p1-dashboard/components/OnboardingHero";
import { useRouter } from "next/navigation";

export default function PlaygroundPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to main dashboard after onboarding
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <OnboardingHero 
        modelUrl="/models/drone.glb" 
        onComplete={handleComplete}
      />
    </div>
  );
}
