"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMacCamera } from "@/components/ig/useMacCamera";
import { ConsentBanner } from "@/components/intentloop/ConsentBanner";
import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { captureVideoFrameBase64 } from "@/lib/capture-video-frame";
import { appendVisitSurroundingsNote } from "@/lib/visit-surroundings";
import { recordSurfaceVisit } from "@/lib/visit-tracker";

type SegmentSummary = {
  nudge: string;
  prompt?: string;
};

const AUTO_CHECK_MS = 6000;

export function ReelsRecordSurface() {
  const { consent, update: updateConsent } = useConsentSettings();
  const camera = useMacCamera();
  const [mode, setMode] = useState<"record" | "live">("record");
  const [pendingConsent, setPendingConsent] = useState(false);
  const [wantRecordingAfterCamera, setWantRecordingAfterCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState<SegmentSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const onPreviewVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      previewVideoRef.current = node;
      camera.videoRef(node);
    },
    [camera.videoRef],
  );

  useEffect(() => {
    recordSurfaceVisit("reels");
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
      if (!camera.active) {
        setError("Turn on the camera preview first (tap the red button).");
        return;
      }
      const video = previewVideoRef.current;
      if (!video) return;

      setBusy(true);
      setError(null);
      try {
        await new Promise((r) => setTimeout(r, source === "auto" ? 120 : 0));
        const frame = captureVideoFrameBase64(video);
        if (!frame) {
          setError("Camera preview is not ready yet — try again in a second.");
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
          setError(json.message ?? "Surroundings check unavailable.");
          return;
        }
        applyNudge(json.summary, source);
      } catch {
        setError("Could not run surroundings check.");
      } finally {
        setBusy(false);
      }
    },
    [applyNudge, camera.active],
  );

  const startAutoChecks = useCallback(() => {
    clearAutoTimer();
    autoTimerRef.current = setInterval(() => {
      void runSurroundingsCheck("auto");
    }, AUTO_CHECK_MS);
  }, [clearAutoTimer, runSurroundingsCheck]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    clearAutoTimer();
  }, [clearAutoTimer]);

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
      void runSurroundingsCheck("auto");
      startAutoChecks();
    }
  }, [camera, runSurroundingsCheck, startAutoChecks, waitForVideoReady, wantRecordingAfterCamera]);

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
    if (recording) {
      stopRecording();
      return;
    }
    setRecording(true);
    void runSurroundingsCheck("auto");
    startAutoChecks();
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

  useEffect(() => () => clearAutoTimer(), [clearAutoTimer]);

  const showCheckButton = camera.active && consent.surroundingsCheck;

  return (
    <div className="ig-route ig-route--record">
      <header className="record-topbar">
        <Link href="/reels" className="record-close" aria-label="Back to Reels" onClick={() => camera.stop()}>
          ✕
        </Link>
        <span className="record-title">New reel</span>
        <span className="record-topbar-spacer" aria-hidden={!camera.active}>
          {camera.active ? <span className="record-live-dot" title="Camera preview on" /> : null}
        </span>
      </header>

      <div className="record-preview-wrap">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={onPreviewVideoRef}
          className="record-preview"
          playsInline
          muted
          autoPlay
        />
        {!camera.active ? (
          <div className="record-preview-placeholder" aria-hidden={camera.starting}>
            <p className="record-preview-placeholder-title">
              {camera.starting ? "Starting camera…" : "Camera off"}
            </p>
            <p className="record-preview-placeholder-copy">
              Tap the red button to allow camera access and start a mock recording. Nothing is saved to
              your feed.
            </p>
          </div>
        ) : null}
        <div className="record-preview-scrim" aria-hidden />
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
          message="Allow your Mac camera and a one-time surroundings check on the live preview?"
          hint="Frames stay on this device for SAM analysis — not posted as a reel."
          primaryLabel="Allow camera & check"
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
        {showCheckButton ? (
          <button
            type="button"
            className="record-surroundings-btn"
            disabled={busy || camera.starting}
            onClick={onCheckSurroundings}
          >
            {busy ? "Checking…" : "Check surroundings"}
          </button>
        ) : null}
        <button
          type="button"
          className={
            recording ? "record-shutter record-shutter--recording" : "record-shutter"
          }
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
          disabled={busy || camera.starting}
          onClick={onShutter}
        >
          <span className="record-shutter-inner" />
        </button>
        <p className="record-footnote">
          {camera.starting
            ? "Starting camera…"
            : !camera.active
              ? "Mock only — tap red to turn on camera and start recording."
              : recording
                ? mode === "live"
                  ? "Mock Live — surroundings checks run automatically while you’re on air."
                  : "Mock recording — surroundings checks run automatically. Tap red to stop."
                : mode === "live"
                  ? "Mock Go Live — tap red when you’re ready."
                  : "Tap red to record — we’ll check surroundings right away."}
        </p>
      </div>
    </div>
  );
}
