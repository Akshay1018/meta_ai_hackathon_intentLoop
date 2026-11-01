/** Grab one JPEG frame from a live video element (client-only). */

export function captureVideoFrameBase64(
  video: HTMLVideoElement,
  quality = 0.82,
): { b64: string; mime: string } | null {
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) return null;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m?.[2]) return null;
  return { b64: m[2], mime: m[1] ?? "image/jpeg" };
}
