"use client";

import { useCallback, useEffect, useState } from "react";

import {
  limitPhase,
  limitSeconds,
  readLimitSkipped,
  readSessionStartedAt,
  readSnoozeUntil,
  remainingSeconds,
  writeLimitSkipped,
  writeSnoozeUntil,
  type LimitPhase,
  type SessionSettings,
} from "@/lib/session";

type LimitState = {
  phase: LimitPhase;
  remaining: number;
  skip: () => void;
  remindHours: (hours: number) => void;
};

export function useLimitTimer(settings: SessionSettings): LimitState {
  const [now, setNow] = useState(() => Date.now());
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [skipped, setSkipped] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState(0);

  useEffect(() => {
    const t = Date.now();
    setStartedAt(readSessionStartedAt(t));
    setSkipped(readLimitSkipped());
    setSnoozeUntil(readSnoozeUntil());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const limitSec = limitSeconds(settings);
  const phase = limitPhase({
    enabled: settings.enabled,
    now,
    startedAt,
    limitSec,
    skipped,
    snoozeUntil,
  });

  const skip = useCallback(() => {
    writeLimitSkipped();
    setSkipped(true);
  }, []);

  const remindHours = useCallback((hours: number) => {
    const until = Date.now() + hours * 60 * 60 * 1000;
    writeSnoozeUntil(until);
    setSnoozeUntil(until);
  }, []);

  return {
    phase,
    remaining: remainingSeconds({ now, startedAt, limitSec }),
    skip,
    remindHours,
  };
}
