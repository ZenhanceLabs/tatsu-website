# アプリランキングカード (App Ranking Card)

**ソース:** `src/features/analysis/components/app-ranking-card.tsx`

## 概要

使用時間の多いアプリまたはカテゴリをランキング形式で表示。
ドーナツチャートとリスト形式を併用する。

## 画面イメージ

```
┌──────────────────────────────────┐
│  [アプリ | カテゴリ]  切替タブ    │
│                                  │
│     ╭─────────╮                  │
│   ╱  ▓▓▒▒░░░░░  ╲   1. YouTube  │
│  │  ▓▓   合計  ░░  │  ████████ 35%│
│  │ ▓▓  3h42m  ░░ │  2. Twitter  │
│   ╲  ▓▓▒▒░░░░░  ╱   ██████ 20%  │
│     ╰─────────╯     3. Instagram│
│                      ████ 13%    │
│                                  │
│  4. Chrome          ███ 10%     │
│  5. LINE            ██ 8%      │
└──────────────────────────────────┘
```

## Props

```ts
type AppRankingCardProps = {
  data: RankingItem[];
  totalMinutes: number;
  valueFormatter: (v: number) => string;
  variant?: 'app' | 'category';
};

type RankingItem = {
  name: string;
  packageName?: string;
  minutes: number;
  color: string;
  icon?: string;
  category?: string;
};
```

## カード外枠

| プロパティ | 値 |
|---|---|
| borderRadius | 24 |
| padding | 20 |
| borderWidth | 1 |
| borderColor (light) | `rgba(0,0,0,0.08)` |
| borderColor (dark) | `rgba(255,255,255,0.10)` |
| backgroundColor | `colors.cardBackground` |

## 切替タブ

| プロパティ | 値 |
|---|---|
| borderRadius | 12 |
| 背景 | `colors.surface` |
| padding | 3 |
| 各タブ height | 32 |
| タブ borderRadius | 10 |
| アクティブ背景 | `colors.cardBackground` |
| アクティブ fontWeight | 600 |
| 非アクティブ色 | `colors.textSecondary` |
| fontSize | 13 |

## ドーナツチャート

| プロパティ | 値 |
|---|---|
| サイズ | 140 × 140 |
| strokeWidth | 16 |
| 詳細は | `donut-chart.md` 参照 |

## ランキングリスト

### ランクバッジ

| プロパティ | 値 |
|---|---|
| サイズ | 32 × 32 |
| borderRadius | 16 (円形) |
| 1位 背景 | `#fbbf24` (gold) |
| 1位 テキスト色 | `#78350f` |
| 2位 背景 | `#d1d5db` (silver) |
| 2位 テキスト色 | `#374151` |
| 3位 背景 | `#f59e0b + 20% opacity` |
| 3位 テキスト色 | `#b45309` |
| 4位以降 背景 | `colors.surface` |
| 4位以降 テキスト色 | `colors.textSecondary` |
| fontSize | 14 |
| fontWeight | 700 |

### アプリアイコン

| プロパティ | 値 |
|---|---|
| サイズ | 48 × 48 |
| borderRadius | 16 |
| フォールバック背景 | カテゴリカラーの 15% opacity |
| フォールバックアイコン | カテゴリのデフォルトアイコン (lucide) |

### プログレスバー

| プロパティ | 値 |
|---|---|
| 高さ | 6 |
| borderRadius | 3 |
| 背景 (トラック) | `colors.border` |
| 塗り | ランキング項目の `color` |
| 最大幅 | `percentage%` |

### 値表示

| プロパティ | 値 |
|---|---|
| パーセンテージ fontSize | 20 |
| パーセンテージ fontWeight | 700 |
| パーセンテージ 色 | `colors.accent` |
| 時間 fontSize | 13 |
| 時間 色 | `colors.textSecondary` |

### 行レイアウト

| プロパティ | 値 |
|---|---|
| 行高さ | 72 |
| gap | 12 |
| 区切り線 | `borderBottomWidth: 1`, `borderColor: colors.border` |
| 最後の行 | 区切り線なし |

## アニメーション (Framer Motion 対応)

```ts
// ランキング行の順次出現
{items.map((item, i) => (
  <motion.div
    key={item.name}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
  />
))}

// プログレスバー
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${percentage}%` }}
  transition={{ delay: 0.2 + index * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
/>

// タブ切替
<motion.div
  layoutId="tab-indicator"
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```
