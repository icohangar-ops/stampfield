import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  // Dev is opened at 127.0.0.1 in this environment. Next only allowlists
  // localhost by default, which blocks the HMR socket and stalls hydration.
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    useOffline: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
