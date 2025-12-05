/**
 * Studio Layout
 * Full-screen immersive 3D editor experience
 * NO Dashboard Sidebar/Header - just the canvas and floating HUD
 * Forces dark theme for consistent visual experience
 * @created 2025-12-03
 */

import { ThemeProvider } from "@/components/theme-provider";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <div className="h-screen w-screen overflow-hidden bg-[#050508]">
        {children}
      </div>
    </ThemeProvider>
  );
}
