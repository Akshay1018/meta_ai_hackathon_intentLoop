import Link from "next/link";

import { IgHeader } from "@/components/ig/IgHeader";

export default function ProfilePage() {
  return (
    <>
      <IgHeader />
      <div className="ig-scroll">
        <p className="ig-placeholder">
          Profile — next steps.
          <br />
          <Link href="/profile/activity">Your activity</Link>
        </p>
      </div>
    </>
  );
}
