# フロントエンド実装レポート（UI 実装詳細）

本書は `docs/specs.md` をもとに構築したフロントエンド UI 実装の詳細レポートである。API は作成せず、フロントエンド完結・Material Design の考え方に沿った見た目・責務分離（Presentation/State/Usecase/Domain/Data）に基づき、画面作成とコンポーネント分割に注力した。

---

## 1. 概要

- 目的: 作曲は行わず、再生 UI の画面を中心に実装。画面主役は「現在再生中の曲」で、右側に次曲リストを配置。
- 技術: Next.js（App Router）、React、CSS Modules（ダーク基調のテーマ変数）。
- ポリシー: UI とロジックの分離、絵文字アイコンは禁止し SVG を使用（AGENTS.md に明記）。
- データ: ローカルのモックプレイリストを使用（将来永続化は拡張余地）。

---

## 2. 実装全体像

- Presentation 層は表示責務に専念し、状態変更は State/Usecase に委譲。
- State 層は画面の UI 状態と再生キュー状態を保持。
- Usecase 層は再生順生成（線形/シャッフル）、次曲/前曲遷移、右リスト表示切替などの振る舞いを提供。
- Domain 層で型概念（Track/Playlist/QueueState/UIState/PlayerState）を定義。
- Data 層でモックのプレイリストを供給。
- Shared にアイコン（SVG）を集約。

---

## 3. ディレクトリ/ファイル構成

- `src/app/page.tsx` … エントリ。`PlayerScreen` を描画
- `src/features/player/PlayerScreen.tsx` … 画面統括（レイアウトと配線のみ）
- `src/features/player/components/` … UI コンポーネント群
  - `NowPlayingPanel.tsx` … ジャケット/曲名/アーティスト/プレイリスト名/進行バー
  - `PlaybackControls.tsx` … 再生/一時停止、前へ、次へ、シャッフル、右リスト切替
  - `QueueSidebar.tsx` … 右側の次曲リスト（開閉可能）
  - `QueueItem.tsx` … リストの 1 行
  - `styles.module.css` … テーマ変数/カード/ボタン/サイドバーなどのスタイル
- `src/features/player/state/playerState.ts` … React Hook による状態管理と UI への提供
- `src/features/player/usecases/queue.ts` … キュー初期化/線形順/シャッフル順/次曲/前曲/次曲一覧
- `src/features/player/domain/types.ts` … 型定義（Track/Playlist/QueueState/UIState/PlayerState）
- `src/features/player/data/samplePlaylist.ts` … モックのプレイリスト
- `src/shared/icons/index.tsx` … 共通 SVG アイコン（Shuffle/Next/Prev/Queue）

---

## 4. レイヤ別詳細

### 4.1 Presentation 層
- `PlayerScreen` は `usePlayerState()` から `state` と `actions` を取得し、各 UI コンポーネントへ props で委譲。
- 各部品（NowPlayingPanel/PlaybackControls/QueueSidebar/QueueItem）は表示に専念。ビジネスロジックなし。

### 4.2 State 層（`usePlayerState`）
- 保持: `playlist`, `queue`（`currentIndex`, `order`, `shuffle`）, `ui`（`isQueueOpen`, `isPlaying`）。
- 導出: `currentTrack`, `nextTracks`（`queue.order` の先頭以外）。
- アクション: `togglePlay`, `next`, `prev`, `toggleShuffle`, `toggleQueueOpen`, `selectFromQueue`。
  - `selectFromQueue(i)` は右リスト i 番目を先頭に来るよう `order` を回転。

### 4.3 Usecase 層（`queue.ts`）
- `initQueue(playlist, start, shuffle)` … 初期キュー生成。
- `buildLinearOrder(playlist, start)` … 現在曲基準の線形順（循環）。
- `buildShuffleOrder(playlist, current)` … 現在曲を先頭に残りを Fisher–Yates でシャッフル。
- `nextQueueState(playlist, queue)` … `order` を左回転、先頭を次へ。
- `prevQueueState(playlist, queue)` … `order` を右回転、最後を先頭へ。
- `toggleShuffleQueue(playlist, queue)` … シャッフル状態を反転し、現在曲を維持したまま順序再構築。
- `getNextIndices(queue)` … 次曲一覧用に先頭以降のインデックス配列を返却。

### 4.4 Domain 層（`types.ts`）
- `Track`, `Playlist` の基本プロパティ（title/artist/playlistName/coverColor 等）。
- `QueueState`, `UiState`, `PlayerState` を定義。

### 4.5 Data 層（`samplePlaylist.ts`）
- シンプルな 6 曲のモックデータを定義。
- ジャケットはカラー矩形で代替（`coverColor`）。

### 4.6 Shared（`icons/`）
- `ShuffleIcon`, `NextIcon`, `PrevIcon`, `QueueIcon` を inline SVG で実装。
- `currentColor` + `strokeWidth` を採用し、ボタン状態で色を一元制御。

---

## 5. UI コンポーネント詳細

### 5.1 PlayerScreen
- レイアウトと配線を担当。左カラム（NowPlayingPanel + Controls）と右サイドバー（Queue）。
- 右サイドバーは `isQueueOpen` に応じてマウント/アンマウント。狭幅時は 1 カラムに自動収縮。

