/**
 * Live Meta smoke (~$0.05–0.50). Requires MODEL_API_KEY in .env.local.
 *   node scripts/make-demo-wav.mjs
 *   set -a && source .env.local 2>/dev/null; set +a  # or export MODEL_API_KEY
 *   node scripts/test-meta-live.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const p = path.join(root, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnvLocal();
const key = process.env.MODEL_API_KEY?.trim();
if (!key) {
  console.error("MODEL_API_KEY missing — fill .env.local");
  process.exit(1);
}

const baseURL = process.env.META_API_BASE_URL ?? "https://api.meta.ai/v1";
const client = new OpenAI({ apiKey: key, baseURL });

const results = [];

async function step(name, fn) {
  process.stdout.write(`${name}… `);
  try {
    await fn();
    results.push([name, "ok"]);
    console.log("ok");
  } catch (e) {
    results.push([name, e instanceof Error ? e.message : String(e)]);
    console.log("FAIL", e instanceof Error ? e.message : e);
  }
}

const heavy = process.argv.includes("--heavy");
const demoPngPath = path.join(root, "public/demo-screenshot.png");
if (!fs.existsSync(demoPngPath)) {
  console.error("Run: node scripts/make-demo-png.mjs");
  process.exit(1);
}
const tinyPng = fs.readFileSync(demoPngPath);

await step("Spark intent (dms)", async () => {
  const res = await client.chat.completions.create({
    model: process.env.MUSE_SPARK_MODEL ?? "muse-spark-1.3",
    messages: [
      { role: "user", content: 'Return JSON {"goal":"test","app":"instagram","surface":"dms","source":"inferred","success":"x","max_minutes":15,"avoid":"","check_in_prompt":"?"}' },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "t",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["goal", "app", "surface", "source", "success", "max_minutes", "avoid", "check_in_prompt"],
          properties: {
            goal: { type: "string" },
            app: { type: "string", enum: ["instagram"] },
            surface: { type: "string", enum: ["dms"] },
            source: { type: "string", enum: ["inferred"] },
            success: { type: "string" },
            max_minutes: { type: "number" },
            avoid: { type: "string" },
            check_in_prompt: { type: "string" },
          },
        },
      },
    },
  });
  if (!res.choices[0]?.message?.content) throw new Error("empty");
});

await step("Spark exit brief", async () => {
  const res = await client.chat.completions.create({
    model: process.env.MUSE_SPARK_MODEL ?? "muse-spark-1.3",
    messages: [{ role: "user", content: '{"intent":{"goal":"Reply DMs"},"surfacesVisited":["dms","reels"]}' }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "exit_brief",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["drift", "happened", "next_action", "tone"],
          properties: {
            drift: { type: "number" },
            happened: { type: "string" },
            next_action: { type: "string" },
            tone: { type: "string", enum: ["neutral", "encouraging"] },
          },
        },
      },
    },
  });
  if (!res.choices[0]?.message?.content) throw new Error("empty");
});

await step("Spark vision (tiny png)", async () => {
  const dataUrl = `data:image/png;base64,${tinyPng.toString("base64")}`;
  const res = await client.chat.completions.create({
    model: process.env.MUSE_SPARK_MODEL ?? "muse-spark-1.3",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "One word: what color?" },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  });
  if (!res.choices[0]?.message?.content) throw new Error("empty");
});

await step("SAM 3.1 segment", async () => {
  const dataUrl = `data:image/png;base64,${tinyPng.toString("base64")}`;
  const res = await client.responses.create({
    model: process.env.MUSE_SAM_MODEL ?? "sam-3.1",
    input: [
      {
        type: "message",
        role: "user",
        content: [
          { type: "input_text", text: "phone" },
          { type: "input_image", image_url: dataUrl },
        ],
      },
    ],
  });
  if (!res.output_text && !res.output?.length) throw new Error("empty sam output");
});

const imageRuns = heavy ? 3 : 1;
for (let i = 0; i < imageRuns; i++) {
  await step(`Muse Image card${heavy ? ` (${i + 1}/${imageRuns})` : ""}`, async () => {
    const res = await client.images.generate({
      model: process.env.MUSE_IMAGE_MODEL ?? "muse-image-1.0",
      prompt: "Abstract calm gradient square, no text, no logos, minimal",
      size: "1024x1024",
      n: 1,
    });
    if (!res.data?.[0]?.b64_json) throw new Error("no image");
  });
}

if (heavy) {
  for (const surface of ["reels", "create", "home"]) {
    await step(`Spark intent (${surface})`, async () => {
      const res = await client.chat.completions.create({
        model: process.env.MUSE_SPARK_MODEL ?? "muse-spark-1.3",
        messages: [
          {
            role: "user",
            content: `Instagram surface ${surface}. Return JSON intent card.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "t",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["goal", "app", "surface", "source", "success", "max_minutes", "avoid", "check_in_prompt"],
              properties: {
                goal: { type: "string" },
                app: { type: "string", enum: ["instagram"] },
                surface: { type: "string", enum: ["dms", "reels", "create", "home", "profile"] },
                source: { type: "string", enum: ["inferred"] },
                success: { type: "string" },
                max_minutes: { type: "number" },
                avoid: { type: "string" },
                check_in_prompt: { type: "string" },
              },
            },
          },
        },
      });
      if (!res.choices[0]?.message?.content) throw new Error("empty");
    });
  }
}

await step("Voice transcribe (demo wav)", async () => {
  const wavPath = path.join(root, "public/demo-silence.wav");
  if (!fs.existsSync(wavPath)) {
    throw new Error("run node scripts/make-demo-wav.mjs first");
  }
  const form = new FormData();
  form.append(
    "request",
    new Blob(
      [JSON.stringify({ model: "muse-voice-transcribe-1.0", audioEncoding: "WAV", mode: "PUSH_TO_TALK" })],
      { type: "application/json" },
    ),
  );
  form.append("audio", new Blob([fs.readFileSync(wavPath)], { type: "audio/wav" }), "demo-silence.wav");
  const res = await fetch(`${baseURL}/asr/transcribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    body: form,
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`);
});

console.log("\nSummary:");
for (const [name, status] of results) console.log(`  ${name}: ${status}`);
const failed = results.filter(([, s]) => s !== "ok").length;
process.exit(failed ? 1 : 0);
