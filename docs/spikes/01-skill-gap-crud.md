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

- [ ] Vite + React + TypeScript のプロジェクト構成
- [ ] API クライアントの実装（`fetch` / axios）
- [ ] API レスポンスの型定義
- [ ] SkillGap 一覧画面の実装
- [ ] SkillGap 詳細画面（LearningTask 一覧含む）の実装
- [ ] SkillGap 作成フォームの実装
- [ ] バリデーションエラーの画面表示
- [ ] enum 値の日本語表示マッピング

### Spring Boot との差分

- [x] Controller と Service の責務の違い
- [x] Active Record と JPA + Repository の違い
- [x] migration と Flyway の違い
- [x] バリデーションの置き場所の違い
- [ ] フロントエンドとの API 連携パターンの違い

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

**エンドポイント一覧**

| HTTP | URL | 用途 |
|---|---|---|
| GET | `/api/v1/skill_gaps` | 一覧 |
| GET | `/api/v1/skill_gaps/:id` | 詳細（learning_tasks 同梱） |
| POST | `/api/v1/skill_gaps` | 作成 |
| PATCH | `/api/v1/skill_gaps/:id` | 更新 |
| GET | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | 子タスク一覧 |
| POST | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | 子タスク作成 |

**手動検証（curl）**

- index 200 / create 201 / バリデーション失敗 422
- show 200 / update 200 / learning_tasks index・create 200・201
- 存在しない ID への show → 404 `{"error":"Not Found"}`

### 詰まった点

- **rbenv の PATH**: `rbenv install` 後も `ruby -v` が 2.6.10 のまま。`source ~/.zshrc` で shims が有効化され解消
- **Strong Parameters のラップ**: リクエスト JSON は `{"skill_gap": {...}}` のように単数形キーで包む必要がある
- **N+1**: index で `learning_tasks_count` を出すため `SkillGap.includes(:learning_tasks)` を使用

### Spring Boot との違いで印象に残ったこと

- ルーティングが `routes.rb` 1 ファイルに集約され、Controller 名・アクション名が規約で決まる（`@GetMapping` を各クラスに書く形と対照的）
- Service 層なしで Controller → Model 直結。ビジネスルールは Model の `validates` / `enum` / association に寄せる
- 例外処理が `rescue_from` で ApplicationController に集約でき、`@ControllerAdvice` に近い
- JSON は DTO ではなく Controller 内で Hash を組み立てるパターンが手軽（本番では serializer に切り出すことも多い）

### 次に深掘りしたいこと

- request spec（RSpec）での API テスト
- serializer（blueprinter 等）への切り出し
- `includes` / `preload` / `eager_load` の使い分け
- Phase 3: TypeScript からの API 連携と CORS / Vite proxy

---

## 関連ドキュメント

- [domain.md](../domain.md) — モデル定義
- [architecture.md](../architecture.md) — 責務分離
- [tech-gap-matrix.md](../tech-gap-matrix.md) — 横断対応表
- [implementation-phases.md](../implementation-phases.md) — フェーズ計画
- [01-routing-and-controllers.md](../java-spring-comparison/01-routing-and-controllers.md) — ルーティング比較

## ステータス

| 項目 | 状態 |
|---|---|
| Phase 1（Model） | 完了 |
| Phase 2（API） | 完了（request spec は未着手） |
| Phase 3（Frontend） | 未着手 |
| 学習ログ記入 | Phase 1〜2 記入済み |
