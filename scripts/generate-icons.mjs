import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([length, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const start = y * (width * 4 + 1);
    raw[start] = 0;
    rgba.copy(raw, start + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function inRoundRect(x, y, x0, y0, x1, y1, radius) {
  if (x < x0 || y < y0 || x > x1 || y > y1) return false;
  const cx = x < x0 + radius ? x0 + radius : x > x1 - radius ? x1 - radius : x;
  const cy = y < y0 + radius ? y0 + radius : y > y1 - radius ? y1 - radius : y;
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function drawIcon(size, { maskable = false } = {}) {
  const data = Buffer.alloc(size * size * 4);
  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  };
  const fillRect = (x0, y0, x1, y1, r, g, b, radius = 0) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (radius === 0 || inRoundRect(x, y, x0, y0, x1, y1, radius)) {
          set(x, y, r, g, b);
        }
      }
    }
  };

  const inset = maskable ? Math.round(size * 0.08) : 0;
  const radius = Math.round(size * 0.22);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inside = inRoundRect(
        x,
        y,
        inset,
        inset,
        size - 1 - inset,
        size - 1 - inset,
        radius,
      );
      if (inside) set(x, y, 20, 87, 63);
      else set(x, y, maskable ? 20 : 243, maskable ? 87 : 239, maskable ? 63 : 230, maskable ? 255 : 0);
    }
  }

  const cardX0 = Math.round(size * 0.24);
  const cardY0 = Math.round(size * 0.18);
  const cardX1 = Math.round(size * 0.76);
  const cardY1 = Math.round(size * 0.82);
  const cardRadius = Math.max(2, Math.round(size * 0.04));
  fillRect(cardX0, cardY0, cardX1, cardY1, 246, 243, 236, cardRadius);

  const barY = Math.round(size * 0.62);
  fillRect(cardX0, barY, cardX1, cardY1, 154, 52, 18, 0);
  fillRect(cardX0, barY, cardX1, barY + Math.max(1, Math.round(size * 0.015)), 246, 243, 236);

  const line = (yRatio, widthRatio) => {
    const y = Math.round(size * yRatio);
    const h = Math.max(1, Math.round(size * 0.025));
    const x0 = cardX0 + Math.round(size * 0.06);
    const x1 = x0 + Math.round((cardX1 - cardX0) * widthRatio);
    fillRect(x0, y, x1, y + h, 28, 25, 21);
  };
  line(0.3, 0.62);
  line(0.4, 0.48);
  line(0.5, 0.7);

  const dotR = Math.max(2, Math.round(size * 0.055));
  const cx = Math.round(size * 0.64);
  const cy = Math.round(size * 0.36);
  for (let y = cy - dotR; y <= cy + dotR; y++) {
    for (let x = cx - dotR; x <= cx + dotR; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= dotR * dotR) set(x, y, 194, 65, 12);
    }
  }

  return encodePng(size, size, data);
}

const outputs = [
  ["public/icons/icon-192.png", 192, false],
  ["public/icons/icon-512.png", 512, false],
  ["public/icons/maskable-512.png", 512, true],
  ["public/icons/apple-touch-icon.png", 180, true],
  ["src/app/icon.png", 32, false],
  ["src/app/apple-icon.png", 180, true],
];

for (const [file, size, maskable] of outputs) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, drawIcon(size, { maskable }));
}

console.log(`Wrote ${outputs.length} icons`);
