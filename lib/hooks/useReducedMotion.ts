"use client";

import { useMediaQueryLive } from "./useMediaQueryLive";

export function useReducedMotion(): boolean {
  return useMediaQueryLive("(prefers-reduced-motion: reduce)");
}
