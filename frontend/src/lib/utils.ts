import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, language: string = 'en'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function getContaminationColor(level: number): string {
  if (level <= 0.02) return '#22c55e'; // low - green
  if (level <= 0.05) return '#eab308'; // moderate - yellow
  if (level <= 0.1) return '#f97316';  // elevated - orange
  return '#dc2626';                     // high - red
}

export function getContaminationLevel(chromiumMgL: number): 'low' | 'moderate' | 'elevated' | 'high' {
  if (chromiumMgL <= 0.02) return 'low';
  if (chromiumMgL <= 0.05) return 'moderate';
  if (chromiumMgL <= 0.1) return 'elevated';
  return 'high';
}

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `AS-${year}-${num}`;
}
