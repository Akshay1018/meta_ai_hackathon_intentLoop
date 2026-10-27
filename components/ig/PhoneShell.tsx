import type { ReactNode } from "react";

type PhoneShellProps = {
  children: ReactNode;
  metaKeyConfigured: boolean;
};

export function PhoneShell({ children, metaKeyConfigured }: PhoneShellProps) {
  return (
    <div className="stage">
      <p className="stage-label">
        IntentLoop mock · feed first · no overlay{" "}
        <span
          className={metaKeyConfigured ? "env-dot env-dot--ok" : "env-dot env-dot--off"}
          title={metaKeyConfigured ? "MODEL_API_KEY is set" : "MODEL_API_KEY missing"}
        />
      </p>
      <div className="phone">{children}</div>
    </div>
  );
}
