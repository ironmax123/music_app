"use client";

import { useEffect, useMemo, useState } from "react";
import { samplePlaylist } from "../data/samplePlaylist";
import type { PlayerState } from "../domain/types";
import { getNextIndices, initQueue, nextQueueState, prevQueueState, toggleShuffleQueue } from "../usecases/queue";

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>(() => ({
    playlist: samplePlaylist,
    queue: initQueue(samplePlaylist, 0, false),
    ui: { isQueueOpen: true, isPlaying: false, positionSec: 0 },
  }));

  const currentTrack = useMemo(
    () => state.playlist.tracks[state.queue.order[0] ?? 0],
    [state.playlist.tracks, state.queue.order],
  );

  const nextTracks = useMemo(() => {
    const indices = getNextIndices(state.queue);
    return indices.map((i) => state.playlist.tracks[i]);
  }, [state.queue, state.playlist.tracks]);

  const durationSec = currentTrack?.durationSec ?? 0;

  // Simulate progress when playing; auto-advance at track end.
  useEffect(() => {
    if (!state.ui.isPlaying || durationSec <= 0) return;
    const id = setInterval(() => {
      setState((s) => {
        const cur = s.ui.positionSec + 1;
        const dur = s.playlist.tracks[s.queue.order[0] ?? 0]?.durationSec ?? 0;
        if (cur >= dur && dur > 0) {
          const next = nextQueueState(s.playlist, s.queue);
          return { ...s, queue: next, ui: { ...s.ui, positionSec: 0 } };
        }
        return { ...s, ui: { ...s.ui, positionSec: cur } };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.ui.isPlaying, durationSec]);

  const actions = {
    togglePlay: () => setState((s) => ({ ...s, ui: { ...s.ui, isPlaying: !s.ui.isPlaying } })),
    next: () => setState((s) => ({ ...s, queue: nextQueueState(s.playlist, s.queue), ui: { ...s.ui, positionSec: 0 } })),
    prev: () => setState((s) => ({ ...s, queue: prevQueueState(s.playlist, s.queue), ui: { ...s.ui, positionSec: 0 } })),
    toggleShuffle: () => setState((s) => ({ ...s, queue: toggleShuffleQueue(s.playlist, s.queue), ui: { ...s.ui, positionSec: 0 } })),
    toggleQueueOpen: () => setState((s) => ({ ...s, ui: { ...s.ui, isQueueOpen: !s.ui.isQueueOpen } })),
    selectFromQueue: (indexInOrder: number) =>
      setState((s) => {
        const before = s.queue.order.slice(0, indexInOrder + 1);
        const newOrder = [...s.queue.order.slice(indexInOrder + 1), ...before];
        return { ...s, queue: { ...s.queue, order: newOrder, currentIndex: newOrder[0] }, ui: { ...s.ui, positionSec: 0 } };
      }),
  } as const;

  const progress = { positionSec: state.ui.positionSec, durationSec };

  return { state, currentTrack, nextTracks, progress, actions };
}

