import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Let Next.js handle convex bundling naturally
  transpilePackages: ["convex", "@convex-dev/auth"],
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Service worker and asset headers
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
