# ドーナツチャート (Donut Chart)

**ソース:** `src/features/analysis/components/donut-chart.tsx`

## 概要

カテゴリ別やアプリ別の使用割合を円弧で表示する。
分析画面のランキングカード内で PieChart として使用。

## 画面イメージ

```
        ╭─────────╮
      ╱  ▓▓▒▒░░░░░  ╲
     │  ▓▓         ░░  │
     │ ▓▓   32.5%   ░░ │
     │  ▓▓         ░░  │
      ╲  ▓▓▒▒░░░░░  ╱
        ╰─────────╯
```

## Props

```ts
type DonutChartProps = {
  data: { value: number; color: string; label: string }[];
  size?: number;     // デフォルト 120, 実使用では 140
  strokeWidth?: number;  // デフォルト 16
};
```

## サイズ一覧

| 使用箇所 | size | strokeWidth |
|---|---|---|
| ランキングカード (app-detail) | 140 | 16 |
| カテゴリ別 (cat-detail) | 140 | 16 |
| デフォルト | 120 | 16 |

## 描画仕様

| プロパティ | 値 |
|---|---|
| 実装方式 | SVG `<circle>` × N |
| 背景リング色 | `#f1f5f9` (light) / `rgba(255,255,255,0.06)` (dark) |
| 回転開始角 | -90° (12時位置から) |
| strokeLinecap | round |
| fill | none |
| stroke | 各データの `color` |
| strokeDasharray | `[arcLength, circumference - arcLength]` |
| strokeDashoffset | セグメントごとに累積オフセット |

## セグメント計算

```ts
const circumference = 2 * Math.PI * radius;
const radius = (size - strokeWidth) / 2;

// 各セグメント
segments.forEach((seg, i) => {
  const arcLength = (seg.value / total) * circumference;
  const offset = cumulativeOffset;
  cumulativeOffset += arcLength;
});
```

## アニメーション (Framer Motion 対応)

```ts
// 各セグメントが順番にアニメーション
<motion.circle
  strokeDasharray={`${arcLength} ${circumference - arcLength}`}
  initial={{ strokeDashoffset: circumference }}
  animate={{ strokeDashoffset: offset }}
  transition={{
    duration: 0.8,
    delay: index * 0.08,
    ease: [0.25, 0.1, 0.25, 1],
  }}
/>
```

## 中央テキスト (オプション)

- 合計パーセンテージや値を中央に表示
- フォントサイズ: 20px, fontWeight: 700
- 色: `colors.text`
