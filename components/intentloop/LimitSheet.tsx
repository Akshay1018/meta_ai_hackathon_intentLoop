"use client";

type LimitSheetProps = {
  open: boolean;
  onSkip: () => void;
  onRemind1h: () => void;
  onRemind2h: () => void;
  onSeeBrief: () => void;
};

export function LimitSheet({
  open,
  onSkip,
  onRemind1h,
  onRemind2h,
  onSeeBrief,
}: LimitSheetProps) {
  if (!open) return null;

  return (
    <div className="limit-root" role="dialog" aria-modal="true" aria-labelledby="limit-title">
      <button type="button" className="limit-backdrop" aria-label="Dismiss" onClick={onSkip} />
      <div className="limit-sheet">
        <div className="limit-handle" />
        <p id="limit-title" className="limit-title">
          Your daily limit
        </p>
        <p className="limit-copy">
          You set this reminder. Instagram still works — this is just a pause.
        </p>
        <button type="button" className="limit-btn" onClick={onSkip}>
          Skip
        </button>
        <button type="button" className="limit-btn" onClick={onRemind1h}>
          Remind in 1 hour
        </button>
        <button type="button" className="limit-btn" onClick={onRemind2h}>
          Remind in 2 hours
        </button>
        <button type="button" className="limit-btn limit-btn--accent" onClick={onSeeBrief}>
          See whether you did the thing
        </button>
      </div>
    </div>
  );
}
