import { CAPTURE_CSV_COLUMNS, toCsv } from "@/lib/csv";
import { downloadText } from "@/lib/download";
import { fileStamp, formatCoords, gpsSourceLabel, slugify } from "@/lib/format";
import { drawStampMap } from "@/lib/map-draw";
import { PRODUCT_NAME, PRO_PRICE } from "@/lib/constants";
import type { Capture, Project } from "@/lib/types";

function chronological(captures: Capture[]) {
  return [...captures].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the photo."));
    reader.readAsDataURL(blob);
  });
}

export function buildCaptureCsv(project: Project, captures: Capture[]) {
  const rows = chronological(captures).map((capture) => ({
    capture_id: capture.id,
    project_id: project.id,
    project_name: project.name,
    captured_at_iso: capture.createdAt,
    latitude: capture.lat,
    longitude: capture.lng,
    accuracy_m: capture.accuracyM,
    gps_source: capture.gpsSource,
    note: capture.note,
    width: capture.width,
    height: capture.height,
    byte_size: capture.byteSize,
    sample: capture.sample ? "yes" : "no",
  }));
  return toCsv([...CAPTURE_CSV_COLUMNS], rows);
}

export function downloadCaptureCsv(project: Project, captures: Capture[]) {
  const csv = buildCaptureCsv(project, captures);
  downloadText(
    `${PRODUCT_NAME.toLowerCase()}-${slugify(project.name)}-${fileStamp()}.csv`,
    csv,
    "text/csv;charset=utf-8",
  );
}

export async function downloadProjectPdf(
  project: Project,
  captures: Capture[],
  blobs: Map<string, Blob>,
  proUnlocked: boolean,
) {
  const { jsPDF } = await import("jspdf");
  const ordered = chronological(captures);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;

  const footer = (page: number, total: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 84, 74);
    doc.text(
      `${PRODUCT_NAME}  ·  ${project.name}  ·  ${page} / ${total}`,
      margin,
      pageHeight - 22,
    );
  };

  doc.setFillColor(20, 87, 63);
  doc.rect(0, 0, pageWidth, 10, "F");
  doc.setTextColor(154, 52, 18);
  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.text(PRODUCT_NAME.toUpperCase(), margin, 42);
  doc.setTextColor(28, 25, 21);
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  const titleLines = doc.splitTextToSize(project.name, contentWidth);
  doc.text(titleLines, margin, 78);
  let cursor = 78 + titleLines.length * 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 46, 40);
  const intro = doc.splitTextToSize(
    `Field report generated ${new Date().toISOString()}. ${ordered.length} stamped photo${ordered.length === 1 ? "" : "s"}. Coordinates come from the device GPS fix or a manual override saved with the photo. ${proUnlocked ? "Pro unlock is active on this device." : `Lite report. Pro is a one-time ${PRO_PRICE} unlock, not a subscription.`}`,
    contentWidth,
  );
  doc.text(intro, margin, cursor);
  cursor += intro.length * 15 + 16;

  const points = ordered.flatMap((capture, index) =>
    capture.lat != null && capture.lng != null
      ? [{ lat: capture.lat, lng: capture.lng, label: String(index + 1) }]
      : [],
  );

  if (points.length > 0) {
    const map = document.createElement("canvas");
    map.width = 1000;
    map.height = 520;
    drawStampMap(map, points);
    const mapHeight = 210;
    if (cursor + mapHeight > pageHeight - 60) {
      doc.addPage();
      cursor = margin;
    }
    doc.addImage(map.toDataURL("image/png"), "PNG", margin, cursor, contentWidth, mapHeight);
    cursor += mapHeight + 18;
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No coordinates were recorded for this project.", margin, cursor);
    cursor += 22;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(28, 25, 21);
  doc.text("Index", margin, cursor);
  cursor += 16;
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  ordered.forEach((capture, index) => {
    const line = `${index + 1}.  ${capture.createdAt}  ${formatCoords(capture.lat, capture.lng)}`;
    const wrapped = doc.splitTextToSize(line, contentWidth);
    if (cursor > pageHeight - 48) {
      doc.addPage();
      cursor = margin;
    }
    doc.text(wrapped, margin, cursor);
    cursor += wrapped.length * 12;
  });

  for (const [index, capture] of ordered.entries()) {
    doc.addPage();
    doc.setFillColor(20, 87, 63);
    doc.rect(0, 0, pageWidth, 8, "F");
    doc.setTextColor(154, 52, 18);
    doc.setFont("courier", "bold");
    doc.setFontSize(11);
    doc.text(`${PRODUCT_NAME.toUpperCase()}  ·  ${String(index + 1).padStart(2, "0")}`, margin, 36);
    doc.setTextColor(28, 25, 21);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const note = capture.note.trim() || "No note";
    const noteLines = doc.splitTextToSize(note, contentWidth);
    doc.text(noteLines, margin, 58);

    const blob = blobs.get(capture.id);
    let imageBottom = 70 + noteLines.length * 14;
    if (blob) {
      try {
        const dataUrl = await blobToDataUrl(blob);
        const maxW = contentWidth;
        const maxH = 360;
        const ratio = Math.min(maxW / capture.width, maxH / capture.height);
        const drawW = capture.width * ratio;
        const drawH = capture.height * ratio;
        const imageY = 70 + noteLines.length * 14;
        doc.addImage(dataUrl, "JPEG", margin, imageY, drawW, drawH);
        imageBottom = imageY + drawH + 18;
      } catch {
        doc.text("Photo could not be embedded.", margin, imageBottom + 16);
        imageBottom += 32;
      }
    }

    const meta = [
      `Time     ${capture.createdAt}`,
      `GPS      ${formatCoords(capture.lat, capture.lng)}`,
      `Source   ${gpsSourceLabel(capture.gpsSource)}${capture.accuracyM != null ? `   ±${Math.round(capture.accuracyM)} m` : ""}`,
      `Frame    ${capture.width} × ${capture.height} px`,
    ];
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text(meta, margin, Math.min(imageBottom + 8, pageHeight - 80));
  }

  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    footer(page, total);
  }

  doc.save(
    `${PRODUCT_NAME.toLowerCase()}-${slugify(project.name)}-${fileStamp()}.pdf`,
  );
}
