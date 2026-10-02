const MAX_EDGE = 1600;
const MAX_BYTES = 20 * 1024 * 1024;

export async function fileToStoredImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a JPEG, PNG, or other image file.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That photo is over 20 MB. Choose a smaller file.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    throw new Error(
      "This browser could not read that image. Try a JPEG or PNG.",
    );
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not prepare the photo.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Keep the canvas reachable until toBlob finishes. Detached canvases can be
  // cleared before the encoder runs.
  const retained = new Set<HTMLCanvasElement>([canvas]);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/jpeg", 0.84);
  });
  retained.delete(canvas);
  if (!blob) throw new Error("Could not store the photo.");
  return { blob, width, height };
}
