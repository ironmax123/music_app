"use client";

import styles from "./styles.module.css";
import { formatTime } from "@/shared/time";

interface Props {
  title: string;
  artist: string;
  playlistName?: string;
  coverColor?: string;
  // 再生バー同期用（state/usecases から渡される）
  positionSec?: number;
  durationSec?: number;
}

export function NowPlayingPanel({ title, artist, playlistName, coverColor, positionSec = 0, durationSec = 0 }: Props) {
  const ratio = durationSec > 0 ? Math.min(1, Math.max(0, positionSec / durationSec)) : 0;
  return (
    <section className={styles.nowPlayingCard}>
      <div
        className={styles.jacket}
        style={{ background: coverColor ?? "var(--accent-600)" }}
        aria-label="Album art"
      />
      <div className={styles.meta}>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist}</div>
        {playlistName ? <div className={styles.playlist}>{playlistName}</div> : null}
      </div>
      <div className={styles.progressBlock}>
        <div className={styles.progressBar} aria-label="Playback progress">
          <div className={styles.progressFill} style={{ width: `${ratio * 100}%` }} />
        </div>
        <div className={styles.timeRow} aria-label="Playback time">
          <span>{formatTime(positionSec)}</span>
          <span>{formatTime(durationSec)}</span>
        </div>
      </div>
    </section>
  );
}
