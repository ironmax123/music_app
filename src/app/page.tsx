"use client";

import styles from "./playlist.module.css";
import { playlists } from "@/features/player/data/playlists";
import { PlaylistCard } from "@/shared/components/PlaylistCard";
import { SearchField } from "@/shared/components/SearchField";

export default function Home() {
  const cards = playlists.map((pl) => {
    const count = pl.tracks.length;
    const colors = pl.tracks.map((t) => t.coverColor).filter((v): v is string => Boolean(v));
    return { id: pl.id, title: pl.name, count, colors };
  });

  return (
    <main className={styles.screen}>
      <header className={styles.topbar}>
        <div className={styles.brand}>Music</div>
        <SearchField placeholder="検索" />
      </header>
      <div className={styles.content}>
        <h1 className={styles.heading}>プレイリスト</h1>
        <div className={styles.grid}>
          {cards.map((c) => (
            <PlaylistCard
              key={c.id}
              href={`/player?pl=${encodeURIComponent(c.id)}`}
              title={c.title}
              subtitle={`${c.count} 曲`}
              colors={c.colors}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
