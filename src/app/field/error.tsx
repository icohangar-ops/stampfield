"use client";

import { Button } from "@/components/ui/button";

export default function FieldError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg space-y-3">
      <h1 className="font-heading text-3xl">The field app hit a problem</h1>
      <p className="text-sm text-muted-foreground">
        Your photos are still in this browser if storage is available. Try the
        screen again.
      </p>
      <Button className="min-h-11" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
