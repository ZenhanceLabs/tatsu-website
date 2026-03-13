# 棒グラフ (Bar Chart)

**ソース:** `src/features/analysis/bar-chart.tsx`

## 概要

日別・週別の使用時間を表示するインタラクティブな縦棒グラフ。
SVG で描画され、タッチ操作で個別の棒を選択するとツールチップが表示される。

## 画面イメージ

```
 Y軸                                     
 3h |                                    
    |          ██                         
 2h |    ██    ██         ██              
    |    ██    ██    ██    ██              
 1h |    ██    ██    ██    ██    ██        
    |    ██    ██    ██    ██    ██    ██  
  0 +----+-----+-----+-----+-----+-----→
    月    火    水    木    金    土    日
```

## Props

```ts
type BarChartProps = {
  series: TrendSeries;
  color: string;                          // 棒の色（通常 colors.accent）
  activeIndex: number;                    // 選択中の棒インデックス
  onActiveIndexChange: (i: number) => void;
  valueFormatter: (v: number) => string;  // "2時間30分" 等
  height?: number;                        // デフォルト 200px
  withAnimation?: boolean;                // デフォルト true
};
```

## データ構造 (TrendSeries)

```ts
interface TrendSeries {
  points: { label: string; value: number; date: Date }[];
  unit: 'minutes' | 'score';
  ticks?: { index: number; label: string }[];
  total?: number;
  average?: number;
}
```

## レイアウト

| 部位 | 値 |
|---|---|
| 左パディング (Y軸ラベル領域) | 56px |
| 右パディング | 28px |
| 上下パディング | 16px |
| チャート高さ | 200px (デフォルト) |

## 棒 (Bar)

| プロパティ | 値 |
|---|---|
| 幅 | `min(stepX * 0.6, 40px)` |
| 角丸 | `rx={3}` (上部のみ) |
| 透明度 | 0.85 (通常) / 1.0 (アクティブ) |
| アクティブ時ストローク | `strokeWidth={3}`, 色は `color` prop |
| ベースライングリッド線 | `stroke="#e2e8f0"`, `strokeWidth={1}` |

## Y軸テキスト

| プロパティ | 値 |
|---|---|
| fontSize | 9 |
| fill | `#94a3b8` |
| textAnchor | `end` |

## X軸テキスト

| プロパティ | 値 |
|---|---|
| fontSize | 10 |
| fill | `#94a3b8` |
| textAnchor | `middle` |

## アクティブインジケーター

選択中の棒には縦の破線が表示される。

| プロパティ | 値 |
|---|---|
| strokeDasharray | `"4,3"` |
| stroke | `color` prop |
| strokeWidth | 1 |

## ツールチップ

棒の上にフロートするラベル。

| プロパティ | 値 |
|---|---|
| backgroundColor | `#fff` |
| borderRadius | 8px |
| shadowOpacity | 0.12 |
| shadowRadius | 6 |
| ラベル fontSize | 14, fontWeight 600, color `#334155` |
| 値 fontSize | 14, fontWeight 700, color `#0f172a` |

## アニメーション (Framer Motion 対応)

```ts
// 棒が下から上に成長
initial={{ height: 0, y: chartBottom }}
animate={{ height: barHeight, y: chartBottom - barHeight }}
transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
```

棒ごとにインデックスベースの遅延を入れるとリッチなアニメーションになる:
```ts
transition={{ delay: index * 0.05 }}
```
