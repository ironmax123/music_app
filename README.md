# music_app

Next.js で作る、作曲データ（配列）を Web Audio API で合成再生しながら、プレイリスト/キュー操作を体験できるミュージックプレイヤー UI プロジェクトです。UI は Presentation に専念し、再生順やシャッフル等の振る舞いは usecase、状態は state に分離しています。

**主なポイント**
- フロントエンド完結（API なし）で動作
- 再生画面 + 右側「次に再生」キューの二列レイアウト
- 再生/一時停止、前/次、シャッフル、キュー表示切替をサポート
- 作曲データは配列（音符: 開始拍/長さ/音量/周波数）で定義し、Web Audio API で合成再生
- アイコンは絵文字ではなく inline SVG（アクセシブル）を使用

**デモ構成（抜粋）**
- 8ジャンル相当の簡易モチーフを `src/features/player/data/compositions` に定義（EDM, Y2K, Cinematic, K‑pop, Jazz, Rock, Healing, Ballad）
- `samplePlaylist` がそれらをプレイリスト化
- `audioEngine` が Web Audio API で合成再生（ブラウザの自動再生制限に対応する prime 付き）

## アーキテクチャ
- Presentation: UI 表示のみ（`features/*/components`, `PlayerScreen`）
- State: 画面状態/再生キューの保持（`features/*/state`）
- Usecase: 再生順・シャッフル・次/前・キュー再構築（`features/*/usecases`）
- Domain: 型定義（`features/*/domain`）
- Data: ローカルの作曲データ/プレイリスト（`features/*/data`）
- Shared: 再利用ユーティリティ/アイコン（`src/shared`）

詳細な仕様は `docs/specs.md` と `docs/musics/specs.md`、UI 実装レポートは `docs/implementation.md` を参照してください。

## ディレクトリ構成（主要）
- `src/app/` … Next.js エントリとレイアウト
- `src/features/player/`
  - `PlayerScreen.tsx` … 画面オーケストレーター
  - `components/` … NowPlayingPanel / PlaybackControls / QueueSidebar など
  - `state/playerState.ts` … 再生キュー/UI 状態とアクション
  - `usecases/queue.ts` … 線形/シャッフル順生成、次/前、選択
  - `usecases/audioEngine.ts` … Web Audio API による合成再生
  - `data/compositions/*` … ジャンル別モチーフ（配列化された音符）
  - `data/samplePlaylist.ts` … プレイリスト
- `src/shared/icons/` … inline SVG アイコン（Shuffle/Prev/Play/Pause/Next/Queue）
- `src/shared/time.ts` … 表示用 `mm:ss` フォーマッタ

## 主な機能
- 再生/一時停止、前/次、シャッフル切替
- 右サイドの「次に再生」一覧の表示/非表示
- リスト項目選択で即座にその曲を先頭に（order 回転）
- 再生中の進行状況 UI（Web Audio の現在時刻から計算）

## 技術スタック
- Next.js 16（App Router）
- React 19
- TypeScript
- CSS Modules（ダークテーマ変数）
- Biome（lint/format）

## アクセシビリティとアイコン指針（AGENTS 準拠）
- 絵文字は使用しません。`src/shared/icons` の inline SVG またはローカル提供の Material Symbols を利用
- ボタンには意味の伝わる `aria-label` を付与し、SVG は装飾目的で `aria-hidden="true"` を付与
- UI は Presentation に専念し、ビジネスロジックは `features/*/usecases`、状態は `features/*/state` へ

## セットアップ/起動
```bash
npm install
npm run dev
# http://localhost:3000 を開く
```

## スクリプト
- `npm run dev` … 開発サーバー
- `npm run build` … ビルド
- `npm run start` … 本番サーバー
- `npm run lint` … Biome チェック
- `npm run format` … Biome フォーマット

## 今後の拡張例
- ループ/シーク/複数プレイリスト/検索/ストレージ保存
- オーディオ処理の強化（エフェクト/ドラム合成/種付きシャッフル）
