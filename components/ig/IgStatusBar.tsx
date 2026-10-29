export function IgStatusBar() {
  return (
    <div className="ig-status" aria-hidden="true">
      <span className="ig-status-time">9:41</span>
      <span className="ig-status-icons">
        <span className="ig-status-signal" />
        <span className="ig-status-wifi" />
        <span className="ig-status-battery" />
      </span>
    </div>
  );
}
