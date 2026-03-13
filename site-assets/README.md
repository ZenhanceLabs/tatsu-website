# Zenhance プロモーションサイト用 UI コンポーネント資料

このフォルダには、Zenhance アプリの主要 UI コンポーネントをサイト制作担当向けにまとめた資料が含まれています。

## フォルダ構成

```
site-assets/
├── README.md                    ← このファイル
├── design-tokens.ts             ← カラー・タイポグラフィ・スペーシング・角丸の全トークン
├── components/
│   ├── bar-chart.md             ← 棒グラフの仕様書
│   ├── line-chart.md            ← 折れ線グラフの仕様書
│   ├── donut-chart.md           ← ドーナツチャート (カテゴリ比率) の仕様書
│   ├── task-card.md             ← タスクカード (達成・失敗・提案) の仕様書
│   ├── trend-card.md            ← トレンドカード (使用時間推移) の仕様書
│   ├── zenscore-card.md         ← ZenScore 表示カードの仕様書
│   ├── app-ranking-card.md      ← アプリ使用ランキングカードの仕様書
│   └── card-container.md        ← 共通カードコンテナの仕様書
└── category-colors.ts           ← 21 カテゴリの色定義
```

## 技術スタック（サイト向け推奨）

| アプリ側         | サイト側の代替                     |
|------------------|------------------------------------|
| React Native     | React + Framer Motion              |
| react-native-svg | SVG (HTML 標準)                    |
| Reanimated v4    | Framer Motion `motion.*`           |
| NativeWind       | Tailwind CSS                       |
| lucide-react-native | **lucide-react** (同一アイコン) |

## デザイン原則

1. **フラットデザイン** — カードにシャドウは **なし**（`box-shadow: none`）。1px のボーダーのみ。
2. **角丸 24px** — カード系コンポーネントはすべて `border-radius: 24px`。
3. **セクションヘッダー** — アクセントカラーの 4px × 32px バー + 大文字テキスト（`letter-spacing: 2px`）。
4. **数値ヒーロー** — ZenScore 等の大きな数値は `48–56px`、`font-weight: 700–800`。
5. **アニメーション** — バーは下→上 (700ms)、ラインは左→右 (800ms)、どちらも `ease(0.25, 0.1, 0.25, 1)`。

## ソースファイル参照

コンポーネントの実装詳細が必要な場合、以下のファイルを参照してください：

| コンポーネント | ソース |
|---|---|
| 棒グラフ | `src/features/analysis/bar-chart.tsx` |
| 折れ線グラフ | `src/features/analysis/line-chart.tsx` |
| ドーナツチャート | `src/features/analysis/components/breakdown-lists.tsx` |
| タスクカード | `src/features/tasks/components/task-card.tsx` |
| トレンドカード | `src/features/analysis/components/trend-card.tsx` |
| ZenScore カード | `src/features/analysis/components/zenscore-cards.tsx` |
| アプリランキング | `src/features/analysis/components/app-ranking-card.tsx` |
| カード共通 | `src/features/analysis/components/card.tsx` |
| テーマ定義 | `src/theme/colors.ts` |
| カテゴリ色 | `src/features/usage/category-utils.ts` |
