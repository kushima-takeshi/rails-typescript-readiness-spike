# 実装フェーズ

段階的に縦切り実装を進め、各フェーズで学習内容を `docs/spikes/` と `docs/tech-gap-matrix.md` に記録します。

## Phase 0: リポジトリ土台・ドキュメント構成

**目的:** 方針を固め、実装前に全体像を共有できる状態にする。

| タスク | 状態 |
|---|---|
| ディレクトリ構成の作成（backend/, frontend/, docs/） | 完了 |
| README.md の作成 | 完了 |
| docs/ 配下の初稿作成 | 完了 |
| backend/ / frontend/ のプレースホルダー配置 | 完了 |

**成果物:** 本ドキュメント群、空の backend/ / frontend/

**次フェーズへの入力:** architecture.md / domain.md を前提に Rails プロジェクトを作成

---

## Phase 1: Rails モデル層

**目的:** Active Record の基本（model, migration, validation, association, enum）を確認する。

| タスク | 確認ポイント |
|---|---|
| `rails new backend --api` でプロジェクト作成 | API モードの生成物の違い |
| SkillGap / LearningTask の migration 作成 | Spring Boot の Flyway / Liquibase との違い |
| Model 定義（validation, association, enum） | JPA Entity + Bean Validation との違い |
| `rails db:migrate` / `db:seed` | schema.rb の自動生成 |
| Model spec（RSpec） | バリデーション・関連のテストの書き方 |

**成果物:**

- `backend/app/models/skill_gap.rb`
- `backend/app/models/learning_task.rb`
- `backend/db/migrate/` 配下の migration ファイル
- `backend/spec/models/` 配下のテスト

**記録先:** `docs/spikes/01-skill-gap-crud.md`, `docs/tech-gap-matrix.md`

---

## Phase 2: Rails API 層

**目的:** routing → controller → JSON レスポンスの流れを確認する。

| タスク | 確認ポイント |
|---|---|
| `config/routes.rb` で RESTful ルーティング定義 | `@RequestMapping` / `@GetMapping` との違い |
| `Api::V1::SkillGapsController` 実装 | Controller の薄さ / Service 層の有無 |
| JSON シリアライズ（serializer or `render json:`） | DTO / Response クラスとの違い |
| エラーハンドリング（422, 404） | `@ControllerAdvice` / `ExceptionHandler` との違い |
| Request spec | API テストの書き方 |

**成果物:**

- `backend/config/routes.rb`
- `backend/app/controllers/api/v1/` 配下の controller
- `backend/spec/requests/` 配下のテスト

**記録先:** `docs/spikes/01-skill-gap-crud.md`, `docs/tech-gap-matrix.md`, `docs/java-spring-comparison/01-routing-and-controllers.md`

---

## Phase 3: TypeScript フロントエンド

**目的:** Vite + React + TypeScript から Rails API を呼び出す流れを確認する。

| タスク | 確認ポイント |
|---|---|
| `npm create vite@latest frontend` でプロジェクト作成 | フロントの初期構成 |
| API クライアント実装（`src/api/`） | fetch / axios の使い方 |
| 型定義（`src/types/`） | API レスポンスの TypeScript 型 |
| SkillGap 一覧・詳細・作成画面 | コンポーネント構成 |
| LearningTask 一覧（SkillGap 詳細内） | ネストしたリソースの UI |
| Vite proxy 設定 | 開発時の API 転送 |
| enum 値の表示マッピング | backend enum → フロント表示 |

**成果物:**

- `frontend/src/api/`, `frontend/src/types/`, `frontend/src/pages/`, `frontend/src/components/`
- SkillGap CRUD + LearningTask 一覧の画面

**記録先:** `docs/spikes/01-skill-gap-crud.md`, `docs/tech-gap-matrix.md`, `docs/java-spring-comparison/07-typescript-api-client.md`

---

## Phase 4: 差分の言語化・ドキュメント完成

**目的:** 実装を通じて得た知見を体系的にまとめる。

| タスク | 内容 |
|---|---|
| `tech-gap-matrix.md` の全項目を埋める | 横断対応表の完成 |
| `java-spring-comparison/` にトピック別メモを追加 | 深掘り比較 |
| README の起動手順を追記 | 再現可能な状態にする |
| 振り返り: 責務分離の違いを文章化 | architecture.md に追記 |

**成果物:** 完成したドキュメント群、動作する縦切りアプリ

---

## フェーズ間の依存関係

```
Phase 0（土台）
  └─> Phase 1（Model）
        └─> Phase 2（API）
              └─> Phase 3（Frontend）
                    └─> Phase 4（ドキュメント完成）
```

各フェーズは独立した PR / コミット単位にすると、学習ログが追いやすくなります。
