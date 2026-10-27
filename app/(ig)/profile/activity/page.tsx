import Link from "next/link";

import { IgHeader } from "@/components/ig/IgHeader";

export default function ActivityPage() {
  return (
    <>
      <IgHeader />
      <div className="ig-scroll">
        <p className="ig-placeholder">
          Your activity — next steps.
          <br />
          <Link href="/profile">Back to profile</Link>
        </p>
      </div>
    </>
  );
}
