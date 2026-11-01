"use client";

type ConsentBannerProps = {
  message: string;
  primaryLabel: string;
  secondaryLabel?: string;
  hint?: string;
  onPrimary: () => void;
  onSecondary: () => void;
};

/** In-app consent strip (replaces browser confirm for IG-native feel). */
export function ConsentBanner({
  message,
  primaryLabel,
  secondaryLabel = "Not now",
  hint,
  onPrimary,
  onSecondary,
}: ConsentBannerProps) {
  const hintText =
    hint ??
    "Processed for this summary only — not saved to your feed. Turn on anytime in Your activity.";
  return (
    <div className="ig-consent-banner" role="region" aria-label="Permission">
      <p className="ig-consent-banner-text">{message}</p>
      <p className="ig-consent-banner-hint">{hintText}</p>
      <div className="ig-consent-banner-actions">
        <button type="button" className="ig-consent-banner-secondary" onClick={onSecondary}>
          {secondaryLabel}
        </button>
        <button type="button" className="ig-consent-banner-primary" onClick={onPrimary}>
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
