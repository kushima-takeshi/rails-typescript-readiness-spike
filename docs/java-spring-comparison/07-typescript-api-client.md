# TypeScript からの API 連携

## Spring Boot での一般的なやり方

```java
// サーバーが HTML + 素の JS / jQuery
$.ajax({
  url: '/api/skill-gaps',
  method: 'GET',
  success: function(data) { ... }
});

// または Thymeleaf にサーバー側でデータを埋め込む
// <span th:text="${skillGap.title}"></span>
```

- MPA では HTML をサーバーが返し、必要な部分だけ Ajax で更新
- API 連携は `fetch` / axios / jQuery.ajax など
- 型は DTO クラス（Java 側）と、フロントは別管理になりがち

## このリポジトリでのやり方（Vite + React + TS）

```
frontend/（:5173）          backend/（:3000）
  React 画面                  Rails API
  fetch('/api/v1/...')  →   JSON レスポンス
       ↑
  Vite proxy（開発時）
```

### 型定義（`src/types/skillGap.ts`）

Rails が返す JSON の形を `type` で宣言する。

```ts
export type SkillGap = {
  id: number
  title: string
  status: SkillGapStatus
  ...
}
```

### API クライアント（`src/api/skillGaps.ts`）

```ts
export function fetchSkillGaps(): Promise<SkillGap[]> {
  return request<SkillGap[]>('/api/v1/skill_gaps')
}

export function createSkillGap(input: SkillGapCreateInput): Promise<SkillGap> {
  return request<SkillGap>('/api/v1/skill_gaps', {
    method: 'POST',
    body: JSON.stringify({ skill_gap: input }),
  })
}
```

### 画面（`App.tsx`）

```tsx
useEffect(() => {
  fetchSkillGaps().then((data) => setSkillGaps(data))
}, [])

createSkillGap({ title, category })
  .then(() => reloadList())
  .catch((err) => {
    if (err.status === 422) setFormErrors(err.body.errors)
  })
```

## 主な違い

| 観点 | Spring + HTML/JS（MPA） | この spike（SPA + API） |
|---|---|---|
| 画面 | サーバーが HTML を返す | React が JSX で組み立て |
| データ取得 | Ajax またはサーバー埋め込み | `fetch` で常に JSON |
| 型 | DTO（Java） | `type`（TypeScript） |
| 開発時の接続 | 同一オリジンが多い | Vite proxy で CORS 回避 |
| バリデーションエラー | サーバー HTML または JSON | 422 JSON を画面に表示 |

## このリポジトリでの確認結果

- Vite proxy: `/api` → `http://localhost:3000`（`vite.config.ts`）
- 一覧: `fetchSkillGaps()` → 画面にリスト表示
- 詳細: `fetchSkillGap(id)` → `learning_tasks` 同梱で表示
- 作成: `createSkillGap()` → 201 で一覧に反映
- 422: `{ errors: { title: [...], category: [...] } }` をフォーム下に表示
- enum は API 文字列（`in_progress`）のまま表示（日本語マップは未着手）

## 参考リンク

- [MDN: fetch](https://developer.mozilla.org/ja/docs/Web/API/Window/fetch)
- [Vite Server Options - proxy](https://vite.dev/config/server-options.html#server-proxy)
