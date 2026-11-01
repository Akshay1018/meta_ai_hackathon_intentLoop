"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMacCamera } from "@/components/ig/useMacCamera";
import { ConsentBanner } from "@/components/intentloop/ConsentBanner";
import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { captureVideoFrameBase64 } from "@/lib/capture-video-frame";
import {
  readReelsAutoSurroundings,
  writeReelsAutoSurroundings,
} from "@/lib/reels-surroundings-pref";
import { shouldAutoSurfaceNudge } from "@/lib/surroundings-notify";
import { appendVisitSurroundingsNote } from "@/lib/visit-surroundings";
import { recordSurfaceVisit } from "@/lib/visit-tracker";

type SegmentSummary = {
  nudge: string;
  prompt?: string;
  alertLevel?: "none" | "caution" | "urgent";
};

const AUTO_CHECK_MS = 7000;

export function ReelsRecordSurface() {
  const { consent, update: updateConsent } = useConsentSettings();
  const camera = useMacCamera();
  const [mode, setMode] = useState<"record" | "live">("record");
  const [pendingConsent, setPendingConsent] = useState(false);
  const [wantRecordingAfterCamera, setWantRecordingAfterCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [manualBusy, setManualBusy] = useState(false);
  const [autoScanning, setAutoScanning] = useState(false);
  const [reelsAutoAlerts, setReelsAutoAlerts] = useState(true);
  const [nudge, setNudge] = useState<SegmentSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoInFlightRef = useRef(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const autoAlertsOn = consent.surroundingsCheck && reelsAutoAlerts;

  const onPreviewVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      previewVideoRef.current = node;
      camera.videoRef(node);
    },
    [camera.videoRef],
  );

  useEffect(() => {
    recordSurfaceVisit("reels");
    setReelsAutoAlerts(readReelsAutoSurroundings());
  }, []);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const applyNudge = useCallback((summary: SegmentSummary, source: "manual" | "auto") => {
    setNudge(summary);
    appendVisitSurroundingsNote({ nudge: summary.nudge, source });
  }, []);

  const runSurroundingsCheck = useCallback(
    async (source: "manual" | "auto") => {
      if (source === "auto" && !autoAlertsOn) return;
      if (!camera.active) {
        if (source === "manual") {
          setError("Turn on the camera preview first (tap the red button).");
        }
        return;
      }
      if (source === "auto" && autoInFlightRef.current) return;

      const video = previewVideoRef.current;
      if (!video) return;

      if (source === "manual") setManualBusy(true);
      else {
        autoInFlightRef.current = true;
        setAutoScanning(true);
      }
      setError(null);
      try {
        await new Promise((r) => setTimeout(r, source === "auto" ? 200 : 0));
        const frame = captureVideoFrameBase64(video);
        if (!frame) {
          if (source === "manual") {
            setError("Camera preview is not ready yet — try again in a second.");
          }
          return;
        }
        const useFixture = process.env.NEXT_PUBLIC_INTENTLOOP_FIXTURE === "1";
        const res = await fetch("/api/segment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: frame.b64,
            mime: frame.mime,
            context: "recording",
            ...(useFixture ? { fixture: true } : {}),
          }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          summary?: SegmentSummary;
          message?: string;
        };
        if (!res.ok || !json.ok || !json.summary?.nudge) {
          if (source === "manual") {
            setError(json.message ?? "Surroundings check unavailable.");
          }
          return;
        }
        const summary = json.summary;
        if (source === "manual") {
          applyNudge(summary, source);
          return;
        }
        if (shouldAutoSurfaceNudge({ alertLevel: summary.alertLevel, nudge: summary.nudge })) {
          applyNudge(summary, source);
        }
      } catch {
        if (source === "manual") setError("Could not run surroundings check.");
      } finally {
        if (source === "manual") setManualBusy(false);
        else {
          autoInFlightRef.current = false;
          setAutoScanning(false);
        }
      }
    },
    [applyNudge, autoAlertsOn, camera.active],
  );

  const runCheckRef = useRef(runSurroundingsCheck);
  runCheckRef.current = runSurroundingsCheck;

  const waitForVideoReady = useCallback(async () => {
    const video = previewVideoRef.current;
    if (!video) return;
    if (video.videoWidth > 0) return;
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      video.addEventListener("loadeddata", done, { once: true });
      setTimeout(done, 1500);
    });
  }, []);

  const beginCameraAndMaybeRecord = useCallback(async () => {
    const ok = await camera.start();
    if (!ok) return;
    await waitForVideoReady();
    if (wantRecordingAfterCamera) {
      setWantRecordingAfterCamera(false);
      setRecording(true);
    }
  }, [camera, waitForVideoReady, wantRecordingAfterCamera]);

  useEffect(() => {
    if (!camera.active || !autoAlertsOn) {
      clearAutoTimer();
      return;
    }
    void runCheckRef.current("auto");
    autoTimerRef.current = setInterval(() => {
      void runCheckRef.current("auto");
    }, AUTO_CHECK_MS);
    return () => clearAutoTimer();
  }, [camera.active, autoAlertsOn, clearAutoTimer]);

  const onConsentAllow = () => {
    updateConsent({ surroundingsCheck: true });
    setPendingConsent(false);
    void beginCameraAndMaybeRecord();
  };

  const requestCameraForRecording = () => {
    if (!consent.surroundingsCheck) {
      setWantRecordingAfterCamera(true);
      setPendingConsent(true);
      return;
    }
    void beginCameraAndMaybeRecord();
  };

  const onShutter = () => {
    if (!camera.active) {
      requestCameraForRecording();
      return;
    }
    setRecording((prev) => !prev);
  };

  const onCheckSurroundings = () => {
    if (!consent.surroundingsCheck) {
      setWantRecordingAfterCamera(false);
      setPendingConsent(true);
      return;
    }
    if (!camera.active) {
      void beginCameraAndMaybeRecord().then(() => runSurroundingsCheck("manual"));
      return;
    }
    void runSurroundingsCheck("manual");
  };

  const onToggleAutoAlerts = () => {
    const next = !reelsAutoAlerts;
    setReelsAutoAlerts(next);
    writeReelsAutoSurroundings(next);
    if (!next) {
      clearAutoTimer();
      setNudge(null);
    }
  };

  useEffect(() => () => clearAutoTimer(), [clearAutoTimer]);

  return (
    <div className="ig-route ig-route--record">
      <header className="record-topbar">
        <Link href="/reels" className="record-close" aria-label="Back to Reels" onClick={() => camera.stop()}>
          ✕
        </Link>
        <span className="record-title">New reel</span>
        <span className="record-topbar-spacer">
          {camera.active ? <span className="record-live-dot" title="Camera preview on" /> : null}
        </span>
      </header>

      <div className="record-preview-wrap">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={onPreviewVideoRef} className="record-preview" playsInline muted autoPlay />
        {!camera.active ? (
          <div className="record-preview-placeholder" aria-hidden={camera.starting}>
            <p className="record-preview-placeholder-title">
              {camera.starting ? "Starting camera…" : "Camera off"}
            </p>
            <p className="record-preview-placeholder-copy">
              Tap the red button to allow camera access. Surroundings alerts run automatically after
              consent. Nothing is saved to your feed.
            </p>
          </div>
        ) : null}
        <div className="record-preview-scrim" aria-hidden />
        {autoScanning && autoAlertsOn ? (
          <p className="record-scanning-pill" aria-live="polite">
            Scanning surroundings…
          </p>
        ) : null}
        {nudge ? (
          <div className="record-nudge-card" role="status">
            <p className="record-nudge-kicker">Surroundings</p>
            <p className="record-nudge-text">{nudge.nudge}</p>
            <button type="button" className="record-nudge-dismiss" onClick={() => setNudge(null)}>
              Got it
            </button>
          </div>
        ) : null}
      </div>

      <div className="record-mode">
        <button
          type="button"
          className={mode === "record" ? "record-mode-btn is-active" : "record-mode-btn"}
          onClick={() => setMode("record")}
        >
          Record
        </button>
        <button
          type="button"
          className={mode === "live" ? "record-mode-btn is-active" : "record-mode-btn"}
          onClick={() => setMode("live")}
        >
          Live
        </button>
      </div>

      {pendingConsent ? (
        <ConsentBanner
          message="Allow your Mac camera and automatic surroundings alerts on this preview?"
          hint="SAM + Spark scan the live frame on this device only — not posted as a reel. You can turn alerts off on this screen anytime."
          primaryLabel="Allow camera & alerts"
          onPrimary={onConsentAllow}
          onSecondary={() => {
            setPendingConsent(false);
            setWantRecordingAfterCamera(false);
          }}
        />
      ) : null}

      {error || camera.error ? (
        <p className="record-error">{error ?? camera.error}</p>
      ) : null}

      <div className="record-controls">
        {camera.active && consent.surroundingsCheck ? (
          <div className="record-surroundings-row">
            <label className="record-auto-toggle">
              <span>Surroundings alerts</span>
              <input
                type="checkbox"
                checked={reelsAutoAlerts}
                onChange={onToggleAutoAlerts}
                aria-label="Turn surroundings alerts on or off for this reel"
              />
            </label>
            <button
              type="button"
              className="record-surroundings-btn record-surroundings-btn--compact"
              disabled={manualBusy || camera.starting}
              onClick={onCheckSurroundings}
            >
              {manualBusy ? "…" : "Check now"}
            </button>
          </div>
        ) : null}
        <button
          type="button"
          className={recording ? "record-shutter record-shutter--recording" : "record-shutter"}
          aria-label={
            !camera.active
              ? "Start camera preview"
              : recording
                ? mode === "live"
                  ? "Stop mock Live"
                  : "Stop mock recording"
                : mode === "live"
                  ? "Go Live (mock)"
                  : "Start mock recording"
          }
          disabled={manualBusy || camera.starting}
          onClick={onShutter}
        >
          <span className="record-shutter-inner" />
        </button>
        <p className="record-footnote">
          {camera.starting
            ? "Starting camera…"
            : !camera.active
              ? "Mock only — tap red for camera + automatic surroundings alerts."
              : !autoAlertsOn
                ? "Alerts off for this reel — use Check now anytime."
                : recording
                  ? mode === "live"
                    ? "Mock Live — alerts keep scanning while your preview is on."
                    : "Mock recording — alerts keep scanning. Tap red to stop."
                  : mode === "live"
                    ? "Mock Go Live — tap red when you’re ready."
                    : "Alerts scan automatically while the camera is on."}
        </p>
      </div>
    </div>
  );
}
