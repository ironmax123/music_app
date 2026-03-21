"use client";

import { NowPlayingPanel } from "./components/NowPlayingPanel";
import { PlaybackControls } from "./components/PlaybackControls";
import { QueueSidebar } from "./components/QueueSidebar";
import { usePlayerState } from "./state/playerState";
import type { Playlist } from "./domain/types";
import styles from "./components/styles.module.css";

export function PlayerScreen({ playlist }: { playlist: Playlist }) {
  const { state, currentTrack, nextTracks, progress, actions } = usePlayerState(playlist);

  return (
    <main className={styles.screen} data-queue-open={state.ui.isQueueOpen}>
      <div className={styles.leftColumn}>
        <NowPlayingPanel
          title={currentTrack?.title ?? ""}
          artist={currentTrack?.artist ?? ""}
          playlistName={currentTrack?.playlistName}
          coverColor={currentTrack?.coverColor}
          positionSec={progress.positionSec}
          durationSec={progress.durationSec}
        />
        <PlaybackControls
          isPlaying={state.ui.isPlaying}
          shuffle={state.queue.shuffle}
          isQueueOpen={state.ui.isQueueOpen}
          onPrimeAudio={actions.primeAudio}
          onTogglePlay={actions.togglePlay}
          onPrev={actions.prev}
          onNext={actions.next}
          onToggleShuffle={actions.toggleShuffle}
          onToggleQueueOpen={actions.toggleQueueOpen}
        />
      </div>
      {state.ui.isQueueOpen ? (
        <QueueSidebar
          isOpen
          items={nextTracks.map((t) => ({ title: t.title, artist: t.artist }))}
          onSelect={(i) => actions.selectFromQueue(i)}
          onClose={actions.toggleQueueOpen}
        />
      ) : null}
    </main>
  );
}
