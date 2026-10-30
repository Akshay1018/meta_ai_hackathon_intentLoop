/** Per-feature consent (local only). Off until user enables in Your activity or confirms in-flow. */

export type ConsentSettings = {
  photoMatch: boolean;
  surroundingsCheck: boolean;
  voiceSummary: boolean;
  visitCard: boolean;
};

const CONSENT_KEY = "intentloop:consent";

export function defaultConsentSettings(): ConsentSettings {
  return {
    photoMatch: false,
    surroundingsCheck: false,
    voiceSummary: false,
    visitCard: false,
  };
}

export function isConsentSettings(value: unknown): value is ConsentSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.photoMatch === "boolean" &&
    typeof v.surroundingsCheck === "boolean" &&
    typeof v.voiceSummary === "boolean" &&
    typeof v.visitCard === "boolean"
  );
}

export function readConsentSettings(): ConsentSettings {
  if (typeof window === "undefined") return defaultConsentSettings();
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return defaultConsentSettings();
    const parsed: unknown = JSON.parse(raw);
    return isConsentSettings(parsed) ? parsed : defaultConsentSettings();
  } catch {
    return defaultConsentSettings();
  }
}

export function writeConsentSettings(settings: ConsentSettings): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(settings));
}

export function patchConsent(patch: Partial<ConsentSettings>): ConsentSettings {
  const next = { ...readConsentSettings(), ...patch };
  writeConsentSettings(next);
  return next;
}
