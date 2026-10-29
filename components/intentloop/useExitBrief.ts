"use client";

import { useCallback, useState } from "react";

import { appendBriefRecord } from "@/lib/brief-history";
import { readIntentCardsForVisit, readPrimaryIntentCard } from "@/lib/intent-primary";
import {
  fixtureIntentCard,
  type ExitBrief,
  type IntentCard,
} from "@/lib/schemas";
import { readSessionSettings, readSessionStartedAt } from "@/lib/session";
import { readPostedThisVisit } from "@/lib/visit-outcome";
import { readSurfaceVisitOrder, readSurfaceVisits } from "@/lib/visit-tracker";

const useFixtureClient = process.env.NEXT_PUBLIC_INTENTLOOP_FIXTURE === "1";

type BriefState = {
  loading: boolean;
  brief: ExitBrief | null;
  fallbackNote: string | null;
  intent: IntentCard | null;
};

export function useExitBrief() {
  const [state, setState] = useState<BriefState>({
    loading: false,
    brief: null,
    fallbackNote: null,
    intent: null,
  });

  const fetchBrief = useCallback(async () => {
    setState({ loading: true, brief: null, fallbackNote: null, intent: null });
    const startedAt = readSessionStartedAt(Date.now());
    const elapsedSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    const surfaceOrder = readSurfaceVisitOrder();
    const surfacesVisited = readSurfaceVisits();
    const intent =
      readPrimaryIntentCard(surfaceOrder) ??
      fixtureIntentCard(readPostedThisVisit() ? "create" : "home");
    const intentsBySurface = readIntentCardsForVisit(surfaceOrder);
    const postedThisVisit = readPostedThisVisit();

    const body = {
      intent,
      surfacesVisited,
      surfaceOrder,
      elapsedSec,
      postedThisVisit,
      intentsBySurface,
      ...(useFixtureClient ? { fixture: true } : {}),
    };

    try {
      const res = await fetch("/api/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        brief?: ExitBrief;
        fixture?: boolean;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.brief) {
        setState({
          loading: false,
          brief: null,
          fallbackNote: null,
          intent,
        });
        return intent;
      }
      appendBriefRecord(intent, json.brief, Boolean(json.fixture));
      window.dispatchEvent(new Event("intentloop:brief-saved"));
      setState({
        loading: false,
        brief: json.brief,
        fallbackNote: json.message ?? null,
        intent,
      });
      return intent;
    } catch {
      setState({ loading: false, brief: null, fallbackNote: null, intent });
      return intent;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, brief: null, fallbackNote: null, intent: null });
  }, []);

  return { ...state, fetchBrief, reset };
}
