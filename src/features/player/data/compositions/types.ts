// 楽曲データ表現 (docs/musics/specs.md の 8章 基本方針 + 8.2/8.3 音符表現に準拠)

export type NotePitch = number; // Hz（簡易化のため）。本格対応なら MIDI 番号もあり

export interface Note {
  t: number; // 開始時刻(拍単位)
  d: number; // 長さ(拍単位)
  v: number; // 音量 0..1
  p: NotePitch; // ピッチ(Hz)
}

export interface Part {
  instrument: "lead" | "bass" | "pad" | "perc" | "piano" | "guitar" | "upright";
  notes: Note[];
}

export interface Composition {
  id: string;
  title: string;
  tempo: number; // BPM
  parts: Part[];
}

// ユーティリティ: 音名->周波数（A4=440Hz 基準）
export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
