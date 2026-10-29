/** Script-style wordmark for mock IG chrome (not Meta trademark assets). */
export function IgWordmark({ compact }: { compact?: boolean }) {
  return (
    <span className={compact ? "ig-logo ig-logo--compact" : "ig-logo"} aria-label="Instagram">
      Instagram
    </span>
  );
}
