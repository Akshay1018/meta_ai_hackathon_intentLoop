import type { ReactNode } from "react";

import { IgLayoutChrome } from "@/components/ig/IgLayoutChrome";

export default function IgLayout({ children }: { children: ReactNode }) {
  const metaKeyConfigured = Boolean(process.env.MODEL_API_KEY?.trim());

  return <IgLayoutChrome metaKeyConfigured={metaKeyConfigured}>{children}</IgLayoutChrome>;
}
