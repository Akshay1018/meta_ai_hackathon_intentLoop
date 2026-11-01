"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from "react";

type MacCameraState = {
  active: boolean;
  starting: boolean;
  error: string | null;
  videoRef: RefCallback<HTMLVideoElement>;
  start: () => Promise<boolean>;
  stop: () => void;
};

async function bindStreamToVideo(el: HTMLVideoElement, stream: MediaStream): Promise<void> {
  el.srcObject = stream;
  await el.play();
}

export function useMacCamera(): MacCameraState {
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const el = videoElRef.current;
    if (el) el.srcObject = null;
    setActive(false);
  }, []);

  const videoRef = useCallback<RefCallback<HTMLVideoElement>>((el) => {
    videoElRef.current = el;
    const stream = streamRef.current;
    if (!el || !stream || el.srcObject === stream) {
      if (el && stream && el.srcObject === stream) setActive(true);
      return;
    }
    void bindStreamToVideo(el, stream)
      .then(() => {
        setActive(true);
        setError(null);
      })
      .catch(() => {
        setError("Could not start camera preview.");
        setActive(false);
      });
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera is not available in this browser.");
      return false;
    }
    setStarting(true);
    setError(null);
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const el = videoElRef.current;
      if (el) el.srcObject = null;
      setActive(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoElRef.current;
      if (!video) {
        setActive(false);
        return true;
      }
      await bindStreamToVideo(video, stream);
      setActive(true);
      return true;
    } catch {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setError("Could not access the camera. Allow camera in System Settings → Privacy.");
      setActive(false);
      return false;
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { active, starting, error, videoRef, start, stop };
}
