# Spike 01: SkillGap CRUD 縦切り

Phase 1〜3 を通じて、SkillGap の CRUD と LearningTask の関連表示を **1 本の縦切り** として実装・検証します。

## この spike で確認すること

### Rails（backend）

- [x] `rails new --api` でのプロジェクト構成
- [x] migration の書き方と `db:migrate` の流れ
- [x] SkillGap / LearningTask モデルの定義
- [x] validation（`validates`）の書き方とエラーレスポンス
- [x] association（`has_many` / `belongs_to`）の定義と使い方
- [x] enum（`enum status:`）の定義と DB 格納
- [x] `routes.rb` での RESTful ルーティング
- [x] Controller のアクション（index, show, create, update）の処理の流れ
- [x] JSON レスポンスの返し方

### TypeScript（frontend）

- [x] Vite + React + TypeScript のプロジェクト構成
- [x] API クライアントの実装（`fetch`）
- [x] API レスポンスの型定義
- [x] SkillGap 一覧画面の実装
- [x] SkillGap 詳細画面（LearningTask 一覧含む）の実装
- [x] SkillGap 作成フォームの実装
- [x] バリデーションエラーの画面表示
- [ ] enum 値の日本語表示マッピング

### Spring Boot との差分

- [x] Controller と Service の責務の違い
- [x] Active Record と JPA + Repository の違い
- [x] migration と Flyway の違い
- [x] バリデーションの置き場所の違い
- [x] フロントエンドとの API 連携パターンの違い

---

## 実装後に記録すること

### やったこと

**Phase 1（Model）**

- `backend/` に `rails new . --api -d postgresql` で API モードの Rails 8.1 プロジェクトを作成
- `SkillGap` / `LearningTask` の migration・model を定義（validation, association, enum）
- Docker Compose の Postgres（port 5433）に `rails db:migrate` で適用

**Phase 2（API）**

- `config/routes.rb` に `namespace :api/v1` 配下の RESTful ルートを定義
- `Api::V1::SkillGapsController` — index / show / create / update
- `Api::V1::LearningTasksController` — index / create（SkillGap にネスト）
- `ApplicationController` に 404（`rescue_from RecordNotFound`）と 422（`render_validation_errors`）を共通化
- Controller 内の private メソッドで JSON を組み立て（serializer は未使用）

**Phase 3（Frontend）**

- `frontend/` に Vite + React + TypeScript（ESLint）を scaffold
- `vite.config.ts` で `/api` → Rails `:3000` に proxy
- `src/types/skillGap.ts` — API レスポンスの型
- `src/api/skillGaps.ts` — `fetchSkillGaps` / `fetchSkillGap` / `createSkillGap`
- `App.tsx` — 一覧 / 詳細 / 作成フォーム（React Router 未使用、state で画面切替）

**エンドポイント一覧**

| HTTP | URL | 用途 |
|---|---|---|
| GET | `/api/v1/skill_gaps` | 一覧 |
| GET | `/api/v1/skill_gaps/:id` | 詳細（learning_tasks 同梱） |
| POST | `/api/v1/skill_gaps` | 作成 |
| PATCH | `/api/v1/skill_gaps/:id` | 更新 |
| GET | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | 子タスク一覧 |
| POST | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | 子タスク作成 |

**手動検証**

- API（curl）: index 200 / create 201 / 422 / show / update / 404
- フロント（ブラウザ）: 一覧表示 / 詳細 + LearningTask / 作成成功 / 422 でフィールド下にエラー

### 詰まった点

- **rbenv の PATH**: `source ~/.zshrc` で shims 有効化が必要だった
- **Strong Parameters のラップ**: `{"skill_gap": {...}}` 形式が必要
- **N+1**: index で `SkillGap.includes(:learning_tasks)` を使用
- **フロントの複雑さ**: useState / useEffect / 非同期 fetch が一気に増えた（MPA との差）
- **422 エラー表示**: ターミナルではなくブラウザ画面（フォーム下）に表示される

### Spring Boot との違いで印象に残ったこと

- ルーティングが `routes.rb` 1 ファイルに集約（`@GetMapping` 分散と対照的）
- Service 層なしで Controller → Model 直結
- **フロント**: MPA（サーバー HTML）から SPA（React + fetch + JSON）への分担の違いが大きい
- Vite（:5173）と Rails（:3000）の **2 サーバー構成** が開発時の普通
- バリデーションエラーは Rails が JSON で返し、React が `formErrors` state で画面表示

### 次に深掘りしたいこと

- request spec（RSpec）での API テスト
- React Router で URL と画面を対応
- enum の日本語表示マップ
- コンポーネント分割（`pages/` / `components/`）
- LearningTask 作成 UI

---

## 関連ドキュメント

- [domain.md](../domain.md) — モデル定義
- [architecture.md](../architecture.md) — 責務分離
- [tech-gap-matrix.md](../tech-gap-matrix.md) — 横断対応表
- [implementation-phases.md](../implementation-phases.md) — フェーズ計画
- [01-routing-and-controllers.md](../java-spring-comparison/01-routing-and-controllers.md) — ルーティング比較
- [07-typescript-api-client.md](../java-spring-comparison/07-typescript-api-client.md) — API 連携比較

## ステータス

| 項目 | 状態 |
|---|---|
| Phase 1（Model） | 完了 |
| Phase 2（API） | 完了（request spec は未着手） |
| Phase 3（Frontend） | 完了（enum 日本語化・Router は未着手） |
| 学習ログ記入 | Phase 1〜3 記入済み |
