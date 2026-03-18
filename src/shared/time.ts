export function formatTime(total: number): string {
  if (!Number.isFinite(total) || total < 0) total = 0;
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

