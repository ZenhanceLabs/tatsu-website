# ZenScore カード (ZenScore Card)

**ソース:** `src/features/analysis/components/zen-score-card.tsx`

## 概要

ユーザーのデジタルウェルネススコアを表示するカード。
ホーム画面（サマリー）と分析画面（シングル）で2つのバリアントがある。

---

## バリアント1: サマリーカード (ホーム画面)

### 画面イメージ

```
┌──────────────────────────────────┐
│  🧘 ZenScore                    │
│                                  │
│           72            ▲ +5    │← ヒーロースコア + デルタタグ
│        ╱─────╲                   │
│  ████████░░░░░░░  72/100        │← プログレスバー
│                                  │
│  昨日より5ポイント改善 👏        │← メッセージ
└──────────────────────────────────┘
```

### スコア表示

| プロパティ | 値 |
|---|---|
| スコア fontSize | 56 |
| スコア fontWeight | 900 |
| スコア色 | スコアに応じた色 (下記参照) |

### スコア色マッピング

| スコア範囲 | 色 |
|---|---|
| 80-100 | `#10b981` (green) |
| 60-79 | `#f59e0b` (amber) |
| 40-59 | `#f97316` (orange) |
| 0-39 | `#ef4444` (red) |

### デルタタグ

| プロパティ | 値 |
|---|---|
| 背景 | スコア色の 15% opacity |
| テキスト色 | スコア色 |
| fontSize | 13 |
| fontWeight | 700 |
| borderRadius | 12 |
| paddingHorizontal | 10 |
| paddingVertical | 4 |
| アイコン | `TrendingUp` / `TrendingDown` (lucide), size: 12 |

### プログレスバー

| プロパティ | 値 |
|---|---|
| 高さ | 8 |
| borderRadius | 4 |
| 背景 (トラック) | `colors.border` |
| 塗り | スコア色 |
| 幅 | `score%` |

---

## バリアント2: シングルカード (分析画面)

### 画面イメージ

```
┌──────────────────────────────────┐
│  ZenScore  │  使用時間  │  削減  │← 3カラムヘッダー
│  ──────────┼───────────┼──────  │
│            │           │        │
│    72      │  3h 42m   │  -18%  │← メイン値
│            │           │        │
│  ▲ +5     │  +12m     │        │← サブ値
└──────────────────────────────────┘
```

### 3カラムレイアウト

| プロパティ | 値 |
|---|---|
| カラム分割 | 均等3分割 (`flex: 1`) |
| 区切り線 | `width: 1`, `backgroundColor: colors.border` |
| 区切り線高さ | 80% |

### ヘッダーバー (各カラム上部)

| プロパティ | 値 |
|---|---|
| 高さ | 3 |
| 幅 | 32 |
| borderRadius | 1.5 |
| 色 | 各カラムのアクセント色 |
| marginBottom | 12 |

### カラム別スタイル

#### ZenScore (左)

| プロパティ | 値 |
|---|---|
| ヘッダーバー色 | スコア色 |
| メイン値 fontSize | 48 |
| メイン値 fontWeight | 800 |
| メイン値 色 | スコア色 |
| サブ値 | デルタ (例: `▲ +5`) |

#### 使用時間 (中央)

| プロパティ | 値 |
|---|---|
| ヘッダーバー色 | `colors.accent` |
| 時間 fontSize | 42 |
| 時間 fontWeight | 800 |
| 分 fontSize | 28 |
| 分 fontWeight | 600 |
| 色 | `colors.text` |

#### 削減 (右)

| プロパティ | 値 |
|---|---|
| ヘッダーバー色 | `#10b981` |
| メイン値 fontSize | 36 |
| メイン値 fontWeight | 800 |
| メイン値 色 | `#10b981` |
| サブテキスト | `前日比` |

---

## カード共通

| プロパティ | 値 |
|---|---|
| borderRadius | 24 |
| padding | 20 |
| borderWidth | 1 |
| borderColor (light) | `rgba(0,0,0,0.08)` |
| borderColor (dark) | `rgba(255,255,255,0.10)` |
| backgroundColor | `colors.cardBackground` |

## アニメーション (Framer Motion 対応)

```ts
// スコア数値カウントアップ
const [displayScore, setDisplayScore] = useState(0);
useEffect(() => {
  // 0 → target まで段階的にカウントアップ
  const duration = 800; // ms
  // requestAnimationFrame でスムーズに
}, [score]);

// または motion の animate
<motion.span
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
>
  {score}
</motion.span>

// プログレスバー
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${score}%` }}
  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
/>

// 3カラム順次出現
{columns.map((col, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1, duration: 0.4 }}
  />
))}
```
