# 折れ線グラフ (Line Chart)

**ソース:** `src/features/analysis/line-chart.tsx`

## 概要

使用時間やスコアの推移を滑らかなベジェ曲線で表示する。
棒グラフと切り替えて使用される。

## 画面イメージ

```
 Y軸
 3h |
    |        ╱╲
 2h |   ╱╲╱╱    ╲
    |  ╱            ╲
 1h | ╱                ╲╱╲
    |╱                      ╲
  0 +----+-----+-----+-----+-----→
    月   火    水    木    金   土
```

## Props

```ts
type LineChartProps = {
  series: TrendSeries;
  color: string;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  valueFormatter: (v: number) => string;
  height?: number;                  // デフォルト 200px
  withAnimation?: boolean;
};
```

## 線の描画

| プロパティ | 値 |
|---|---|
| 補間方式 | 3次ベジェ (tension = 0.15) |
| strokeWidth | 2.5 |
| fill | none |
| strokeLinecap | round |
| strokeLinejoin | round |

## アクティブポイント

| プロパティ | 値 |
|---|---|
| ドット半径 | 6 |
| ドット塗り | `color` prop |
| ドットストローク | white, width 2 |
| 縦破線 | `strokeDasharray="4,3"`, `strokeWidth=1` |

## アニメーション (Framer Motion 対応)

```ts
// パスが左から右へ描画される効果
// SVG の pathLength + strokeDasharray を使う
<motion.path
  d={pathD}
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
/>
```

## レイアウト

棒グラフと同一:
- 左パディング: 56px
- 右パディング: 28px
- 上下パディング: 16px
- チャート高さ: 200px
