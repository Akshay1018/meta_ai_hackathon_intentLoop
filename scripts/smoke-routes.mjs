/**
 * Smoke-test HTML routes (dev or start server must already be up on :3000).
 *   node scripts/smoke-routes.mjs
 */
const routes = ["/", "/reels", "/create", "/dms", "/profile", "/profile/activity"];
const base = process.env.SMOKE_BASE ?? "http://127.0.0.1:3000";

let failed = 0;
for (const path of routes) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = await res.text();
    const hasCss = html.includes("globals") || html.includes("_next/static/css");
    const ok = res.status === 200 && hasCss;
    console.log(`${ok ? "ok" : "FAIL"} ${res.status} ${path}${hasCss ? "" : " (no css link)"}`);
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL ${path}`, e instanceof Error ? e.message : e);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
