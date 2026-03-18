"use client";

import { useEffect, useMemo, useState } from "react";
import { samplePlaylist } from "../data/samplePlaylist";
import type { PlayerState } from "../domain/types";
import { audioEngine } from "../usecases/audioEngine";
import { getCompositionMap } from "../data/compositions/library";
import { getNextIndices, initQueue, nextQueueState, prevQueueState, toggleShuffleQueue } from "../usecases/queue";

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>(() => ({
    playlist: samplePlaylist,
    queue: initQueue(samplePlaylist, 0, false),
    ui: { isQueueOpen: true, isPlaying: false },
  }));

  const currentTrack = useMemo(
    () => state.playlist.tracks[state.queue.order[0] ?? 0],
    [state.playlist.tracks, state.queue.order],
  );

  const nextTracks = useMemo(() => {
    const indices = getNextIndices(state.queue);
    return indices.map((i) => state.playlist.tracks[i]);
  }, [state.queue, state.playlist.tracks]);

  const compMap = useMemo(() => getCompositionMap(), []);
  const [progress, setProgress] = useState({ positionSec: 0, durationSec: 0 });

  // 再生バー同期（WebAudio の現在時刻）
  useEffect(() => {
    if (!state.ui.isPlaying) {
      setProgress({ positionSec: 0, durationSec: 0 });
      return;
    }
    const id = setInterval(() => {
      setProgress({ positionSec: audioEngine.getPositionSec(), durationSec: audioEngine.getDurationSec() });
    }, 200);
    return () => clearInterval(id);
  }, [state.ui.isPlaying]);

  const actions = {
    primeAudio: () => audioEngine.prime(),
    // 再生開始/停止
    togglePlay: () =>
      setState((s) => {
        const willPlay = !s.ui.isPlaying;
        const track = s.playlist.tracks[s.queue.order[0] ?? 0];
        if (willPlay && track?.compositionId) {
          const comp = compMap.get(track.compositionId);
          if (comp) audioEngine.play(comp, { durationSec: track.durationSec ?? 150 });
        } else {
          audioEngine.stop();
        }
        return { ...s, ui: { ...s.ui, isPlaying: willPlay } };
      }),
    // 次/前（再生中は即切替）
    next: () =>
      setState((s) => {
        const ns = { ...s, queue: nextQueueState(s.playlist, s.queue) };
        if (s.ui.isPlaying) {
          const t = ns.playlist.tracks[ns.queue.order[0] ?? 0];
          if (t?.compositionId) {
            const comp = compMap.get(t.compositionId);
            if (comp) audioEngine.play(comp, { durationSec: t.durationSec ?? 150 });
          }
        }
        return ns;
      }),
    prev: () =>
      setState((s) => {
        const ns = { ...s, queue: prevQueueState(s.playlist, s.queue) };
        if (s.ui.isPlaying) {
          const t = ns.playlist.tracks[ns.queue.order[0] ?? 0];
          if (t?.compositionId) {
            const comp = compMap.get(t.compositionId);
            if (comp) audioEngine.play(comp, { durationSec: t.durationSec ?? 150 });
          }
        }
        return ns;
      }),
    toggleShuffle: () => setState((s) => ({ ...s, queue: toggleShuffleQueue(s.playlist, s.queue) })),
    toggleQueueOpen: () => setState((s) => ({ ...s, ui: { ...s.ui, isQueueOpen: !s.ui.isQueueOpen } })),
    selectFromQueue: (indexInOrder: number) =>
      setState((s) => {
        const before = s.queue.order.slice(0, indexInOrder + 1);
        const newOrder = [...s.queue.order.slice(indexInOrder + 1), ...before];
        const ns = { ...s, queue: { ...s.queue, order: newOrder, currentIndex: newOrder[0] } };
        if (s.ui.isPlaying) {
          const t = ns.playlist.tracks[ns.queue.order[0] ?? 0];
          if (t?.compositionId) {
            const comp = compMap.get(t.compositionId);
            if (comp) audioEngine.play(comp, { durationSec: t.durationSec ?? 150 });
          }
        }
        return ns;
      }),
  } as const;

  return { state, currentTrack, nextTracks, progress, actions };
}
