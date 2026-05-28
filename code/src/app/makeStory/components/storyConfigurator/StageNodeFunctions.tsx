
export type PositionalNode = {
  x: number;
  y: number;
};

// Clamping limiting zooming in/out
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

// depending on the position of our destination (top left top right bottom left bottom right) we change the arrow to point FROM a particular point on the chapter
// We do the same for the destination chapter.
export const getEdgePoints = (from: PositionalNode, to: PositionalNode) => {
  const NODE_W = 150;
  const NODE_H = 150;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const goSideways = Math.abs(dx) >= Math.abs(dy);

  const sourcePoint = goSideways
    ? [from.x + (dx >= 0 ? NODE_W : 0), from.y + NODE_H / 2]
    : [from.x + NODE_W / 2, from.y + (dy >= 0 ? NODE_H : 0)];

  const destPoint = goSideways
    ? [to.x + (dx >= 0 ? 0 : NODE_W), to.y + NODE_H / 2]
    : [to.x + NODE_W / 2, to.y + (dy >= 0 ? 0 : NODE_H)];

  return [...sourcePoint, ...destPoint];
};

const fitDimensions = (w: number, h: number, maxW: number, maxH: number) => {
  if (w <= maxW && h <= maxH) return { w, h, scaled: false };
  if (w / h > maxW / maxH) {
    return { w: maxW, h: Math.round((h * maxW) / w), scaled: true };
  }
  return { w: Math.round((w * maxH) / h), h: maxH, scaled: true };
};

const renderBitmapToCanvas = (bitmap: ImageBitmap, w: number, h: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas;
};

// decodes off the main thread via createImageBitmap, returns a lightweight canvas for Konva
export const createCanvasThumbnail = async (blob: Blob): Promise<HTMLCanvasElement> => {
  const bitmap = await createImageBitmap(blob);
  const { w, h } = fitDimensions(bitmap.width, bitmap.height, 300, 225);
  return renderBitmapToCanvas(bitmap, w, h);
};

// downscales image bytes for ZIP storage, returns original bytes if already within bounds
export const downscaleImageBytes = async (bytes: Uint8Array, maxW = 1920, maxH = 1080): Promise<Uint8Array> => {
  try {
    const blob = new Blob([bytes as any]);
    const bitmap = await createImageBitmap(blob);
    const { w, h, scaled } = fitDimensions(bitmap.width, bitmap.height, maxW, maxH);

    if (!scaled) {
      bitmap.close();
      return bytes;
    }

    const canvas = renderBitmapToCanvas(bitmap, w, h);
    const resultBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
    );
    if (!resultBlob) return bytes;

    return new Uint8Array(await resultBlob.arrayBuffer());
  } catch (err) {
    console.error("Failed to downscale image bytes:", err);
    return bytes;
  }
};
