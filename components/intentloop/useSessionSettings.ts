"use client";

import { useCallback, useEffect, useState } from "react";

import {
  defaultSessionSettings,
  readSessionSettings,
  writeSessionSettings,
  type SessionSettings,
} from "@/lib/session";

export function useSessionSettings() {
  const [settings, setSettings] = useState<SessionSettings>(defaultSessionSettings);

  useEffect(() => {
    setSettings(readSessionSettings());
  }, []);

  const update = useCallback((patch: Partial<SessionSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeSessionSettings(next);
      return next;
    });
  }, []);

  return { settings, update };
}
