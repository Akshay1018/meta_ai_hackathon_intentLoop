import type { ReactNode } from "react";

type PhoneShellProps = {
  children: ReactNode;
  variant?: "default" | "reels";
};

export function PhoneShell({ children, variant = "default" }: PhoneShellProps) {
  return (
    <div className="stage">
      <div className={variant === "reels" ? "phone phone--reels" : "phone"}>{children}</div>
      <p className="stage-caption">
        IntentLoop session layer · mock Instagram · feed first
      </p>
    </div>
  );
}
