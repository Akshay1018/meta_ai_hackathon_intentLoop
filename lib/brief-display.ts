/** User-facing copy helpers for visit summary (not analytics). */

export function sanitizeHappened(text: string): string {
  const trimmed = text.trim();
  if (!/^\d+\./m.test(trimmed)) return trimmed;
  const lines = trimmed.split(/\n+/).filter((line) => !/^\d+\./.test(line.trim()));
  if (lines.length > 0) return lines.join(" ").slice(0, 280);
  const first = trimmed.split(/\n/)[0] ?? trimmed;
  return first.replace(/^\d+\.\s*/, "").slice(0, 280);
}

export function driftHeadline(drift: number): string {
  if (drift < 30) return "Mostly on track";
  if (drift < 60) return "Some drift";
  return "Got pulled away";
}

export function visitCardHook(brief: { drift: number }): string {
  if (brief.drift >= 55) return "Next visit: one small win.";
  return "Private reminder — not shared to your feed.";
}
