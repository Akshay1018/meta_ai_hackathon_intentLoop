import OpenAI from "openai";

export const META_API_BASE_URL =
  process.env.META_API_BASE_URL ?? "https://api.meta.ai/v1";

export function hasMetaApiKey(): boolean {
  return Boolean(process.env.MODEL_API_KEY?.trim());
}

export function getMetaClient(): OpenAI {
  const apiKey = process.env.MODEL_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MODEL_API_KEY is not set");
  }
  return new OpenAI({
    apiKey,
    baseURL: META_API_BASE_URL,
  });
}

export function sparkModelId(): string {
  return process.env.MUSE_SPARK_MODEL?.trim() || "muse-spark-1.3";
}

/** Never log the key. Safe fields only. */
export function metaCallMeta(model: string, extra?: Record<string, string>) {
  return { provider: "meta-model-api", model, ...extra };
}
