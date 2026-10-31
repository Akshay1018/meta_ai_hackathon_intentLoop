import type { ExitBrief, IntentCard } from "@/lib/schemas";
import type { PersonaId } from "@/lib/personas";

export type StoredBriefRecord = {
  id: string;
  at: string;
  day: string;
  intentGoal: string;
  brief: ExitBrief;
  fixture: boolean;
  personaId: PersonaId | null;
};

const DB_NAME = "intentloop";
const DB_VERSION = 1;
const STORE = "briefs";

function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("idb open failed"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("day", "day", { unique: false });
      }
    };
  });
}

export async function idbAppendBrief(input: {
  intent: IntentCard;
  brief: ExitBrief;
  fixture: boolean;
  personaId: PersonaId | null;
}): Promise<void> {
  try {
    const db = await openDb();
    const record: StoredBriefRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      day: dayKey(),
      intentGoal: input.intent.goal,
      brief: input.brief,
      fixture: input.fixture,
      personaId: input.personaId,
    };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("idb write failed"));
      tx.objectStore(STORE).put(record);
    });
    db.close();
    await idbPruneOlderThanDays(7);
  } catch {
    /* optional storage */
  }
}

async function idbPruneOlderThanDays(days: number): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffDay = dayKey(cutoff);
  try {
    const db = await openDb();
    const all = await idbReadAll(db);
    const toDelete = all.filter((r) => r.day < cutoffDay);
    if (toDelete.length === 0) {
      db.close();
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("idb prune failed"));
      const store = tx.objectStore(STORE);
      for (const row of toDelete) store.delete(row.id);
    });
    db.close();
  } catch {
    /* ignore */
  }
}

function idbReadAll(db: IDBDatabase): Promise<StoredBriefRecord[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result as StoredBriefRecord[]) ?? []);
    req.onerror = () => reject(req.error ?? new Error("idb read failed"));
  });
}

export async function idbReadBriefsLastDays(days: number): Promise<StoredBriefRecord[]> {
  try {
    const db = await openDb();
    const all = await idbReadAll(db);
    db.close();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDay = dayKey(cutoff);
    return all
      .filter((r) => r.day >= cutoffDay)
      .sort((a, b) => (a.day === b.day ? b.id.localeCompare(a.id) : b.day.localeCompare(a.day)));
  } catch {
    return [];
  }
}
