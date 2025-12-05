import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // =========================================================================
  // PERFORMANCE OPTIMIZATIONS FOR SUPERFAST SaaS PAGE
  // =========================================================================
  
  // React Compiler for automatic memoization
  reactCompiler: true,

  // Turbopack config (required for Next.js 16+)
  turbopack: {},

  // Experimental features for maximum performance
  experimental: {
    // Optimize package imports (tree-shaking) - EXCLUDING Babylon.js to prevent missing methods
    optimizePackageImports: [
      "@phosphor-icons/react",
      "framer-motion",
    ],
    // Enable scroll restoration
    scrollRestoration: true,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
