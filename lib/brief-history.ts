import type { PersonaId } from "@/lib/persona-catalog";
import type { ExitBrief, IntentCard } from "@/lib/schemas";

export type BriefRecord = {
  id: string;
  at: string;
  intentGoal: string;
  brief: ExitBrief;
  fixture: boolean;
  personaId?: PersonaId | null;
};

const KEY = "intentloop:briefs-today";

export function appendBriefRecord(
  intent: IntentCard,
  brief: ExitBrief,
  fixture: boolean,
  personaId: PersonaId | null = null,
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const list: BriefRecord[] = raw ? (JSON.parse(raw) as BriefRecord[]) : [];
    list.unshift({
      id: `${Date.now()}`,
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      intentGoal: intent.goal,
      brief,
      fixture,
      personaId,
    });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

export function readBriefRecords(): BriefRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BriefRecord[]) : [];
  } catch {
    return [];
  }
}
