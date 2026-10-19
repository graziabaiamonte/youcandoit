import type { components } from "./api-types";

type Schemas = components["schemas"];
export type TrackNode = Schemas["TrackNode"];
export type SessionNode = Schemas["SessionNode"];
export type SessionDetail = Schemas["SessionDetail"];
export type Stats = Schemas["StatsOut"];
export type Article = Schemas["ArticleOut"];
export type Quote = Schemas["QuoteOut"];
export type Answer = Schemas["AnswerOut"];
export type Turn = Schemas["Turn"];

export class ApiError extends Error {}

/** fetch wrapper for the /api proxy: JSON in, JSON out, readable errors. */
export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: init?.method ?? "GET",
    headers: init?.body ? { "content-type": "application/json" } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.detail ?? `Request failed (${response.status})`);
  return data as T;
}

export const fetcher = <T>(path: string) => api<T>(path);

/** Track N uses colour token --track-(N+1). */
export const trackColor = (trackId: string) => `var(--track-${(Number(trackId) % 12) + 1})`;

export const sessionProgress = (s: SessionNode) => ({
  done: s.subchapters.filter((c) => c.done).length,
  total: s.subchapters.length,
});
