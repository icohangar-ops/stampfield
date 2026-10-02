export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "project";
}

export function formatCoord(value: number | null, digits = 5) {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toFixed(digits);
}

export function formatCoords(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return "No coordinates";
  return `${formatCoord(lat)}, ${formatCoord(lng)}`;
}

export function formatAccuracy(accuracyM: number | null) {
  if (accuracyM == null || !Number.isFinite(accuracyM)) return null;
  return `±${Math.round(accuracyM)} m`;
}

export function formatIso(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString();
}

export function formatLocal(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function gpsSourceLabel(source: "device" | "manual" | "unavailable") {
  if (source === "device") return "Device GPS";
  if (source === "manual") return "Manual override";
  return "Not recorded";
}

export function fileStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function parseCoord(raw: string, kind: "lat" | "lng") {
  const value = Number(raw.trim());
  if (!Number.isFinite(value)) return null;
  if (kind === "lat" && (value < -90 || value > 90)) return null;
  if (kind === "lng" && (value < -180 || value > 180)) return null;
  return value;
}
