import {
  formatAccuracy,
  formatCoords,
  gpsSourceLabel,
} from "@/lib/format";
import type { GpsSource } from "@/lib/types";

export function StampOverlay({
  lat,
  lng,
  accuracyM,
  takenAt,
  note,
  source,
}: {
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  takenAt: string;
  note?: string;
  source: GpsSource;
}) {
  const accuracy = formatAccuracy(accuracyM);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#141311]/80 px-3 py-2 text-[11px] leading-snug text-[#f6f3ec] sm:text-xs">
      <div className="flex items-center justify-between gap-3 font-mono">
        <span className="tracking-[0.14em] text-[#f3b08a]">STAMPFIELD</span>
        <span>{gpsSourceLabel(source).toUpperCase()}</span>
      </div>
      <p className="mt-1 font-mono">
        {formatCoords(lat, lng)}
        {accuracy ? `  ${accuracy}` : ""}
      </p>
      <p className="font-mono">{takenAt}</p>
      {note ? <p className="mt-1 line-clamp-2 text-[#f6f3ec]/90">{note}</p> : null}
    </div>
  );
}
