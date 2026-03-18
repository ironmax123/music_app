export type TrackId = string;

export interface Track {
  id: TrackId;
  title: string;
  artist: string;
  playlistName?: string;
  durationSec?: number;
  coverColor?: string; // simple placeholder color for jacket
  // 楽曲データ参照ID: 実際の演奏データ(メロディ配列など)は data/compositions で定義
  // NOTE: 曲の配列(メロディ/ベース/コード等)は data/compositions/*.ts に書いています
  compositionId?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export interface QueueState {
  currentIndex: number; // index in playlist.tracks
  order: number[]; // queue of indices, starting from currentIndex inclusive
  shuffle: boolean;
}

export interface UiState {
  isQueueOpen: boolean;
  isPlaying: boolean;
  positionSec: number; // UI playback position (simulated)
}

export interface PlayerState {
  playlist: Playlist;
  queue: QueueState;
  ui: UiState;
}
