export type SurroundingsNote = {
  at: number;
  nudge: string;
  source: "manual" | "auto";
};

const KEY = "intentloop:visit-surroundings";

export function appendVisitSurroundingsNote(note: Omit<SurroundingsNote, "at"> & { at?: number }): void {
  if (typeof window === "undefined") return;
  const entry: SurroundingsNote = {
    at: note.at ?? Date.now(),
    nudge: note.nudge.trim(),
    source: note.source,
  };
  if (!entry.nudge) return;
  try {
    const prev = readVisitSurroundingsNotes();
    const last = prev[prev.length - 1];
    if (last?.nudge === entry.nudge) return;
    sessionStorage.setItem(KEY, JSON.stringify([...prev, entry].slice(-12)));
  } catch {
    sessionStorage.setItem(KEY, JSON.stringify([entry]));
  }
}

export function readVisitSurroundingsNotes(): SurroundingsNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is SurroundingsNote =>
        !!n &&
        typeof n === "object" &&
        typeof (n as SurroundingsNote).nudge === "string" &&
        ((n as SurroundingsNote).source === "manual" || (n as SurroundingsNote).source === "auto"),
    );
  } catch {
    return [];
  }
}

/** One line for visit summary — prefers the strongest / latest unique nudge. */
export function visitSurroundingsSummaryLine(): string | null {
  const notes = readVisitSurroundingsNotes();
  if (notes.length === 0) return null;
  const behind = notes.find((n) => /behind|recording|filming|private|phones/i.test(n.nudge));
  return (behind ?? notes[notes.length - 1]).nudge;
}

export function clearVisitSurroundings(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
