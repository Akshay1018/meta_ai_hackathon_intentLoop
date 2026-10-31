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
    const cssHref = html.match(/href="(\/_next\/static\/css[^"]+)"/)?.[1];
    let cssOk = Boolean(cssHref);
    if (cssHref) {
      const cssRes = await fetch(`${base}${cssHref}`);
      cssOk = cssRes.ok && (Number(cssRes.headers.get("content-length")) || 0) > 1000;
      if (!cssOk) cssOk = (await cssRes.text()).length > 1000;
    }
    const ok = res.status === 200 && cssOk;
    console.log(
      `${ok ? "ok" : "FAIL"} ${res.status} ${path}${cssOk ? "" : " (css missing or empty)"}`,
    );
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL ${path}`, e instanceof Error ? e.message : e);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
