import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// System fonts (no network dependency - works offline)
// Uses native system fonts like SF Pro, Segoe UI, etc.

export const metadata: Metadata = {
  title: "Teeli - High-End 3D Rendering SaaS",
  description: "Professional 3D rendering platform for architects and designers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
