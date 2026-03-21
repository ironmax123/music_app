"use client";

import Link from "next/link";
import styles from "./playlist-card.module.css";

interface Props {
  href: string;
  title: string;
  subtitle?: string;
  colors?: string[]; // up to 4 colors to build a mosaic cover
}

export function PlaylistCard({ href, title, subtitle, colors = [] }: Props) {
  const palette = colors.slice(0, 4);
  // pad to 4 squares for layout predictability
  const padded = [...palette];
  while (padded.length < 4) padded.push("#222831");

  return (
    <Link href={href} className={styles.card} aria-label={`${title} を開く`}>
      <div className={styles.cover} aria-hidden>
        <div className={styles.square} style={{ background: padded[0] }} />
        <div className={styles.square} style={{ background: padded[1] }} />
        <div className={styles.square} style={{ background: padded[2] }} />
        <div className={styles.square} style={{ background: padded[3] }} />
      </div>
      <div className={styles.meta}>
        <div className={styles.title}>{title}</div>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>
    </Link>
  );
}

