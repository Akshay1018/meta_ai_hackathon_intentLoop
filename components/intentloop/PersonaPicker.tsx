"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  PERSONAS,
  personaList,
  type PersonaId,
  type PersonaMetaTool,
} from "@/lib/personas";
import { readActivePersonaId, writeActivePersonaId } from "@/lib/persona-store";
import { resetDemoVisit } from "@/lib/session";

const TOOL_LABEL: Record<PersonaMetaTool, string> = {
  "spark-intent": "Spark intent",
  "spark-exit": "Spark exit brief",
  "spark-vision": "Screenshot match",
  voice: "Voice follow-up",
  "visit-card": "Visit card (Muse)",
};

type PersonaPickerProps = {
  onStarted?: () => void;
};

export function PersonaPicker({ onStarted }: PersonaPickerProps) {
  const router = useRouter();
  const [active, setActive] = useState<PersonaId | null>(null);
  const [selected, setSelected] = useState<PersonaId>("dms-first");

  useEffect(() => {
    const sync = () => setActive(readActivePersonaId());
    sync();
    window.addEventListener("intentloop:persona-changed", sync);
    return () => window.removeEventListener("intentloop:persona-changed", sync);
  }, []);

  const startVisit = useCallback(() => {
    writeActivePersonaId(selected);
    resetDemoVisit();
    window.dispatchEvent(new Event("intentloop:visit-reset"));
    window.dispatchEvent(new Event("intentloop:persona-changed"));
    const def = PERSONAS[selected];
    router.push(def.entryHref);
    onStarted?.();
  }, [onStarted, router, selected]);

  const clearPersona = useCallback(() => {
    writeActivePersonaId(null);
    setActive(null);
  }, []);

  const def = PERSONAS[selected];

  return (
    <div className="persona-picker">
      {active ? (
        <p className="activity-sub">
          Active: <strong>{PERSONAS[active].title}</strong>{" "}
          <button type="button" className="persona-clear" onClick={clearPersona}>
            Clear
          </button>
        </p>
      ) : (
        <p className="activity-hint">Pick a persona, then start a fresh visit with the right entry tab.</p>
      )}

      <label className="activity-row persona-select-row" htmlFor="persona-select">
        <span>Persona</span>
        <select
          id="persona-select"
          className="persona-select"
          value={selected}
          onChange={(e) => {
            const v = e.target.value;
            if (v in PERSONAS) setSelected(v as PersonaId);
          }}
        >
          {personaList().map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>

      <p className="activity-sub">{def.subtitle}</p>
      <p className="persona-impact">{def.impactLine}</p>
      <p className="activity-hint">
        <strong>Try:</strong> {def.visitScript}
      </p>
      <ul className="persona-tools" aria-label="Meta tools for this persona">
        {def.metaTools.map((t) => (
          <li key={t}>{TOOL_LABEL[t]}</li>
        ))}
      </ul>
      <button type="button" className="activity-reset-btn persona-start-btn" onClick={startVisit}>
        Start persona visit
      </button>
    </div>
  );
}
