"use client";

import { useEffect, useRef } from "react";
import { drawStampMap, type MapPoint } from "@/lib/map-draw";

export function StampMap({
  points,
  className,
}: {
  points: MapPoint[];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(320, Math.round(rect.width * scale));
    canvas.height = Math.max(180, Math.round(rect.height * scale));
    drawStampMap(canvas, points);
  }, [points]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={
        points.length
          ? `Schematic map with ${points.length} stamped location${points.length === 1 ? "" : "s"}`
          : "Schematic map with no coordinates yet"
      }
      className={className ?? "h-56 w-full rounded-xl border border-border bg-[#efe8da]"}
    />
  );
}
