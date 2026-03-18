# 音が鳴る理由の調査レポート（@docs/musics）

本レポートは「曲を鳴らしているロジックがどこにあり、なぜ音が鳴っているのか」を調査した結果をまとめたものです。結論から言うと、現時点（このブランチ/状態）では実装コードに実音再生ロジックは存在せず、UI のみが実装されています。音が鳴る現象がある場合は、別ブランチや過去の残存コード、ブラウザ側の別タブ/拡張、もしくはホットリロードによる AudioContext の残存が原因の可能性が高いです。

---

## 1. 調査対象と前提
- 対象リポジトリ: この Next.js アプリ（App Router）
- 対象範囲: 音再生に関与する可能性がある実装（`src/**`）と関連ドキュメント（`docs/**`）
- 前提: `docs/specs.md` と `docs/musics/specs.md` は Web Audio API による再生設計を述べていますが、実装はUI優先で進めており、現状は「再生UIのみ」で音声再生は未実装です。

---

## 2. リポジトリ走査の結果

実コード検索の観点（代表的なキーワード）
- Web Audio API: `AudioContext`, `OscillatorNode`, `GainNode`, `start()`, `stop()`
- HTMLAudioElement: `<audio>`, `new Audio()`, `play()`
- ライブラリ: `tone`, `tone.js`

結果（この状態のリポジトリ）
- `src/` 配下に上記キーワードに該当する実装はありません。
- `package.json` に音関連ライブラリの依存もありません。
- `src/features/player/state/playerState.ts` は UI 用の「擬似進行タイマー」のみを持ち、音声 API 呼び出しは行っていません。
- `src/features/player/components/` は見た目のみ（アイコン/ボタン/プログレス表示）。

補足
- `docs/postmortem_audio_playback.md` に AudioEngine などの言及がありますが、これは「将来的/別ブランチでの実装方針・反省メモ」に基づくもので、現在のコードには該当ファイルはありません。
- `docs/musics/specs.md` は Web Audio API の設計意図を詳細に記述しています（参照設計）。

---

## 3. 「なぜ音が鳴るのか」の原因候補

「今この UI を起動して音が鳴っている」場合の現実的な原因候補は以下です。

- 別タブ/別ウィンドウ/拡張機能が音を出している
  - ブラウザのタブバーのスピーカーアイコンを確認。開発用の他タブや音量拡張など。
- 過去のホットリロードで生き残った AudioContext
  - Next.js の開発モードで HMR が走ると、意図せず以前のオブジェクトが残る場合があります。
  - DevTools のコンソールで `document.querySelectorAll('audio')` や `window.__contexts` 的なデバッグ変数の有無を確認。
- 別ブランチ/別ビルドの `audioEngine` 実装が動いている
  - 以前のビルド成果物をサーブしているケース（キャッシュ/サービスワーカー）を排除するため、ハードリロード（Cmd+Shift+R）を実施。
- OS レベル/他アプリのサウンド
  - OS 側ミキサーに他アプリの出力が表示されていないか確認。

---

## 4. 期待される再生パイプライン（設計）

「本来、音が鳴るときの正規フロー」は `docs/musics/specs.md` で設計済みです。実装される場合、次の層が関与します。

- Presentation: 再生/停止/次/前/シャッフル/キュー選択のUIイベントを発火
- Usecase: 上記イベントに応じ、次に鳴らすべき曲データを決定
- Audio Engine: Web Audio API（`AudioContext`）で音を生成・スケジューリング・出力
- State: 現在曲・キュー・シャッフル状態・再生位置等を保持

Audio Engine では一般に以下のいずれかで音が鳴ります。
- 発振器ベース: `AudioContext` → `OscillatorNode` → `GainNode` → `destination`
- サンプルベース: `AudioBufferSourceNode` にデコード済みバッファを接続して再生
- スケジューリング: `currentTime` を基準に `start(time)` / `stop(time)` を予約

UI 側は `aria-label` 等のアクセシビリティと状態表示に注力し、音の生成/停止判断は Usecase/Engine に委譲する設計です。

---

## 5. ブラウザ側での確認手順（実機で音が鳴る場合）

1) DevTools の Elements 検索
- `Ctrl/Cmd + F` で `<audio` を検索し、`HTMLAudioElement` が存在しないか確認。

2) Console での確認
- `document.querySelectorAll('audio')` → 要素の有無/`paused` 状態を確認
- `typeof AudioContext !== 'undefined'` → 使用可否の確認
- もし `window.audioContext` 等のデバッグ用参照があれば、`state` や `currentTime` を確認

3) Media パネル（Chrome）
- どのドキュメントが音声出力を持っているか確認できるため、発生元タブを特定可能

4) ハードリロード/キャッシュクリア
- `Cmd+Shift+R` でキャッシュをバイパス
- Service Worker がいる場合は登録解除

---

## 6. 現状の結論

- 当該リポジトリの現在の実装では、音が鳴るコードは存在しません（UI 進行の擬似タイマーのみ）。
- 音が鳴る現象がある場合は、別ソース（タブ/拡張/キャッシュ/他ブランチの成果物）を疑うのが妥当です。
- 将来的に `AudioEngine` を導入する際は、`docs/musics/specs.md` の設計方針に従い、責務分離とスケジューリングの堅牢化を行って実装します。

---

## 7. 参考
- 設計: `docs/musics/specs.md`（Web Audio API 作曲・再生方式設計書）
- 画面UI: `docs/specs.md`、`docs/implementation.md`
- 反省/教訓: `docs/postmortem_audio_playback.md`（別ブランチの実装を想定した教訓のまとめ）

以上。

