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

  // 再生バー同期: isPlaying が true の間、AudioEngine から位置/総時間を取得して更新
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
    // 再生ボタン: 現在のトラックの compositionId を引いて AudioEngine で再生/停止
    togglePlay: () =>
      setState((s) => {
        const willPlay = !s.ui.isPlaying;
        const track = s.playlist.tracks[s.queue.order[0] ?? 0];
        // ここで曲の配列から Composition を引き、AudioEngine で Web Audio API を使って再生/停止
        if (willPlay && track?.compositionId) {
          const comp = compMap.get(track.compositionId);
          if (comp) {
            const dur = track.durationSec ?? 150; // 2~3分に合わせる
            audioEngine.play(comp, {
              durationSec: dur,
              onEnded: () => {
                // 曲終了時に自動で次曲へ（再生継続）
                setState((ps) => {
                  const ns = { ...ps, queue: nextQueueState(ps.playlist, ps.queue) };
                  if (ps.ui.isPlaying) {
                    const nt = ns.playlist.tracks[ns.queue.order[0] ?? 0];
                    if (nt?.compositionId) {
                      const ncomp = compMap.get(nt.compositionId);
                      if (ncomp)
                        audioEngine.play(ncomp, { durationSec: nt.durationSec ?? dur });
                    }
                  }
                  return ns;
                });
              },
            });
          }
        } else {
          audioEngine.stop();
        }
        return { ...s, ui: { ...s.ui, isPlaying: willPlay } };
      }),
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
        // rotate order so the clicked item becomes first
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
