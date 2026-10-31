export function BriefSkeleton() {
  return (
    <div className="brief-skeleton" aria-busy="true" aria-label="Loading visit summary">
      <div className="brief-skeleton-bar" />
      <div className="brief-skeleton-line brief-skeleton-line--wide" />
      <div className="brief-skeleton-line" />
      <div className="brief-skeleton-line brief-skeleton-line--short" />
    </div>
  );
}
