export function escapeCsv(value: string | number | null | undefined) {
  if (value == null) return "";
  const text = String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(
  columns: string[],
  rows: Record<string, string | number | null | undefined>[],
) {
  const header = columns.map((column) => escapeCsv(column)).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsv(row[column])).join(","),
  );
  return [header, ...lines].join("\r\n");
}

export const CAPTURE_CSV_COLUMNS = [
  "capture_id",
  "project_id",
  "project_name",
  "captured_at_iso",
  "latitude",
  "longitude",
  "accuracy_m",
  "gps_source",
  "note",
  "width",
  "height",
  "byte_size",
  "sample",
] as const;
