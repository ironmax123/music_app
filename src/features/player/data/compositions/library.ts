// ここで曲の配列(メロディ, ベース, コード的役割)を定義しています
// docs/musics/list.md の8ジャンルを最低限のモチーフで「作曲」し、
// docs/musics/specs.md の方針(8章: 演奏指示として保持)に沿って配列化しています。

import { Composition, midiToHz } from "./types";

// 簡易ヘルパ
const N = (t: number, d: number, v: number, midi: number) => ({ t, d, v, p: midiToHz(midi) });

// 1) EDM
const edm: Composition = {
  id: "cmp-edm",
  title: "EDM",
  tempo: 128,
  parts: [
    { instrument: "bass", notes: [
      // キック的ベース(四つ打ち) E2
      N(0, 0.5, 0.9, 40), N(1, 0.5, 0.9, 40), N(2, 0.5, 0.9, 40), N(3, 0.5, 0.9, 40),
      N(4, 0.5, 0.9, 40), N(5, 0.5, 0.9, 40), N(6, 0.5, 0.9, 40), N(7, 0.5, 0.9, 40),
    ]},
    { instrument: "lead", notes: [
      // シンプルなリフ (E4-G4-B4 の分散)
      N(0, 0.5, 0.7, 64), N(0.5, 0.5, 0.7, 67), N(1, 0.5, 0.7, 71),
      N(2, 0.5, 0.7, 64), N(2.5, 0.5, 0.7, 67), N(3, 0.5, 0.7, 71),
    ]},
    { instrument: "pad", notes: [
      // E minor pad
      N(0, 4, 0.3, 52), N(0, 4, 0.3, 55), N(0, 4, 0.3, 59),
    ]},
  ],
};

// 2) y2k ポップス
const y2k: Composition = {
  id: "cmp-y2k",
  title: "Y2K Pop",
  tempo: 100,
  parts: [
    { instrument: "bass", notes: [
      N(0, 1, 0.8, 43), N(1, 1, 0.8, 45), N(2, 1, 0.8, 47), N(3, 1, 0.8, 45),
    ]},
    { instrument: "piano", notes: [
      N(0, 0.5, 0.7, 67), N(0.5, 0.5, 0.7, 69), N(1, 0.5, 0.7, 71),
      N(2, 0.5, 0.7, 69), N(2.5, 0.5, 0.7, 67), N(3, 0.5, 0.7, 64),
    ]},
    { instrument: "pad", notes: [
      N(0, 4, 0.3, 55), N(0, 4, 0.3, 59), N(0, 4, 0.3, 62),
    ]},
  ],
};

// 3) SF 映画のような壮大なオーケストラ（和音を長めに）
const orchestra: Composition = {
  id: "cmp-orch",
  title: "Cinematic",
  tempo: 72,
  parts: [
    { instrument: "pad", notes: [
      // Em -> C -> D (長めのサステイン)
      N(0, 4, 0.4, 52), N(0, 4, 0.4, 55), N(0, 4, 0.4, 59),
      N(4, 4, 0.4, 48), N(4, 4, 0.4, 52), N(4, 4, 0.4, 55),
      N(8, 4, 0.4, 50), N(8, 4, 0.4, 54), N(8, 4, 0.4, 57),
    ]},
    { instrument: "piano", notes: [
      N(0, 1, 0.6, 64), N(2, 1, 0.6, 67), N(4, 1, 0.6, 71), N(6, 1, 0.6, 74),
    ]},
  ],
};

// 4) K-pop 風（テンポ速め、軽快なベース）
const kpop: Composition = {
  id: "cmp-kpop",
  title: "K-pop Style",
  tempo: 132,
  parts: [
    { instrument: "bass", notes: [
      N(0, 0.5, 0.8, 40), N(0.5, 0.5, 0.8, 43), N(1, 0.5, 0.8, 45), N(1.5, 0.5, 0.8, 47),
      N(2, 0.5, 0.8, 45), N(2.5, 0.5, 0.8, 43), N(3, 0.5, 0.8, 40), N(3.5, 0.5, 0.8, 38),
    ]},
    { instrument: "lead", notes: [
      N(0, 0.25, 0.7, 67), N(0.5, 0.25, 0.7, 69), N(1, 0.25, 0.7, 71), N(1.5, 0.25, 0.7, 72),
    ]},
  ],
};

// 5) 雑貨屋で流れてそうなジャズ（ウォーキングベース風）
const jazz: Composition = {
  id: "cmp-jazz",
  title: "Easy Jazz",
  tempo: 110,
  parts: [
    { instrument: "upright", notes: [
      N(0, 0.5, 0.7, 40), N(0.5, 0.5, 0.7, 42), N(1, 0.5, 0.7, 43), N(1.5, 0.5, 0.7, 45),
      N(2, 0.5, 0.7, 47), N(2.5, 0.5, 0.7, 48), N(3, 0.5, 0.7, 50), N(3.5, 0.5, 0.7, 52),
    ]},
    { instrument: "piano", notes: [
      N(0, 0.5, 0.6, 64), N(1, 0.5, 0.6, 67), N(2, 0.5, 0.6, 71), N(3, 0.5, 0.6, 67),
    ]},
  ],
};

// 6) ロック（パワーコードっぽい刻み）
const rock: Composition = {
  id: "cmp-rock",
  title: "Rock Energy",
  tempo: 140,
  parts: [
    { instrument: "bass", notes: [
      N(0, 0.5, 0.9, 45), N(0.5, 0.5, 0.9, 45), N(1, 0.5, 0.9, 47), N(1.5, 0.5, 0.9, 47),
      N(2, 0.5, 0.9, 48), N(2.5, 0.5, 0.9, 48), N(3, 0.5, 0.9, 50), N(3.5, 0.5, 0.9, 50),
    ]},
    { instrument: "guitar", notes: [
      N(0, 0.25, 0.7, 64), N(0.25, 0.25, 0.7, 64), N(0.5, 0.25, 0.7, 67), N(0.75, 0.25, 0.7, 67),
    ]},
  ],
};

// 7) ヒーリング（長音中心、テンポ遅め）
const healing: Composition = {
  id: "cmp-heal",
  title: "Healing",
  tempo: 60,
  parts: [
    { instrument: "pad", notes: [
      N(0, 8, 0.3, 57), N(0, 8, 0.3, 60), N(0, 8, 0.3, 64),
    ]},
    { instrument: "piano", notes: [
      N(0, 2, 0.5, 69), N(4, 2, 0.5, 67),
    ]},
  ],
};

// 8) 失恋ソング風(しっとり)
const ballad: Composition = {
  id: "cmp-ballad",
  title: "Sad Ballad",
  tempo: 78,
  parts: [
    { instrument: "pad", notes: [
      N(0, 4, 0.3, 60), N(0, 4, 0.3, 64), N(0, 4, 0.3, 67),
      N(4, 4, 0.3, 57), N(4, 4, 0.3, 60), N(4, 4, 0.3, 64),
    ]},
    { instrument: "piano", notes: [
      N(0, 1, 0.5, 72), N(1, 1, 0.5, 71), N(2, 2, 0.5, 69),
    ]},
  ],
};

export const compositions: Composition[] = [
  edm, y2k, orchestra, kpop, jazz, rock, healing, ballad,
];

export function getCompositionMap() {
  return new Map(compositions.map((c) => [c.id, c] as const));
}
