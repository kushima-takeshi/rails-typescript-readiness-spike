# rails-typescript-readiness-spike

Java / Spring Boot 経験者が、Rails / TypeScript 中心の自社プロダクト開発環境へのキャッチアップを目的とした**技術検証リポジトリ**です。

## このリポジトリについて

- **本番利用目的のアプリではありません。** Rails / TypeScript 環境へのキャッチアップを目的とした技術検証です。
- **このアプリ自体が Rails でなければならないわけではありません。** 検証のために意図的に Rails / TypeScript 構成を選んでいます。
- **Java / Spring Boot 経験から、Rails / TypeScript 環境へ入る際の差分を確認する**ために作っています。
- 現時点では **Phase 3 まで完了**（Rails API + React フロントの縦切り）。Phase 4 でドキュメントを仕上げます。

## 目的

以下を小さな縦切り実装で確認し、Java / Spring Boot との責務分離の違いを言語化すること。

- Rails routing
- Controller の処理の流れ
- Active Record model
- migration
- validation
- association
- enum / status 管理
- TypeScript での API 連携

## 最小ドメイン

### SkillGap（技術ギャップ）

| カラム | 型 | 備考 |
|---|---|---|
| title | string | 必須 |
| category | string | 必須 |
| current_level | integer | |
| target_level | integer | |
| reason | text | |
| status | enum | 例: `not_started`, `in_progress`, `done` |

### LearningTask（学習タスク）

| カラム | 型 | 備考 |
|---|---|---|
| skill_gap_id | references | 必須 |
| title | string | 必須 |
| status | enum | 例: `todo`, `doing`, `done` |
| due_date | date | |
| memo | text | |

### 関連

- `SkillGap` has_many `LearningTasks`
- `LearningTask` belongs_to `SkillGap`

詳細は [docs/domain.md](docs/domain.md) を参照。

## ディレクトリ構成

```
rails-typescript-readiness-spike/
├── backend/              # Rails 8.1 API（models, controllers, routes）
├── frontend/             # Vite + React + TypeScript（一覧・詳細・作成画面）
├── docs/                 # 構成方針・差分メモ・学習ログ
├── docker-compose.yaml   # PostgreSQL 16（ホスト port 5433）
└── README.md
```

## 構成方針

- **backend/** … Rails API モード（ドメイン・永続化・バリデーション・JSON API）
- **frontend/** … Vite + React + TypeScript（UI・API 連携）
- **docs/** … アーキテクチャ方針と Java / Spring Boot との差分メモ

詳細は [docs/architecture.md](docs/architecture.md) を参照。

## 実装フェーズ

| Phase | 内容 | 状態 |
|---|---|---|
| 0 | リポジトリ土台・ドキュメント構成 | 完了 |
| 1 | Rails: model / migration / validation / association / enum | 完了 |
| 2 | Rails: routing / controller / JSON API | 完了 |
| 3 | TypeScript: 一覧・詳細・作成フォーム | 完了 |
| 4 | tech-gap-matrix への Spring Boot 比較追記 | 未着手 |

詳細は [docs/implementation-phases.md](docs/implementation-phases.md) を参照。

## 前提環境

| 項目 | バージョン / 設定 |
|---|---|
| Ruby | 3.3.6（rbenv 推奨） |
| Rails | 8.1.x |
| PostgreSQL | 16（Docker、ホスト port **5433**） |
| Node.js | 18+ 推奨（v26 確認済み） |

> ホストの 5432 が他プロジェクトで使用中の場合があるため、compose は **5433** を使用しています。

## 起動方法

### 1. PostgreSQL を起動

```bash
cd ~/rails-typescript-readiness-spike
docker compose up -d
docker compose ps   # readiness-spike-postgres が healthy であること
```

### 2. Rails API を起動

```bash
source ~/.zshrc    # rbenv を有効化
cd backend
bundle install     # 初回のみ
bin/rails db:prepare
bin/rails server
```

`http://localhost:3000` で待ち受けます。

### 3. フロントエンドを起動

```bash
cd ~/rails-typescript-readiness-spike/frontend
npm install     # 初回のみ
npm run dev
```

ブラウザで http://localhost:5173/ を開く（SkillGap 一覧・詳細・作成フォーム）。

### 4. 動作確認（curl / 任意）

```bash
# 一覧
curl http://localhost:3000/api/v1/skill_gaps

# proxy 経由（Vite 起動中）
curl http://localhost:5173/api/v1/skill_gaps
```

## API エンドポイント

| HTTP | URL | 用途 |
|---|---|---|
| GET | `/api/v1/skill_gaps` | SkillGap 一覧 |
| GET | `/api/v1/skill_gaps/:id` | SkillGap 詳細（learning_tasks 同梱） |
| POST | `/api/v1/skill_gaps` | SkillGap 作成 |
| PATCH | `/api/v1/skill_gaps/:id` | SkillGap 更新 |
| GET | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | LearningTask 一覧 |
| POST | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | LearningTask 作成 |

## 関連ドキュメント

- [docs/README.md](docs/README.md) — ドキュメント索引
- [docs/architecture.md](docs/architecture.md) — 構成と責務分離
- [docs/domain.md](docs/domain.md) — ドメインモデル定義
- [docs/tech-gap-matrix.md](docs/tech-gap-matrix.md) — Rails / TS / Spring Boot 対応表
- [docs/implementation-phases.md](docs/implementation-phases.md) — 実装計画
- [docs/java-spring-comparison/](docs/java-spring-comparison/) — トピック別比較メモ
- [docs/spikes/](docs/spikes/) — 縦切り実装ごとの学習ログ
