# アーキテクチャ方針

## 概要

本リポジトリは **Rails API モード（backend）** と **Vite + React + TypeScript（frontend）** を分離したモノレポ構成を採用します。

目的は本番プロダクトの完成ではなく、**責務分離の違いを Java / Spring Boot 経験と対比しながら学ぶこと**です。

## ディレクトリ構成（実装済み）

```
rails-typescript-readiness-spike/
├── backend/                    # Rails 8.1 API
│   ├── app/
│   │   ├── controllers/api/v1/
│   │   └── models/
│   ├── config/routes.rb
│   └── db/migrate/
├── frontend/                   # Vite + React + TypeScript
│   ├── src/
│   │   ├── api/                # fetch クライアント
│   │   ├── types/              # レスポンス型定義
│   │   └── App.tsx             # 一覧・詳細・作成（Phase 3）
│   └── vite.config.ts          # proxy 設定
├── docs/
└── docker-compose.yaml         # Postgres 5433
```

## 責務分離

### backend（Rails API）

| 責務 | 具体例 |
|---|---|
| ルーティング | `config/routes.rb` で RESTful API を定義 |
| リクエスト処理 | `Api::V1::SkillGapsController` など |
| ドメインロジック | Active Record モデル（validation, association, enum） |
| 永続化 | migration, `db/schema.rb` |
| データ整形 | Controller 内で JSON Hash を組み立て |

**やらないこと:** HTML レンダリング、画面状態管理、CSS

### frontend（Vite + React + TypeScript）

| 責務 | 具体例 |
|---|---|
| UI 表示 | 一覧・詳細・フォーム画面 |
| 画面状態 | `useState`（loading, error, formErrors） |
| API 連携 | `fetch` で backend を呼び出し |
| 型定義 | `src/types/skillGap.ts` |

**やらないこと:** DB アクセス、バリデーションの最終判定（本体は backend）

## Spring Boot との責務分離の違い

| 観点 | Spring Boot（一般的） | 本リポジトリ |
|---|---|---|
| API 層 | Controller + Service + Repository | Controller + Active Record |
| 永続化 | JPA Entity + Repository | Active Record |
| フロント | HTML/Thymeleaf + Ajax、または別 SPA | `frontend/` の React SPA |
| 画面の組み立て | サーバー（MPA） | ブラウザ（SPA） |
| DI | Spring コンテナ | Rails の規約・自動読み込み |

## 実装を通じて得た知見（Phase 4 振り返り）

### 1. バックエンドは「薄い Controller + 厚い Model」になりやすい

Spring では Service にビジネスロジックを置くことが多いが、Rails では `validates` / `enum` / `association` を Model に寄せ、Controller は HTTP ↔ JSON の変換に近い役割になった。

### 2. フロントは「状態 + 非同期」が中心

MPA（サーバーが HTML を返す）から SPA に移ると、学ぶことが UI 記法（JSX）だけではない。

- `useState` … 画面が覚えるデータ
- `useEffect` … いつ API を呼ぶか
- `fetch` … 非同期で JSON を取る

Ajax を使っていた現場経験は活きるが、**画面全体の組み立てをフロントが担う**点が大きく違う。

### 3. 開発時は 2 サーバーが普通

| プロセス | ポート | 役割 |
|---|---|---|
| Rails | 3000 | JSON API |
| Vite | 5173 | React 開発 + proxy |

本番では構成が変わるが、開発時の「フロント用サーバー + API サーバー」は SPA 構成の典型。

### 4. バリデーションは backend が正、frontend は表示

422 の `{ errors: { title: [...] } }` を React が `formErrors` に載せて表示。  
Spring + Thymeleaf でサーバーがエラーを HTML に埋め込む形とは、**エラーの届け方**が違う。

## API 設計（実装済み）

- ベースパス: `/api/v1/`
- 形式: JSON

| メソッド | パス | 用途 |
|---|---|---|
| GET | `/api/v1/skill_gaps` | SkillGap 一覧 |
| GET | `/api/v1/skill_gaps/:id` | SkillGap 詳細（LearningTask 含む） |
| POST | `/api/v1/skill_gaps` | SkillGap 作成 |
| PATCH | `/api/v1/skill_gaps/:id` | SkillGap 更新 |
| GET | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | LearningTask 一覧 |
| POST | `/api/v1/skill_gaps/:skill_gap_id/learning_tasks` | LearningTask 作成 |

## 開発時の接続

| プロセス | ポート | 役割 |
|---|---|---|
| Postgres（Docker） | 5433 | DB |
| Rails（backend） | 3000 | API サーバー |
| Vite（frontend） | 5173 | 開発サーバー + HMR |

Vite の proxy で `/api` を Rails に転送。開発時は CORS 設定なしで接続可能。

## なぜ API モード + 別 frontend か

| 選択肢 | 採用 | 理由 |
|---|---|---|
| Rails API + TS SPA | **採用** | Rails / TypeScript 中心の現場構成に近い |
| 通常 Rails（ERB / Hotwire） | 不採用 | 本 spike の主目的（TS API 連携）から外れる |

Hotwire は Rails として重要だが、本リポジトリのスコープ外。業務系 MPA との対比は `docs/java-spring-comparison/` を参照。
