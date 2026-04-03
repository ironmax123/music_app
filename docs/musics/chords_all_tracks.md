# 全曲コード進行（実装準拠）

このファイルは src/features/player/data/compositions/library.ts の実装をもとに、各曲のコード進行（または和声の基調）をMarkdownで一覧化したものです。小節は4/4前提、1小節=4拍。

- 表記: | 和音 | 和音 | … （→ Repeat はループ）
- 「固定コードなし」は、和音パートを持たないリフ/ベース主導曲で、明示和声がコードとして実装されていないものです。

## Genre Showcase

### EDM (cmp-edm, 128 BPM)
- ループ長: 1小節
- 進行: | Em | → Repeat
- 根拠: pad=E–G–B（Em三和音）を持続。

### Y2K Pop (cmp-y2k, 100 BPM)
- ループ長: 1小節
- 進行: | G | → Repeat
- 根拠: pad=G–B–D（G三和音）を持続。ベースはG→A→B→Aのパッシング。

### Cinematic (cmp-orch, 72 BPM)
- ループ長: 3小節
- 進行: | Em | C | D | → Repeat
- 根拠: padが1小節ずつEm→C→Dを明示。

### K-pop Style (cmp-kpop, 132 BPM)
- ループ長: 1小節
- 進行: 固定コードなし（リフ/ベース主導）。推定トーナルセンター: Em系
- 根拠: 和音パートなし。ベース=E→G→A→B→…のモーダルな動き、リードは短いリック。

### Easy Jazz (cmp-jazz, 110 BPM)
- ループ長: 1小節
- 進行: 固定コードなし（リフ/ベース主導）。推定トーナルセンター: E系
- 根拠: 和音パートなし。ウォーキングベース+ピアノ単音でE–G–B周辺の色。

### Rock Energy (cmp-rock, 140 BPM)
- ループ長: 1小節
- 進行: 固定コードなし（リフ/ベース主導）。推定トーナルセンター: E/Em系
- 根拠: ベースが半音階的に上昇、ギターはE–Gのパワーコード感の刻み。

### Healing (cmp-heal, 60 BPM)
- ループ長: 2小節
- 進行: | Am | Am | → Repeat
- 根拠: pad=A–C–E（Am）持続。

### Sad Ballad (cmp-ballad, 78 BPM)
- ループ長: 2小節
- 進行: | C | Am | → Repeat
- 根拠: padが前半C（三和音）→後半Am（三和音）。

## Deep Focus Lofi

全曲ベース/ピアノを排し、padのみで長調add/maj7の固定和音。耳障りな変化を避けるため全曲2小節固定。

### 朝の柔光 (cmp-lofi-1, 80 BPM)
- ループ長: 2小節
- 進行: | Cmaj7 | Cmaj7 | → Repeat
- Voicing: C E G B

### 雨粒のリズム (cmp-lofi-2, 76 BPM)
- ループ長: 2小節
- 進行: | Gadd9 | Gadd9 | → Repeat
- Voicing: G B D A

### ペン先のドローイング (cmp-lofi-3, 84 BPM)
- ループ長: 2小節
- 進行: | Fmaj7 | Fmaj7 | → Repeat
- Voicing: F A C E

### タスクスイッチャー (cmp-lofi-4, 78 BPM)
- ループ長: 2小節
- 進行: | Dmaj7 | Dmaj7 | → Repeat
- Voicing: D F# A C#

### 木漏れ日のループ (cmp-lofi-1, 80 BPM)
- ループ長: 2小節
- 進行: | Cmaj7 | Cmaj7 | → Repeat

### キーボード白ノイズ (cmp-lofi-2, 76 BPM)
- ループ長: 2小節
- 進行: | Gadd9 | Gadd9 | → Repeat

### 夜更けのカフェブース (cmp-lofi-3, 84 BPM)
- ループ長: 2小節
- 進行: | Fmaj7 | Fmaj7 | → Repeat

### フォーカスブリージング (cmp-lofi-4, 78 BPM)
- ループ長: 2小節
- 進行: | Dmaj7 | Dmaj7 | → Repeat

### 静かなチェックポイント (cmp-lofi-1, 80 BPM)
- ループ長: 2小節
- 進行: | Cmaj7 | Cmaj7 | → Repeat

### ウィンドウフローティング (cmp-lofi-2, 76 BPM)
- ループ長: 2小節
- 進行: | Gadd9 | Gadd9 | → Repeat

---

補足: 「固定コードなし」の曲に関してコード化の要望があれば、現行のリフ/ベースに合う最小改変でpadコードを追加する提案を出します（例: K-popを | Em | D | などに固定）。
