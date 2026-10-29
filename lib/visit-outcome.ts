const POSTED_KEY = "intentloop:posted-this-visit";

export function markPostedThisVisit(): void {
  sessionStorage.setItem(POSTED_KEY, "1");
}

export function readPostedThisVisit(): boolean {
  return sessionStorage.getItem(POSTED_KEY) === "1";
}

export function clearPostedThisVisit(): void {
  sessionStorage.removeItem(POSTED_KEY);
}
