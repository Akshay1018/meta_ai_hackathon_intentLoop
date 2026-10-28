import { DmsInbox, type DmThread } from "@/components/ig/DmsInbox";
import dms from "@/mock/dms.json";

export default function DmsPage() {
  return <DmsInbox threads={dms.threads as DmThread[]} />;
}
