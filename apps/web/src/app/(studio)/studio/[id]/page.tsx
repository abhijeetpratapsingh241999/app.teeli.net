/**
 * Studio Page - Dynamic Route
 * The 3D Editor - Teeli's core workspace
 */

import { StudioLayout } from "@/features/studio";

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = await params;
  
  return <StudioLayout />;
}

// Generate metadata for the studio page
export async function generateMetadata({ params }: StudioPageProps) {
  const { id } = await params;
  
  return {
    title: `Studio - Project ${id} | Teeli`,
    description: "3D Model Editor with Auto-Heal and Cloud Rendering",
  };
}
