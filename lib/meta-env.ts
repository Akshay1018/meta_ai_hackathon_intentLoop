export function museImageModelId(): string {
  return process.env.MUSE_IMAGE_MODEL?.trim() || "muse-image-1.0";
}

export function museVoiceModelId(): string {
  return process.env.MUSE_VOICE_MODEL?.trim() || "muse-voice-transcribe-1.0";
}

export function museSamModelId(): string {
  return process.env.MUSE_SAM_MODEL?.trim() || "sam-3.1";
}

export function wantMetaFixture(body?: { fixture?: boolean }): boolean {
  if (process.env.INTENTLOOP_FIXTURE === "1") return true;
  if (body?.fixture === true) return true;
  return false;
}
