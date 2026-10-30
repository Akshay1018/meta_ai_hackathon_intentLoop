import type { ReactNode } from "react";

type PhoneShellProps = {
  children: ReactNode;
  metaKeyConfigured: boolean;
  variant?: "default" | "reels";
};

export function PhoneShell({ children, metaKeyConfigured, variant = "default" }: PhoneShellProps) {
  return (
    <div className="stage">
      <div className={variant === "reels" ? "phone phone--reels" : "phone"}>
        <span
          className={metaKeyConfigured ? "phone-badge phone-badge--live" : "phone-badge"}
          title={metaKeyConfigured ? "Meta Model API ready" : "Set MODEL_API_KEY in .env.local"}
        />
        {children}
      </div>
      <p className="stage-caption">
        IntentLoop session layer · mock Instagram · feed first
      </p>
    </div>
  );
}
