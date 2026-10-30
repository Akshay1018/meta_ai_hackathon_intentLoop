/** Encode mono 16 kHz WAV for Muse Voice Transcribe (browser). */

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

export function audioBufferToWav(buffer: AudioBuffer, targetSampleRate = 16000): Blob {
  const input = buffer.getChannelData(0);
  const length = Math.ceil(buffer.duration * targetSampleRate);
  const samples = new Float32Array(length);
  const ratio = buffer.sampleRate / targetSampleRate;
  for (let i = 0; i < length; i++) {
    const idx = Math.min(input.length - 1, Math.floor(i * ratio));
    samples[i] = input[idx] ?? 0;
  }

  const dataSize = samples.length * 2;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, targetSampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

export async function webmBlobToWav(webm: Blob): Promise<Blob> {
  const ctx = new AudioContext();
  try {
    const decoded = await ctx.decodeAudioData(await webm.arrayBuffer());
    return audioBufferToWav(decoded, 16000);
  } finally {
    await ctx.close();
  }
}
