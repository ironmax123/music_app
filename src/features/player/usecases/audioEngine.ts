"use client";

// Web Audio API を実際に使用して音を鳴らす層（docs/musics/specs.md の Audio Engine 層）
// ここで API を使っています: window.AudioContext, OscillatorNode, GainNode など。

import type { Composition, Part, Note } from "../data/compositions/types";

type OscRef = { osc: OscillatorNode; gain: GainNode; started: boolean };

type PlayOptions = { durationSec?: number; onEnded?: () => void };

class Engine {
  private ctx: AudioContext | null = null; // AudioContext の単一管理
  private master: GainNode | null = null;
  private scheduledTimeouts: number[] = [];
  private schedulerId: number | null = null; // 進行スケジューラ setInterval ID
  private playing = false;
  private t0 = 0; // 再生開始の contextTime
  private beatSec = 0; // 1拍の秒
  private compBeats = 0; // 1ループ分の拍数（楽曲配列の長さ）
  private durationSec = 0; // 総演奏時間(指定)
  private scheduledThroughBeat = 0; // どこまでスケジュールしたか（拍）
  private onEnded: (() => void) | undefined;
  private activeVoices: Set<OscRef> = new Set();

  initIfNeeded() {
    if (this.ctx) return;
    // ここで Web Audio API を使用: AudioContext 生成
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
  }

  stop() {
    if (!this.ctx) return;
    this.playing = false;
    // 予約済みタイマーのクリア（簡易管理）
    this.scheduledTimeouts.forEach((id) => clearTimeout(id));
    this.scheduledTimeouts = [];
    if (this.schedulerId != null) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    // 既に鳴っている音を即時フェードアウトして停止
    const now = this.ctx.currentTime + 0.005;
    for (const v of this.activeVoices) {
      try {
        v.gain.gain.cancelScheduledValues(0);
        v.gain.gain.setValueAtTime(v.gain.gain.value, now);
        v.gain.gain.linearRampToValueAtTime(0.0001, now + 0.03);
        if (v.started) v.osc.stop(now + 0.04);
      } catch {}
      try {
        v.osc.disconnect();
        v.gain.disconnect();
      } catch {}
    }
    this.activeVoices.clear();
  }

