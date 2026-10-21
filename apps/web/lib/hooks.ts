"use client";

import useSWR, { mutate } from "swr";
import { fetcher, type Article, type Stats, type TrackNode } from "./api";

export const useRoadmap = () => useSWR<TrackNode[]>("/roadmap", fetcher);
export const useStats = () => useSWR<Stats>("/stats", fetcher);
export const useArticles = (favorites = false) =>
  useSWR<Article[]>(`/articles?favorites=${favorites}`, fetcher);

/** Revalidate every article list (all, favorites, any limit). */
export const refreshArticles = () => mutate((key) => typeof key === "string" && key.startsWith("/articles"));
