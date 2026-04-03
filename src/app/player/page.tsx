"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PlayerScreen } from "@/features/player/PlayerScreen";
import { defaultPlaylist, getPlaylistById } from "@/features/player/data/playlists";

function PlayerContent() {
  const params = useSearchParams();
  const pl = params.get("pl");
  const playlist = useMemo(() => (pl ? getPlaylistById(pl) ?? defaultPlaylist : defaultPlaylist), [pl]);
  return <PlayerScreen playlist={playlist} />;
}

export default function PlayerPage() {
  return (
    <Suspense fallback={null}>
      <PlayerContent />
    </Suspense>
  );
}