  async play(comp: Composition, opts: PlayOptions = {}) {
    this.initIfNeeded();
    if (!this.ctx || !this.master) return;

    // ユーザー操作起点で resume（自動再生制限対応）
    // state確認に関わらず一度 resume を試みる方が確実
    try { await this.ctx.resume(); } catch {}

    this.stop();
    this.playing = true;
    this.beatSec = 60 / comp.tempo;
    this.t0 = this.ctx.currentTime + 0.02; // 少し先から開始
    this.durationSec = Math.max(10, opts.durationSec ?? 150); // デフォルト 2.5分
    this.onEnded = opts.onEnded;
    this.compBeats = this.measureCompositionBeats(comp);
    this.scheduledThroughBeat = 0;

    // 最初のウィンドウ分をスケジュール
    this.scheduleWindow(comp);
    // 以降は小刻みに先までスケジュールしていく（progress/終端同期用）
    this.schedulerId = window.setInterval(() => this.tickSchedule(comp), 100);

    // フェイルセーフ: 200ms 後に一つも音が開始していなければ短いトーンで起動
    window.setTimeout(() => {
      if (!this.ctx || !this.master) return;
      if (!this.playing) return;
      if (this.activeVoices.size > 0) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        gain.gain.value = 0.1;
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      } catch {}
    }, 200);
  }

  private schedulePart(part: Part, startBeat: number, endBeat: number) {
    if (!this.ctx || !this.master) return;

    const totalBeats = this.durationSec / this.beatSec;
    const loopLen = Math.max(0.0001, this.compBeats);
    // ループごとにノートを展開
    for (let loopStart = Math.floor(startBeat / loopLen) * loopLen; loopStart < endBeat; loopStart += loopLen) {
      for (const n of part.notes) {
        const nb = loopStart + n.t;
        if (nb + n.d < startBeat || nb > endBeat) continue;
        if (nb > totalBeats) continue;

        const startAt = this.t0 + nb * this.beatSec;
        const durSec = Math.max(0.01, n.d * this.beatSec);
        const stopAt = startAt + durSec;

        const node = this.createVoice(part.instrument, n);
        node.gain.gain.value = n.v * (part.instrument === "pad" ? 0.5 : 1);
        const amp = node.gain.gain.value;
        node.osc.connect(node.gain);
        node.gain.connect(this.master!);

        const now = this.ctx!.currentTime;
        const imminent = startAt - now < 0.02; // 20ms 以内は即時スタートに切替
        if (imminent) {
          // 即時開始パス
          try {
            node.osc.frequency.setValueAtTime(n.p, now);
            node.gain.gain.setValueAtTime(0.0001, now);
            node.gain.gain.linearRampToValueAtTime(amp, now + 0.01);
            node.gain.gain.linearRampToValueAtTime(0.0001, now + durSec);
            node.osc.start(now);
            node.started = true;
            this.activeVoices.add(node);
            node.osc.stop(now + durSec);
          } catch {}
        } else {
          // 未来予約パス
          // ここで Web Audio API を使用: 再生予約（envelope 簡易）
          node.osc.frequency.setValueAtTime(n.p, startAt);
          node.gain.gain.setValueAtTime(0.0001, startAt);
          node.gain.gain.linearRampToValueAtTime(amp, startAt + 0.01);
          node.gain.gain.linearRampToValueAtTime(0.0001, stopAt);
          try {
            node.osc.start(startAt);
            node.started = true;
            this.activeVoices.add(node);
            node.osc.stop(stopAt);
          } catch {}
        }

        // 後片付け（disconnect）は再生終了の少し後に行う
        const cleanupId = window.setTimeout(() => {
          try { node.osc.disconnect(); } catch {}
          try { node.gain.disconnect(); } catch {}
          this.activeVoices.delete(node);
        }, Math.max(0, (stopAt - this.ctx!.currentTime) * 1000) + 20);

        this.scheduledTimeouts.push(cleanupId);
      }
    }
  }

  private createVoice(kind: Part["instrument"], n: Note): OscRef {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    switch (kind) {
      case "lead":
        osc.type = "sawtooth";
        break;
      case "bass":
        osc.type = "square";
        break;
      case "pad":
        osc.type = "triangle";
        break;
      case "perc":
        osc.type = "sine";
        break;
    }
    return { osc, gain, started: false };
  }

  private measureCompositionBeats(comp: Composition): number {
    let maxBeat = 0;
    for (const part of comp.parts) {
      for (const n of part.notes) maxBeat = Math.max(maxBeat, n.t + n.d);
    }
    return Math.max(1, maxBeat);
  }

  private scheduleWindow(comp: Composition) {
    // 先読みウィンドウ: 現在位置から数小節先まで
    if (!this.ctx) return;
    const currentBeat = Math.max(0, (this.ctx.currentTime - this.t0) / this.beatSec);
    const windowBeats = 8; // 8拍先まで常に予約
    const toBeat = currentBeat + windowBeats;
    this.schedulePartsRange(comp, this.scheduledThroughBeat, toBeat);
    this.scheduledThroughBeat = toBeat;
  }

  private schedulePartsRange(comp: Composition, fromBeat: number, toBeat: number) {
    for (const part of comp.parts) this.schedulePart(part, fromBeat, toBeat);
  }

  private tickSchedule(comp: Composition) {
    if (!this.ctx) return;
    const elapsed = this.ctx.currentTime - this.t0;
    if (elapsed >= this.durationSec) {
      // 再生終了
      this.stop();
      if (this.onEnded) this.onEnded();
      return;
    }
    // 先読みスケジュールを継続
    const currentBeat = Math.max(0, elapsed / this.beatSec);
    const targetBeat = currentBeat + 8; // 8拍先まで維持
    if (this.scheduledThroughBeat < targetBeat) {
      this.schedulePartsRange(comp, this.scheduledThroughBeat, targetBeat);
      this.scheduledThroughBeat = targetBeat;
    }
  }

  // 再生バー同期用: 現在の秒数を返す
  getPositionSec(): number {
    if (!this.ctx || !this.playing) return 0;
    return Math.min(this.durationSec, Math.max(0, this.ctx.currentTime - this.t0));
  }

  getDurationSec(): number {
    return this.durationSec || 0;
  }

  // ユーザー操作直前に呼び出し、AudioContext を確実に起動するためのプライム関数
  async prime() {
    this.initIfNeeded();
    if (!this.ctx || !this.master) return;
    try { await this.ctx.resume(); } catch {}
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.value = 0.0001; // ほぼ無音
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const audioEngine = new Engine();
