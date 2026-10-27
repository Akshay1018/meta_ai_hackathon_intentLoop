import type { ReactNode } from "react";

import { IgStatusBar } from "@/components/ig/IgStatusBar";
import { PhoneShell } from "@/components/ig/PhoneShell";
import { TabBar } from "@/components/ig/TabBar";

export default function IgLayout({ children }: { children: ReactNode }) {
  const metaKeyConfigured = Boolean(process.env.MODEL_API_KEY?.trim());

  return (
    <PhoneShell metaKeyConfigured={metaKeyConfigured}>
      <IgStatusBar />
      {children}
      <TabBar />
    </PhoneShell>
  );
}
