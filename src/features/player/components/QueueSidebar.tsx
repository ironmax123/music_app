"use client";

import styles from "./styles.module.css";
import { QueueItem } from "./QueueItem";

interface Item {
  title: string;
  artist: string;
}

interface Props {
  isOpen: boolean;
  items: Item[];
  onSelect: (indexInOrder: number) => void;
}

export function QueueSidebar({ isOpen, items, onSelect }: Props) {
  return (
    <aside className={styles.queueSide} data-open={isOpen} aria-hidden={!isOpen}>
      <header className={styles.queueHeader}>Up Next</header>
      <div className={styles.queueList}>
        {items.length === 0 ? (
          <div className={styles.queueEmpty}>No upcoming tracks</div>
        ) : (
          items.map((t, i) => (
            <QueueItem key={`${t.title}-${i}`} index={i} title={t.title} artist={t.artist} onClick={() => onSelect(i)} />
          ))
        )}
      </div>
    </aside>
  );
}

