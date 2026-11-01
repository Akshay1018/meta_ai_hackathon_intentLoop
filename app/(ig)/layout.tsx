import type { ReactNode } from "react";

import { IgLayoutChrome } from "@/components/ig/IgLayoutChrome";

export default function IgLayout({ children }: { children: ReactNode }) {
  return <IgLayoutChrome>{children}</IgLayoutChrome>;
}
