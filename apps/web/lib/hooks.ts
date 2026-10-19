"use client";

import useSWR from "swr";
import { fetcher, type Article, type Stats, type TrackNode } from "./api";

export const useRoadmap = () => useSWR<TrackNode[]>("/roadmap", fetcher);
export const useStats = () => useSWR<Stats>("/stats", fetcher);
export const useArticles = (favorites = false) =>
  useSWR<Article[]>(`/articles?favorites=${favorites}`, fetcher);
