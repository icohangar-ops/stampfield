import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StampField",
    short_name: "StampField",
    description:
      "Buy-once field photos with GPS, timestamp, and notes. Offline, no account.",
    start_url: "/field",
    scope: "/",
    display: "standalone",
    background_color: "#f3efe6",
    theme_color: "#14573f",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
