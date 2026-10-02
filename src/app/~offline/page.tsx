import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-4 px-6 py-16">
      <p className="font-mono text-xs tracking-[0.16em] text-[#9a3412]">STAMPFIELD</p>
      <h1 className="font-heading text-4xl tracking-tight">You are offline</h1>
      <p className="text-muted-foreground">
        This page was not cached yet. Open Projects, Capture, or Gallery once
        while online, then those screens stay available with the photos already
        stored on this device.
      </p>
      <Link href="/field" className="font-medium underline underline-offset-4">
        Try projects
      </Link>
    </main>
  );
}
