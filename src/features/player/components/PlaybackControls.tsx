"use client";

import styles from "./styles.module.css";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, QueueIcon, ShuffleIcon } from "@/shared/icons";

interface Props {
  isPlaying: boolean;
  shuffle: boolean;
  isQueueOpen: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleQueueOpen: () => void;
}

export function PlaybackControls({
  isPlaying,
  shuffle,
  isQueueOpen,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleShuffle,
  onToggleQueueOpen,
}: Props) {
  return (
    <div className={styles.controlsRow}>
      <button
        className={styles.iconButton}
        aria-label={shuffle ? "Disable shuffle" : "Enable shuffle"}
        data-active={shuffle}
        onClick={onToggleShuffle}
      >
        <ShuffleIcon className={styles.icon} />
      </button>
      <div className={styles.controlsCluster}>
        <button className={styles.iconButton} aria-label="Previous" onClick={onPrev}>
          <PrevIcon className={styles.icon} />
        </button>
        <button
          className={styles.primaryIconButton}
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={onTogglePlay}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className={styles.iconButton} aria-label="Next" onClick={onNext}>
          <NextIcon className={styles.icon} />
        </button>
      </div>
      <button
        className={styles.iconButton}
        aria-label={isQueueOpen ? "Hide queue" : "Show queue"}
        data-active={isQueueOpen}
        onClick={onToggleQueueOpen}
      >
        <QueueIcon className={styles.icon} />
      </button>
    </div>
  );
}
