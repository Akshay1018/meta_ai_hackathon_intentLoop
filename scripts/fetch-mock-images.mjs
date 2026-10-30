/**
 * One-time bake of mock photos into public/mock-images (Unsplash license — run once in dev).
 * Runtime app uses /mock-images/* only (no CDN).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/mock-images");

const assets = [
  { file: "feed-1.jpg", url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=800&fit=crop&q=80" },
  { file: "feed-2.jpg", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=800&fit=crop&q=80" },
  { file: "feed-3.jpg", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop&q=80" },
  { file: "feed-4.jpg", url: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=800&fit=crop&q=80" },
  { file: "reel-1.jpg", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1600&fit=crop&q=80" },
  { file: "reel-2.jpg", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&h=1600&fit=crop&q=80" },
  { file: "reel-3.jpg", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&h=1600&fit=crop&q=80" },
  { file: "create.jpg", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop&q=80" },
  { file: "grid-1.jpg", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80" },
  { file: "grid-2.jpg", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&q=80" },
  { file: "grid-3.jpg", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&q=80" },
  { file: "grid-4.jpg", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop&q=80" },
  { file: "grid-5.jpg", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop&q=80" },
  { file: "grid-6.jpg", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop&q=80" },
  { file: "grid-7.jpg", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80" },
  { file: "grid-8.jpg", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop&q=80" },
  { file: "grid-9.jpg", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop&q=80" },
];

fs.mkdirSync(outDir, { recursive: true });

let failed = 0;
for (const { file, url } of assets) {
  const dest = path.join(outDir, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log("skip", file);
    continue;
  }
  process.stdout.write(`fetch ${file}… `);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(buf.length, "bytes");
  } catch (e) {
    console.log("FAIL", e instanceof Error ? e.message : e);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
