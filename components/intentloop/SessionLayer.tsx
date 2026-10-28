"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { BriefSheet } from "@/components/intentloop/BriefSheet";
import { LimitSheet } from "@/components/intentloop/LimitSheet";
import { useExitBrief } from "@/components/intentloop/useExitBrief";
import { useLimitTimer } from "@/components/intentloop/useLimitTimer";
import { useSessionSettings } from "@/components/intentloop/useSessionSettings";
import type { IntentSurface } from "@/lib/schemas";

function actionHref(surface: IntentSurface | undefined): string {
  switch (surface) {
    case "dms":
      return "/dms";
    case "create":
      return "/create";
    case "reels":
      return "/reels";
    case "profile":
      return "/profile/activity";
    default:
      return "/";
  }
}

export function SessionLayer() {
  const router = useRouter();
  const { settings } = useSessionSettings();
  const { phase, skip, remindHours } = useLimitTimer(settings);
  const { loading, brief, fallbackNote, intent, fetchBrief, reset } = useExitBrief();
  const [briefOpen, setBriefOpen] = useState(false);

  const onSeeBrief = useCallback(async () => {
    setBriefOpen(true);
    await fetchBrief();
  }, [fetchBrief]);

  const closeBrief = useCallback(() => {
    setBriefOpen(false);
    skip();
    reset();
  }, [reset, skip]);

  const onAction = useCallback(() => {
    const href = actionHref(intent?.surface);
    closeBrief();
    router.push(href);
  }, [closeBrief, intent?.surface, router]);

  return (
    <>
      <LimitSheet
        open={phase === "open" && !briefOpen}
        onSkip={skip}
        onRemind1h={() => remindHours(1)}
        onRemind2h={() => remindHours(2)}
        onSeeBrief={() => void onSeeBrief()}
      />
      <BriefSheet
        open={briefOpen}
        loading={loading}
        brief={brief}
        fallbackNote={fallbackNote}
        onClose={closeBrief}
        onAction={onAction}
      />
    </>
  );
}
