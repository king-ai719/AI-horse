"use client";

const POINTS_KEY = "ai_horse_points";
const INITIAL_POINTS = 3;

export function getPoints(): number {
  if (typeof window === "undefined") return INITIAL_POINTS;
  const stored = localStorage.getItem(POINTS_KEY);
  if (stored === null) {
    localStorage.setItem(POINTS_KEY, String(INITIAL_POINTS));
    return INITIAL_POINTS;
  }
  return parseInt(stored, 10);
}

export function consumePoint(): boolean {
  const current = getPoints();
  if (current <= 0) return false;
  localStorage.setItem(POINTS_KEY, String(current - 1));
  return true;
}

export function addPoints(amount: number): void {
  const current = getPoints();
  localStorage.setItem(POINTS_KEY, String(current + amount));
}