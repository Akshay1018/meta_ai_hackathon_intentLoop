/** Fetch a preview image URL and return base64 (client-side for surroundings check). */

export async function imageUrlToBase64(url: string): Promise<{ b64: string; mime: string }> {
  const res = await fetch(url);
  const blob = await res.blob();
  const mime = blob.type.startsWith("image/") ? blob.type : "image/jpeg";
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) throw new Error("Could not read image");
  return { b64: m[2] ?? "", mime: m[1] ?? mime };
}
