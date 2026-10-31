import { driftBarTone } from "@/lib/brief-summary-ui";

type DriftBarProps = {
  drift: number;
};

export function DriftBar({ drift }: DriftBarProps) {
  const pct = Math.min(100, Math.max(0, drift));
  const tone = driftBarTone(pct);

  return (
    <div className="drift-bar-block" aria-label={`Drift ${Math.round(pct)} percent`}>
      <div className="drift-bar-head">
        <span className="drift-bar-label">Drift</span>
        <span className={`drift-bar-value drift-bar-value--${tone}`}>{Math.round(pct)}%</span>
      </div>
      <div className="drift-bar-track" role="presentation">
        <div
          className={`drift-bar-fill drift-bar-fill--${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
