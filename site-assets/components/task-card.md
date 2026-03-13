# タスクカード (Task Card)

**ソース:** `src/features/tasks/components/task-card.tsx`

## 概要

使用制限ルール（タスク）を表示するカード。
達成・失敗・提案（AI推薦）の3状態を視覚的に区別する。

## 画面イメージ

### アクティブ (AI 推薦付き)

```
┌──────────────────────────────────┐
│ ■ ┌──────┐                      │
│ ■ │ 📱   │  YouTube             │
│ ■ │ icon │  1日60分まで    [○]  │
│ ■ └──────┘  目標: 60分          │
│ ■                         ✨AI  │
└──────────────────────────────────┘
  ↑ 4px accent stripe (左端)
```

### 完了 (達成)

```
┌──────────────────────────────────┐
│   ┌──────┐                      │
│   │ 📱   │  ~~YouTube~~         │
│   │ icon │  ~~1日60分まで~~ [✓] │
│   └──────┘  ✓ 達成              │
└──────────────────────────────────┘
  テキスト: strikethrough + opacity: 0.5
```

### 保留 (未確定)

```
┏╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┓
┊   ┌──────┐                      ┊
┊   │ 📱   │  YouTube             ┊
┊   │ icon │  1日60分まで    [○]  ┊
┊   └──────┘                      ┊
┗╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┛
  ボーダー: dashed + pulse アニメーション
```

## カード共通スタイル

| プロパティ | 値 |
|---|---|
| borderRadius | 24 |
| padding | 16 |
| gap (内部) | 14 |
| minHeight | 88 |
| backgroundColor | `colors.cardBackground` |
| borderWidth | 1 |
| borderColor (light) | `rgba(0,0,0,0.08)` |
| borderColor (dark) | `rgba(255,255,255,0.10)` |

## 状態別スタイル

### AI 推薦 (アクティブ)

| プロパティ | 値 |
|---|---|
| 左アクセントストライプ | width: 4px, height: 100%, borderRadius: 2 |
| ストライプ色 | `colors.accent` |
| AIバッジ背景 | `colors.accent + 15% opacity` |
| AIバッジテキスト | fontSize: 11, fontWeight: 700 |

### 完了

| プロパティ | 値 |
|---|---|
| テキスト装飾 | `line-through` |
| 全体 opacity | 0.5 |
| チェックマーク色 | `#10b981` (green) |

### 保留 (Pending)

| プロパティ | 値 |
|---|---|
| borderStyle | `dashed` |
| borderColor | `colors.accent + 40% opacity` |
| アニメーション | pulse (opacity 0.6 ↔ 1.0, 2s infinite) |

## 内部コンポーネント

### アプリアイコン

| プロパティ | 値 |
|---|---|
| サイズ | 52 × 52 |
| borderRadius | 18 |
| 背景 (フォールバック) | カテゴリカラーの 15% opacity |

### チェックボックス

| プロパティ | 値 |
|---|---|
| サイズ | 28 × 28 |
| borderRadius | 14 (円形) |
| borderWidth | 2 |
| 未チェック borderColor | `colors.border` |
| チェック済み背景 | `colors.accent` |
| チェックアイコン | `Check` (lucide), size: 16, color: white |

### スワイプアクション (右)

| プロパティ | 値 |
|---|---|
| 機能 | 停止ボタン (赤) |
| 背景色 | `#ef4444` |
| アイコン | `Square` (lucide), size: 20, white |
| 幅 | 80px |

## タスクデータ型

```ts
type Task = {
  id: string;
  appPackage: string;
  appName: string;
  type: 'total-cap' | 'heavy-cut' | 'launch-limit' | 'launch-delay' | 'session-limit';
  params: Record<string, number>;
  unit: '分' | '回' | '時間' | '日';
  isAiSuggested?: boolean;
  isCompleted?: boolean;
  isPending?: boolean;
};
```

## アニメーション (Framer Motion 対応)

```ts
// カード出現
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
/>

// チェック時
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 0.2 }}
/>

// 保留パルス
<motion.div
  animate={{ opacity: [0.6, 1, 0.6] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```
