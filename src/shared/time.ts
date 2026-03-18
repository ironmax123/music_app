// 表示用の mm:ss フォーマッタ
export function formatTime(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return "--:--";
  const total = Math.floor(sec);
  const mm = Math.floor(total / 60);
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

