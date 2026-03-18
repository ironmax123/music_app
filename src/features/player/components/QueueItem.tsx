"use client";

import styles from "./styles.module.css";

interface Props {
  index: number;
  title: string;
  artist: string;
  onClick?: () => void;
}

export function QueueItem({ index, title, artist, onClick }: Props) {
  return (
    <button className={styles.queueItem} onClick={onClick} aria-label={`Play ${title}`}>
      <div className={styles.queueIndex}>{index + 1}</div>
      <div className={styles.queueText}>
        <div className={styles.queueTitle}>{title}</div>
        <div className={styles.queueArtist}>{artist}</div>
      </div>
    </button>
  );
}

