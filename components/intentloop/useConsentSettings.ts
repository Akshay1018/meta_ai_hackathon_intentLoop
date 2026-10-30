"use client";

import { useCallback, useEffect, useState } from "react";

import {
  defaultConsentSettings,
  readConsentSettings,
  writeConsentSettings,
  type ConsentSettings,
} from "@/lib/consent";

export function useConsentSettings() {
  const [consent, setConsent] = useState<ConsentSettings>(defaultConsentSettings);

  useEffect(() => {
    setConsent(readConsentSettings());
  }, []);

  const update = useCallback((patch: Partial<ConsentSettings>) => {
    setConsent((prev) => {
      const next = { ...prev, ...patch };
      writeConsentSettings(next);
      return next;
    });
  }, []);

  return { consent, update };
}
