"use client";

import { useRouter } from "next/navigation";

import { LimitSheet } from "@/components/intentloop/LimitSheet";
import { useLimitTimer } from "@/components/intentloop/useLimitTimer";
import { useSessionSettings } from "@/components/intentloop/useSessionSettings";

export function SessionLayer() {
  const router = useRouter();
  const { settings } = useSessionSettings();
  const { phase, skip, remindHours } = useLimitTimer(settings);

  return (
    <LimitSheet
      open={phase === "open"}
      onSkip={skip}
      onRemind1h={() => remindHours(1)}
      onRemind2h={() => remindHours(2)}
      onSeeBrief={() => {
        skip();
        router.push("/profile/activity?brief=1");
      }}
    />
  );
}
