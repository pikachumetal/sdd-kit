import { MISSING } from './text.ts';
const JUST_BELOW_HALF = 0.49999999999999994;

export function roundHalfAwayFromZero(value: number, digits: number): number {
  const power = 10 ** digits;
  const scaled = value * power;
  const rounded = Math.sign(scaled) * Math.floor(Math.abs(scaled) + JUST_BELOW_HALF);
  return rounded / power;
}

export function formatNumber(value: number | null): string {
  if (value === null) return MISSING;
  return String(roundHalfAwayFromZero(value, 2));
}

export function formatPercent(part: number, total: number): string {
  return `${roundHalfAwayFromZero((part / total) * 100, 0)} %`;
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function ascending(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function median(values: number[]): number {
  const sorted = ascending(values);
  const middle = sorted.length / 2;
  if (sorted.length % 2 === 1) return sorted[Math.floor(middle)]!;
  return (sorted[middle - 1]! + sorted[middle]!) / 2;
}

export function percentile(values: number[], fraction: number): number {
  const sorted = ascending(values);
  const rank = fraction * (sorted.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) return sorted[low]!;
  return sorted[low]! + (rank - low) * (sorted[high]! - sorted[low]!);
}
