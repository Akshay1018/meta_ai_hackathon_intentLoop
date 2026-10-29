type DriftRingProps = {
  drift: number;
};

export function DriftRing({ drift }: DriftRingProps) {
  const pct = Math.min(100, Math.max(0, drift));
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const tone = pct >= 60 ? "var(--ig-warn)" : pct >= 35 ? "var(--ig-mid)" : "var(--ig-ok)";

  return (
    <div className="drift-ring-wrap" aria-label={`Drift ${Math.round(pct)} percent`}>
      <svg className="drift-ring" viewBox="0 0 100 100" role="img">
        <circle className="drift-ring-track" cx={50} cy={50} r={r} />
        <circle
          className="drift-ring-fill"
          cx={50}
          cy={50}
          r={r}
          stroke={tone}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="drift-ring-label">
        <span className="drift-ring-value">{Math.round(pct)}%</span>
        <span className="drift-ring-caption">drift</span>
      </div>
    </div>
  );
}
