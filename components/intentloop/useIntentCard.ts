"use client";

import { useEffect, useState } from "react";

import { readCachedIntent, writeCachedIntent } from "@/lib/intent-cache";
import type { IntentCard, IntentSurface } from "@/lib/schemas";

type State = {
  card: IntentCard | null;
  loading: boolean;
  fixture: boolean;
  error: boolean;
};

const useFixtureClient = process.env.NEXT_PUBLIC_INTENTLOOP_FIXTURE === "1";
type FetchResult = { card: IntentCard; fixture: boolean } | null;
const inflight = new Map<string, Promise<FetchResult>>();

export function useIntentCard(surface: IntentSurface): State {
  const [state, setState] = useState<State>({
    card: null,
    loading: true,
    fixture: false,
    error: false,
  });

  useEffect(() => {
    const cached = readCachedIntent(surface);
    if (cached) {
      setState({ card: cached, loading: false, fixture: false, error: false });
      return;
    }

    let cancelled = false;
    const existing = inflight.get(surface);
    const task =
      existing ??
      (async () => {
        const body: { surface: IntentSurface; fixture?: boolean } = { surface };
        if (useFixtureClient) body.fixture = true;
        const res = await fetch("/api/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          card?: IntentCard;
          fixture?: boolean;
        };
        if (!res.ok || !json.ok || !json.card) return null;
        writeCachedIntent(surface, json.card);
        return { card: json.card, fixture: Boolean(json.fixture) };
      })();
    if (!existing) inflight.set(surface, task);

    task
      .then((result) => {
        inflight.delete(surface);
        if (cancelled) return;
        if (!result) {
          setState({ card: null, loading: false, fixture: false, error: true });
          return;
        }
        setState({
          card: result.card,
          loading: false,
          fixture: result.fixture,
          error: false,
        });
      })
      .catch(() => {
        inflight.delete(surface);
        if (!cancelled) {
          setState({ card: null, loading: false, fixture: false, error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surface]);

  return state;
}
