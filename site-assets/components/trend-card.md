# トレンドカード (Trend Card)

**ソース:** `src/features/analysis/components/trend-card.tsx`

## 概要

分析画面で使用時間やZenScoreの推移をグラフ付きで表示するカード。
カード内で折れ線/棒グラフを切り替え可能。

## 画面イメージ

```
┌──────────────────────────────────┐
│  ■ 合計使用時間                  │← アクセントバー + タイトル
│  ▎                              │
│  3h 42m         ▲12%   [📊/📈]  │← 合計値 + デルタ + 切替
│                                  │
│  ┌────────────────────────────┐  │
│  │     ╱╲                     │  │
│  │  ╱╱    ╲╲                  │  │← チャートエリア (160px)
│  │╱╱          ╲╲╱╱            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ YouTube        1h 20m  35%│  │← ブレイクダウンパネル
│  │ Twitter          45m  20%│  │
│  │ Instagram        30m  13%│  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## Props

```ts
type TrendCardProps = {
  title: string;
  data: TrendSeries;
  color: string;            // アクセントカラー
  valueFormatter: (v: number) => string;
  breakdown?: BreakdownItem[];
  defaultChartType?: 'line' | 'bar';
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

## アクセントバー + タイトル行

| プロパティ | 値 |
|---|---|
| バーサイズ | 4 × 32 px |
| バー borderRadius | 2 |
| バー色 | `color` prop |
| タイトル fontSize | 11 |
| タイトル fontWeight | 700 |
| タイトル letterSpacing | 1.5 |
| タイトル textTransform | uppercase |
| タイトル色 | `color` prop |

## 合計値

| プロパティ | 値 |
|---|---|
| fontSize | 38 |
| fontWeight | 800 |
| 色 | `colors.text` |

## デルタ (増減表示)

| プロパティ | 値 |
|---|---|
| fontSize | 13 |
| fontWeight | 600 |
| 増加色 | `#ef4444` (赤 = 使用増で警告) |
| 減少色 | `#10b981` (緑 = 使用減で良) |
| アイコン | `TrendingUp` / `TrendingDown` (lucide), size: 14 |

## チャート切替ボタン

| プロパティ | 値 |
|---|---|
| サイズ | 36 × 36 |
| borderRadius | 18 (円形) |
| 背景 | `colors.accent + 10% opacity` |
| アイコン | `BarChart3` / `TrendingUp` (lucide), size: 18 |
| アイコン色 | `colors.accent` |

## チャートエリア

| プロパティ | 値 |
|---|---|
| 高さ | 160 |
| チャート種別 | `LineChart` または `BarChart` (切替) |
| チャート色 | `color` prop |

## ブレイクダウンパネル

| プロパティ | 値 |
|---|---|
| 区切り線 | `borderTopWidth: 1`, `borderColor: colors.border` |
| 行高さ | 44 |
| アプリ名 fontSize | 14, fontWeight: 500 |
| 値 fontSize | 14, fontWeight: 600 |
| パーセンテージ fontSize | 13, color: `colors.textSecondary` |
| アプリアイコン | 32 × 32, borderRadius: 10 |
| 最大表示件数 | 5 |

## アニメーション (Framer Motion 対応)

```ts
// カード出現
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
/>

// 合計値カウントアップ
<motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, delay: 0.2 }}
/>

// チャート切替
<AnimatePresence mode="wait">
  <motion.div
    key={chartType}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
  />
</AnimatePresence>
```
