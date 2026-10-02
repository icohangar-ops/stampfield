export type MapPoint = {
  lat: number;
  lng: number;
  label: string;
};

export function drawStampMap(
  canvas: HTMLCanvasElement,
  points: MapPoint[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#efe8da";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d9d0c2";
  ctx.lineWidth = Math.max(1, width / 500);
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo((width * i) / 6, 28);
    ctx.lineTo((width * i) / 6, height - 36);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(24, (height * i) / 6);
    ctx.lineTo(width - 24, (height * i) / 6);
    ctx.stroke();
  }

  ctx.fillStyle = "#5c564c";
  ctx.font = `${Math.max(12, Math.round(width / 52))}px sans-serif`;
  ctx.fillText("N", width / 2 - 6, 22);

  if (points.length === 0) {
    ctx.fillText("No coordinates to plot", 32, height / 2);
    return;
  }

  let minLat = Math.min(...points.map((point) => point.lat));
  let maxLat = Math.max(...points.map((point) => point.lat));
  let minLng = Math.min(...points.map((point) => point.lng));
  let maxLng = Math.max(...points.map((point) => point.lng));
  const latPad = Math.max((maxLat - minLat) * 0.35, 0.0012);
  const lngPad = Math.max((maxLng - minLng) * 0.35, 0.0012);
  minLat -= latPad;
  maxLat += latPad;
  minLng -= lngPad;
  maxLng += lngPad;

  const padX = width * 0.08;
  const padY = height * 0.12;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const project = (lat: number, lng: number) => ({
    x: padX + ((lng - minLng) / (maxLng - minLng)) * plotW,
    y: padY + ((maxLat - lat) / (maxLat - minLat)) * plotH,
  });

  for (const point of points) {
    const { x, y } = project(point.lat, point.lng);
    ctx.beginPath();
    ctx.fillStyle = "#c2410c";
    ctx.arc(x, y, Math.max(5, width / 140), 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1c1915";
    ctx.stroke();
    ctx.fillStyle = "#1c1915";
    ctx.font = `700 ${Math.max(13, Math.round(width / 48))}px sans-serif`;
    ctx.fillText(point.label, x + 12, y - 8);
  }

  ctx.fillStyle = "#5c564c";
  ctx.font = `${Math.max(11, Math.round(width / 62))}px sans-serif`;
  ctx.fillText(
    "Schematic plot of stamp coordinates. Not a certified survey.",
    20,
    height - 14,
  );
}
