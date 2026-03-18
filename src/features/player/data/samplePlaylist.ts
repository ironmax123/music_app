import type { Playlist } from "../domain/types";

// モックを廃止し、docs/musics/list.md のジャンルを元にした
// 実際の演奏データ(compositions)を参照するトラック定義に置き換えました。
// 曲の配列(メロディ等)は data/compositions/library.ts を参照。

export const samplePlaylist: Playlist = {
  id: "pl-genres-001",
  name: "Genre Showcase",
  tracks: [
    { id: "t-edm", title: "EDM", artist: "SynthLab", playlistName: "Genre Showcase", coverColor: "#6A5ACD", compositionId: "cmp-edm", durationSec: 160 },
    { id: "t-y2k", title: "Y2K Pop", artist: "RetroPop", playlistName: "Genre Showcase", coverColor: "#3CB371", compositionId: "cmp-y2k", durationSec: 165 },
    { id: "t-orch", title: "Cinematic", artist: "NovaScore", playlistName: "Genre Showcase", coverColor: "#20B2AA", compositionId: "cmp-orch", durationSec: 180 },
    { id: "t-kpop", title: "K-pop Style", artist: "IdolUnit", playlistName: "Genre Showcase", coverColor: "#FF8C00", compositionId: "cmp-kpop", durationSec: 150 },
    { id: "t-jazz", title: "Easy Jazz", artist: "Loft Trio", playlistName: "Genre Showcase", coverColor: "#8A2BE2", compositionId: "cmp-jazz", durationSec: 170 },
    { id: "t-rock", title: "Rock Energy", artist: "PowerFive", playlistName: "Genre Showcase", coverColor: "#1E90FF", compositionId: "cmp-rock", durationSec: 155 },
    { id: "t-heal", title: "Healing", artist: "Ambientia", playlistName: "Genre Showcase", coverColor: "#708090", compositionId: "cmp-heal", durationSec: 180 },
    { id: "t-ballad", title: "Sad Ballad", artist: "Luna", playlistName: "Genre Showcase", coverColor: "#CD5C5C", compositionId: "cmp-ballad", durationSec: 175 },
  ],
};