### 5.2 NowPlayingPanel
- ジャケット/曲名/アーティスト/プレイリスト名/擬似プログレス（見た目のみ）。
- ジャケットは `coverColor` を使用した角丸矩形。

### 5.3 PlaybackControls
- 左: シャッフル、中央: 前/再生-停止/次、右: 右リスト表示切替。
- 各ボタンは `aria-label` を付与、状態は `data-active` で視覚表現（枠色/背景）。

### 5.4 QueueSidebar
- 見出し「Up Next」とリスト。
- `items` は UI 用に title/artist の絞り込み済み配列を受け取る（Presentation 側に変換を持たせない）。

### 5.5 QueueItem
- 行クリックで `selectFromQueue(indexInOrder)` を発火。視覚はタイトル強調＋アーティスト補助。

---

## 6. 状態管理とデータフロー

1. 初期表示
   - `samplePlaylist` を読み込む → `initQueue` で `order` を生成（デフォルトは線形、先頭から）。
   - `ui.isQueueOpen=true`、`ui.isPlaying=false`。
2. 再生/一時停止
   - `togglePlay()` が `ui.isPlaying` を反転。UI の表示のみ（実再生は仕様外）。
3. 次/前
   - `next()` が `nextQueueState()` を実行し `order` 左回転。
   - `prev()` が `prevQueueState()` を実行し `order` 右回転。
4. シャッフル ON/OFF
   - `toggleShuffle()` が `toggleShuffleQueue()` を実行し、現在曲を維持したまま順序を再構築。
5. 右リスト表示切替
   - `toggleQueueOpen()` が `ui.isQueueOpen` を反転。`PlayerScreen` は列定義を切り替え。
6. 右リストの曲選択
   - `selectFromQueue(i)` が `order` を i 番目が先頭になるよう回転。

---

## 7. スタイリング/テーマ

- `styles.module.css` にてダーク基調テーマ変数を定義（背景/パネル/アクセント/角丸/影）。
- Material Design 風の層表現: カード（NowPlaying/Controls/Sidebar）には角丸 + シャドウを付与。
- レイアウトは 2 カラム（`grid-template-columns: 1fr 320px`）。右リスト非表示時は 1 カラムへ。
- ボタンは `iconButton`（状態枠/背景変化）と `primaryButton`（再生）で役割分離。
- レスポンシブ: 980px 以下では 1 カラム表示。

---

## 8. アクセシビリティ

- すべての操作ボタンに `aria-label` を付与。
- アイコン SVG は `aria-hidden="true"` とし、意味はボタン側ラベルが担保。
- 色のみ依存の状態表現を避け、形状/枠色/背景の併用で状態を示す（シャッフル有効やリスト開/閉）。

---

## 9. アイコン方針と実装

- 絵文字は禁止（`AGENTS.md` に明記）。
- Inline SVG を `src/shared/icons` に集約し、`currentColor` で色を継承。
- 採用アイコン: `ShuffleIcon`, `NextIcon`, `PrevIcon`, `QueueIcon`。
- 将来、Google Material Symbols を使う場合もローカル提供で運用（ネットワーク依存を避ける）。

---

## 10. テスト/確認観点（UI）

- 初期表示: 現在曲が表示され、右リストに次曲一覧が並ぶ。
- 操作: 再生/一時停止、前/次、シャッフル切替、右リスト開閉で UI 状態が反映される。
- シャッフル: ON/OFF 切替で右リストの順序が変化し、現在曲は維持される。
- 選曲: 右リスト項目クリックでその曲が現在曲になる（order 回転）。
- アクセシビリティ: `aria-label` の存在、フォーカス可能、状態の視覚変化が確認できる。

---

## 11. 将来拡張性

- ループ/シーク/検索/複数プレイリスト/ストレージ保存は usecase/state の追加で拡張可能。
- 実音声再生は Infrastructure 相当（Audio 要素/AudioContext 等）を別レイヤに追加し、usecase から制御。
- テーマ切替は CSS 変数のスコープ切替で容易に対応可能。

---

## 12. 既知の制約とトレードオフ

- 音声再生は仕様外のため未実装（UI のみ）。
- シャッフルは Math.random ベースの単純実装（真の再現性/種は考慮外）。
- Next/Prev は循環前提の回転ロジック（末尾到達時の停止/非循環は要件外）。

---

## 13. 導入/起動方法

- 開発: `npm run dev` で起動 → `http://localhost:3000`
- ビルド: `npm run build`（環境によってはローカル設定が必要）

---

## 14. 主な差分（要点）

- `page.tsx` を `PlayerScreen` 表示へ変更。
- Player 機能のフォルダ (`features/player`) を新設し、層分離を徹底。
- 絵文字アイコンを廃止し、`shared/icons` の SVG に置換（AGENTS ルール追記）。

---

## 付録: 型定義要点

- `Track`: `id`, `title`, `artist`, `playlistName`, `durationSec?`, `coverColor?`
- `Playlist`: `id`, `name`, `tracks: Track[]`
- `QueueState`: `currentIndex`, `order: number[]`, `shuffle`
- `UiState`: `isQueueOpen`, `isPlaying`
- `PlayerState`: `playlist`, `queue`, `ui`

以上。

