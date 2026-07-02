# rails-typescript-readiness-spike

Java / Spring Boot 経験者が、Rails / TypeScript 中心の自社プロダクト開発環境へのキャッチアップを目的とした**技術検証リポジトリ**です。

## このリポジトリについて

- **本番利用目的のアプリではありません。** Rails / TypeScript 環境へのキャッチアップを目的とした技術検証です。
- **このアプリ自体が Rails でなければならないわけではありません。** 検証のために意図的に Rails / TypeScript 構成を選んでいます。
- **Java / Spring Boot 経験から、Rails / TypeScript 環境へ入る際の差分を確認する**ために作っています。
- 実装は **Phase 1 以降で段階的に進めます。** 現時点（Phase 0）ではドキュメントとディレクトリ構成のみです。

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
├── backend/          # Rails API（Phase 1 以降で作成）
├── frontend/         # Vite + React + TypeScript（Phase 3 以降で作成）
├── docs/             # 構成方針・差分メモ・学習ログ
└── README.md
```

## 構成方針

- **backend/** … Rails API モード（ドメイン・永続化・バリデーション）
- **frontend/** … Vite + React + TypeScript（UI・API 連携）
- **docs/** … アーキテクチャ方針と Java / Spring Boot との差分メモ

詳細は [docs/architecture.md](docs/architecture.md) を参照。

## 実装フェーズ

| Phase | 内容 | 状態 |
|---|---|---|
| 0 | リポジトリ土台・ドキュメント構成 | 進行中 |
| 1 | Rails: model / migration / validation / association / enum | 未着手 |
| 2 | Rails: routing / controller / JSON API | 未着手 |
| 3 | TypeScript: 一覧・詳細・作成フォーム | 未着手 |
| 4 | tech-gap-matrix への Spring Boot 比較追記 | 未着手 |

詳細は [docs/implementation-phases.md](docs/implementation-phases.md) を参照。

## 起動方法

Phase 1 以降の実装完了後に追記します。

## 関連ドキュメント

- [docs/README.md](docs/README.md) — ドキュメント索引
- [docs/architecture.md](docs/architecture.md) — 構成と責務分離
- [docs/domain.md](docs/domain.md) — ドメインモデル定義
- [docs/tech-gap-matrix.md](docs/tech-gap-matrix.md) — Rails / TS / Spring Boot 対応表
- [docs/implementation-phases.md](docs/implementation-phases.md) — 実装計画
- [docs/java-spring-comparison/](docs/java-spring-comparison/) — トピック別比較メモ
- [docs/spikes/](docs/spikes/) — 縦切り実装ごとの学習ログ
