"use client";

import { useEffect, useState } from "react";

import { isRateLimited, parseRetryAfterSeconds, type ApiJson } from "@/lib/api-client";
import { readCachedIntent, writeCachedIntent } from "@/lib/intent-cache";
import { rateLimitIntentHint } from "@/lib/rate-limit-messages";
import { readActivePersonaId } from "@/lib/persona-store";
import type { IntentCard, IntentSurface } from "@/lib/schemas";

type State = {
  card: IntentCard | null;
  loading: boolean;
  fixture: boolean;
  error: boolean;
  rateLimitHint: string | null;
};

const useFixtureClient = process.env.NEXT_PUBLIC_INTENTLOOP_FIXTURE === "1";
type FetchResult =
  | { card: IntentCard; fixture: boolean }
  | { rateLimited: string }
  | null;
const inflight = new Map<string, Promise<FetchResult>>();

export function useIntentCard(surface: IntentSurface): State {
  const [state, setState] = useState<State>({
    card: null,
    loading: true,
    fixture: false,
    error: false,
    rateLimitHint: null,
  });

  useEffect(() => {
    const cached = readCachedIntent(surface);
    if (cached) {
      setState({ card: cached, loading: false, fixture: false, error: false, rateLimitHint: null });
      return;
    }

    let cancelled = false;
    const existing = inflight.get(surface);
    const task =
      existing ??
      (async () => {
        const personaId = readActivePersonaId();
        const body: { surface: IntentSurface; fixture?: boolean; personaId?: string } = {
          surface,
        };
        if (useFixtureClient) body.fixture = true;
        if (personaId) body.personaId = personaId;
        const res = await fetch("/api/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await res.json()) as ApiJson & {
          card?: IntentCard;
          fixture?: boolean;
        };
        if (isRateLimited(res, json)) {
          const retry = parseRetryAfterSeconds(res, json);
          return { rateLimited: rateLimitIntentHint(retry) } as const;
        }
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
          setState({
            card: null,
            loading: false,
            fixture: false,
            error: true,
            rateLimitHint: null,
          });
          return;
        }
        if ("rateLimited" in result) {
          setState({
            card: null,
            loading: false,
            fixture: false,
            error: false,
            rateLimitHint: result.rateLimited ?? null,
          });
          return;
        }
        setState({
          card: result.card,
          loading: false,
          fixture: result.fixture,
          error: false,
          rateLimitHint: null,
        });
      })
      .catch(() => {
        inflight.delete(surface);
        if (!cancelled) {
          setState({
            card: null,
            loading: false,
            fixture: false,
            error: true,
            rateLimitHint: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surface]);

  return state;
}
