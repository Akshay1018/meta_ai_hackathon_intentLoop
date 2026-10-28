import { inferIntentCard } from "@/lib/intent-from-spark";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isIntentSurface } from "@/lib/schemas";

export const runtime = "nodejs";

function wantFixture(body: { fixture?: unknown }): boolean {
  if (process.env.INTENTLOOP_FIXTURE === "1") return true;
  if (body.fixture === true) return true;
  if (!hasMetaApiKey()) return true;
  return false;
}

export async function POST(request: Request) {
  let body: { surface?: unknown; fixture?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const surfaceRaw = typeof body.surface === "string" ? body.surface : "";
  if (!isIntentSurface(surfaceRaw)) {
    return Response.json({ ok: false, message: "Unknown surface" }, { status: 400 });
  }

  const fixture = wantFixture(body);

  try {
    const result = await inferIntentCard(surfaceRaw, { fixture });
    return Response.json({
      ok: true,
      card: result.card,
      fixture: result.fixture,
      meta: metaCallMeta(result.model),
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Intent inference unavailable",
        meta: metaCallMeta(fixture ? "fixture" : "muse-spark-1.3"),
      },
      { status: 503 },
    );
  }
}
