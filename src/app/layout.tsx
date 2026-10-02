import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";
import { SerwistProvider } from "@serwist/turbopack/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  applicationName: "StampField",
  title: {
    default: "StampField — field photos, buy once",
    template: "%s · StampField",
  },
  description:
    "Offline field photos with GPS, an ISO timestamp, and notes. Export a PDF or CSV. One-time unlock, no account.",
  appleWebApp: {
    capable: true,
    title: "StampField",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#14573f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} ${ibmPlex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <SerwistProvider
          swUrl="/serwist/sw.js"
          disable={process.env.NODE_ENV === "development"}
          options={{ scope: "/", updateViaCache: "none" }}
        >
          <ThemeProvider>
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
