import type { Playlist, QueueState } from "../domain/types";

export function buildLinearOrder(playlist: Playlist, startIndex: number): number[] {
  const n = playlist.tracks.length;
  if (n === 0) return [];
  const order: number[] = [];
  for (let i = 0; i < n; i++) {
    order.push((startIndex + i) % n);
  }
  return order;
}

export function buildShuffleOrder(playlist: Playlist, currentIndex: number): number[] {
  const n = playlist.tracks.length;
  if (n === 0) return [];
  const rest = Array.from({ length: n - 1 }, (_, i) => (i < currentIndex ? i : i + 1));
  // Fisher-Yates
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [currentIndex, ...rest];
}

export function nextQueueState(playlist: Playlist, queue: QueueState): QueueState {
  if (queue.order.length === 0) return queue;
  // Move current to next by rotating left by 1
  const rotated = [...queue.order.slice(1), queue.order[0]];
  return { ...queue, order: rotated, currentIndex: rotated[0] };
}

export function prevQueueState(playlist: Playlist, queue: QueueState): QueueState {
  if (queue.order.length === 0) return queue;
  // Move current to previous by rotating right by 1
  const last = queue.order[queue.order.length - 1];
  const rotated = [last, ...queue.order.slice(0, -1)];
  return { ...queue, order: rotated, currentIndex: rotated[0] };
}

export function toggleShuffleQueue(playlist: Playlist, queue: QueueState): QueueState {
  const nextShuffle = !queue.shuffle;
  const current = queue.order.length > 0 ? queue.order[0] : 0;
  const order = nextShuffle
    ? buildShuffleOrder(playlist, current)
    : buildLinearOrder(playlist, current);
  return { currentIndex: current, order, shuffle: nextShuffle };
}

export function initQueue(playlist: Playlist, startIndex = 0, shuffle = false): QueueState {
  const order = shuffle
    ? buildShuffleOrder(playlist, startIndex)
    : buildLinearOrder(playlist, startIndex);
  return { currentIndex: order[0] ?? 0, order, shuffle };
}

export function getNextIndices(queue: QueueState): number[] {
  // exclude first (current)
  return queue.order.slice(1);
}
