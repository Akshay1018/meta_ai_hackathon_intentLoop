import { isPersonaId, type PersonaId } from "@/lib/persona-catalog";

const KEY = "intentloop:active-persona";

export function readActivePersonaId(): PersonaId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return isPersonaId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeActivePersonaId(id: PersonaId | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("intentloop:persona-changed"));
  } catch {
    /* ignore */
  }
}
