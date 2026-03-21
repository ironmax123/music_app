"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PlayerScreen } from "@/features/player/PlayerScreen";
import { defaultPlaylist, getPlaylistById } from "@/features/player/data/playlists";

export default function PlayerPage() {
  const params = useSearchParams();
  const pl = params.get("pl");
  const playlist = useMemo(() => (pl ? getPlaylistById(pl) ?? defaultPlaylist : defaultPlaylist), [pl]);
  return <PlayerScreen playlist={playlist} />;
}
