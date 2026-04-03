import type { Playlist } from "../domain/types";
import { samplePlaylist } from "./samplePlaylist";

// Lofi Deep Focus playlist (implements docs/musics/list.md item 1)
export const lofiDeepFocusPlaylist: Playlist = {
  id: "pl-lofi-deep-focus",
  name: "Deep Focus Lofi",
  tracks: [
    { id: "lofi-1", title: "朝の柔光", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#6b8a86", compositionId: "cmp-lofi-1", durationSec: 160 },
    { id: "lofi-2", title: "雨粒のリズム", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#6f7c8c", compositionId: "cmp-lofi-2", durationSec: 170 },
    { id: "lofi-3", title: "ペン先のドローイング", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#7a7d6a", compositionId: "cmp-lofi-3", durationSec: 165 },
    { id: "lofi-4", title: "タスクスイッチャー", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#6d7386", compositionId: "cmp-lofi-4", durationSec: 155 },
    { id: "lofi-5", title: "木漏れ日のループ", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#7d8b74", compositionId: "cmp-lofi-1", durationSec: 160 },
    { id: "lofi-6", title: "キーボード白ノイズ", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#6b6f7a", compositionId: "cmp-lofi-2", durationSec: 150 },
    { id: "lofi-7", title: "夜更けのカフェブース", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#5f6a73", compositionId: "cmp-lofi-3", durationSec: 175 },
    { id: "lofi-8", title: "フォーカスブリージング", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#6e7d7a", compositionId: "cmp-lofi-4", durationSec: 168 },
    { id: "lofi-9", title: "静かなチェックポイント", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#667c70", compositionId: "cmp-lofi-1", durationSec: 150 },
    { id: "lofi-10", title: "ウィンドウフローティング", artist: "FocusLab", playlistName: "Deep Focus Lofi", coverColor: "#6a7480", compositionId: "cmp-lofi-2", durationSec: 160 },
  ],
};

// Café Ambient Lofi playlist
export const cafeAmbientPlaylist: Playlist = {
  id: "pl-cafe-ambient",
  name: "Café Ambient Lofi",
  tracks: [
    { id: "cafe-1", title: "角砂糖と湯気", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#b7885b", compositionId: "cmp-cafe-1", durationSec: 165 },
    { id: "cafe-2", title: "木のテーブル", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#9a7b68", compositionId: "cmp-cafe-2", durationSec: 160 },
    { id: "cafe-3", title: "本をめくる手", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#c2a07d", compositionId: "cmp-cafe-3", durationSec: 158 },
    { id: "cafe-4", title: "夕焼けフィルター", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#d6b08c", compositionId: "cmp-cafe-4", durationSec: 170 },
    { id: "cafe-5", title: "角砂糖と湯気 - alt", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#b08e6e", compositionId: "cmp-cafe-1", durationSec: 150 },
    { id: "cafe-6", title: "木のテーブル - alt", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#8f7a63", compositionId: "cmp-cafe-2", durationSec: 152 },
    { id: "cafe-7", title: "本をめくる手 - alt", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#b99b77", compositionId: "cmp-cafe-3", durationSec: 162 },
    { id: "cafe-8", title: "夕焼けフィルター - alt", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#ccab85", compositionId: "cmp-cafe-4", durationSec: 160 },
    { id: "cafe-9", title: "木のテーブル - night", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#7f6b57", compositionId: "cmp-cafe-2", durationSec: 168 },
    { id: "cafe-10", title: "角砂糖と湯気 - morning", artist: "CafeUnit", playlistName: "Café Ambient Lofi", coverColor: "#a88564", compositionId: "cmp-cafe-1", durationSec: 164 },
  ],
};

export const playlists: Playlist[] = [samplePlaylist, lofiDeepFocusPlaylist, cafeAmbientPlaylist];

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}

export const defaultPlaylist = samplePlaylist;
