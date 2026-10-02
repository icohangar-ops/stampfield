function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

// Keep sample canvases reachable until toBlob finishes.
const retainedCanvases = new Set<HTMLCanvasElement>();

async function canvasBlob(canvas: HTMLCanvasElement) {
  retainedCanvases.add(canvas);
  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", 0.86);
    });
    if (!blob) throw new Error("Could not draw the sample photo.");
    return blob;
  } finally {
    retainedCanvases.delete(canvas);
  }
}

function grain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number,
) {
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 16) {
    const shift = (rand() - 0.5) * 28;
    data[i] = clamp(data[i] + shift);
    data[i + 1] = clamp(data[i + 1] + shift);
    data[i + 2] = clamp(data[i + 2] + shift);
  }
  ctx.putImageData(image, 0, 0);
}

function stampSample(ctx: CanvasRenderingContext2D, width: number) {
  ctx.save();
  ctx.fillStyle = "rgba(28, 25, 21, 0.72)";
  ctx.fillRect(width - 168, 24, 132, 36);
  ctx.fillStyle = "#f6f3ec";
  ctx.font = "700 18px sans-serif";
  ctx.fillText("SAMPLE", width - 150, 48);
  ctx.restore();
}

function paintBank(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const rand = mulberry32(18);
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.46);
  sky.addColorStop(0, "#d5e3ea");
  sky.addColorStop(1, "#b7cbb0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#6d8a62";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.42);
  for (let x = 0; x <= width; x += 40) {
    ctx.lineTo(x, height * 0.34 + Math.sin(x / 90) * 28 + rand() * 16);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  const water = ctx.createLinearGradient(0, height * 0.48, 0, height * 0.72);
  water.addColorStop(0, "#7ea097");
  water.addColorStop(1, "#4f6f68");
  ctx.fillStyle = water;
  ctx.fillRect(0, height * 0.5, width, height * 0.22);

  ctx.strokeStyle = "rgba(246, 243, 236, 0.35)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = height * 0.54 + i * 18;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(width * 0.3, y - 8, width * 0.6, y + 10, width, y - 4);
    ctx.stroke();
  }

  const bank = ctx.createLinearGradient(0, height * 0.68, 0, height);
  bank.addColorStop(0, "#8d6a45");
  bank.addColorStop(1, "#3f4d32");
  ctx.fillStyle = bank;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.quadraticCurveTo(width * 0.45, height * 0.62, width, height * 0.74);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.strokeStyle = "#1d3324";
  ctx.lineWidth = 3;
  for (let i = 0; i < 70; i++) {
    const x = rand() * width;
    const y = height * 0.72 + rand() * height * 0.22;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 10, y - 40 - rand() * 70);
    ctx.stroke();
  }

  ctx.fillStyle = "#c2410c";
  ctx.fillRect(width * 0.18, height * 0.66, 8, 70);
  ctx.beginPath();
  ctx.moveTo(width * 0.18 + 8, height * 0.66);
  ctx.lineTo(width * 0.18 + 46, height * 0.66 + 12);
  ctx.lineTo(width * 0.18 + 8, height * 0.66 + 24);
  ctx.fill();

  grain(ctx, width, height, rand);
  stampSample(ctx, width);
}

function paintCulvert(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const rand = mulberry32(44);
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#c5ced4");
  sky.addColorStop(0.45, "#a9b7ae");
  sky.addColorStop(1, "#6e6256");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#8d8680";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.78);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.fillStyle = "#6e7370";
  ctx.fillRect(width * 0.18, height * 0.42, width * 0.64, height * 0.28);
  ctx.fillStyle = "#3c4140";
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.56, width * 0.16, height * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8a4b24";
  ctx.beginPath();
  ctx.moveTo(width * 0.42, height * 0.62);
  ctx.quadraticCurveTo(width * 0.5, height * 0.78, width * 0.7, height * 0.84);
  ctx.lineTo(width * 0.62, height * 0.9);
  ctx.quadraticCurveTo(width * 0.46, height * 0.82, width * 0.38, height * 0.68);
  ctx.fill();

  ctx.fillStyle = "#5c574f";
  for (let i = 0; i < 46; i++) {
    const x = width * 0.2 + rand() * width * 0.62;
    const y = height * 0.74 + rand() * height * 0.2;
    ctx.beginPath();
    ctx.ellipse(x, y, 10 + rand() * 22, 8 + rand() * 12, rand(), 0, Math.PI * 2);
    ctx.fill();
  }

  grain(ctx, width, height, rand);
  stampSample(ctx, width);
}

function paintFacade(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const rand = mulberry32(72);
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.35);
  sky.addColorStop(0, "#9eb8d2");
  sky.addColorStop(1, "#d7e1ea");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height * 0.38);

  ctx.fillStyle = "#b08968";
  ctx.fillRect(0, height * 0.28, width, height * 0.72);

  ctx.strokeStyle = "rgba(92, 58, 40, 0.35)";
  ctx.lineWidth = 2;
  for (let y = height * 0.32; y < height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const windows: [number, number][] = [
    [0.16, 0.4],
    [0.4, 0.4],
    [0.64, 0.4],
    [0.16, 0.62],
    [0.4, 0.62],
    [0.64, 0.62],
  ];
  for (const [x, y] of windows) {
    ctx.fillStyle = "#d5e6ef";
    ctx.fillRect(width * x, height * y, width * 0.16, height * 0.14);
    ctx.strokeStyle = "#3d342c";
    ctx.lineWidth = 6;
    ctx.strokeRect(width * x, height * y, width * 0.16, height * 0.14);
    ctx.beginPath();
    ctx.moveTo(width * x + width * 0.08, height * y);
    ctx.lineTo(width * x + width * 0.08, height * y + height * 0.14);
    ctx.stroke();
  }

  ctx.strokeStyle = "#6b2d16";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.7, height * 0.38);
  ctx.lineTo(width * 0.74, height * 0.48);
  ctx.lineTo(width * 0.71, height * 0.58);
  ctx.stroke();

  ctx.fillStyle = "#6d7470";
  ctx.fillRect(0, height * 0.9, width, height * 0.1);

  grain(ctx, width, height, rand);
  stampSample(ctx, width);
}

export async function paintSample(kind: "bank" | "culvert" | "facade") {
  const width = 1200;
  const height = 900;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");
  if (kind === "bank") paintBank(ctx, width, height);
  else if (kind === "culvert") paintCulvert(ctx, width, height);
  else paintFacade(ctx, width, height);
  const blob = await canvasBlob(canvas);
  return { blob, width, height };
}
