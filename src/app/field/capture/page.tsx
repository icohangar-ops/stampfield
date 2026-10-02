import type { Metadata } from "next";
import { Suspense } from "react";
import { CaptureStudio } from "@/components/field/capture-studio";

export const metadata: Metadata = {
  title: "Capture",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Preparing the camera…</p>}>
      <CaptureStudio />
    </Suspense>
  );
}
