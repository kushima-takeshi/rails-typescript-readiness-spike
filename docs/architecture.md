# アーキテクチャ方針

## 概要

本リポジトリは **Rails API モード（backend）** と **Vite + React + TypeScript（frontend）** を分離したモノレポ構成を採用します。

目的は本番プロダクトの完成ではなく、**責務分離の違いを Java / Spring Boot 経験と対比しながら学ぶこと**です。

## ディレクトリ構成（予定）

```
rails-typescript-readiness-spike/
├── backend/                    # Rails API
│   ├── app/
│   │   ├── controllers/api/v1/
│   │   ├── models/
│   │   └── serializers/      # JSON シリアライズ
│   ├── config/routes.rb
│   ├── db/migrate/
│   └── spec/
├── frontend/                   # Vite + React + TypeScript
│   ├── src/
│   │   ├── api/                # API クライアント
│   │   ├── types/              # レスポンス型定義
│   │   ├── pages/
│   │   └── components/
│   └── package.json
└── docs/
```

## 責務分離

### backend（Rails API）

| 責務 | 具体例 |
|---|---|
| ルーティング | `config/routes.rb` で RESTful API を定義 |
| リクエスト処理 | `Api::V1::SkillGapsController` など |
| ドメインロジック | Active Record モデル（validation, association, enum） |
| 永続化 | migration, `db/schema.rb` |
| データ整形 | serializer / JSON レスポンス |

**やらないこと:** HTML レンダリング、画面状態管理、CSS

### frontend（Vite + React + TypeScript）

| 責務 | 具体例 |
|---|---|
| UI 表示 | 一覧・詳細・フォーム画面 |
| 画面状態 | ローディング、エラー表示、フォーム入力 |
| API 連携 | `fetch` / axios で backend を呼び出し |
| 型定義 | API レスポンスの TypeScript 型 |

**やらないこと:** DB アクセス、ビジネスルールの最終判定（バリデーションの本体は backend）

## Spring Boot との責務分離の違い

| 観点 | Spring Boot（一般的な構成） | 本リポジトリ |
|---|---|---|
| API 層 | `@RestController` + Service + Repository | Controller + Active Record（Service 層は薄く or 省略） |
| 永続化 | JPA Entity + Repository インターフェース | Active Record（Repository パターン不要） |
| フロント | 別リポジトリ or 同梱の React | `frontend/` ディレクトリで同居 |
| 設定 | `application.yml` | `config/` 配下の Ruby ファイル |
| DI | Spring コンテナ | Rails の規約・自動読み込み |

Rails では **モデルにロジックが集約されやすい** 一方、Spring Boot では **Service / Repository に層を分ける** 傾向が強い。本 spike ではその差分を意識して実装・記録します。

## API 設計方針

- ベースパス: `/api/v1/`
- 形式: JSON
- エンドポイント（予定）:

| メソッド | パス | 用途 |
|---|---|---|
| GET | `/api/v1/skill_gaps` | SkillGap 一覧 |
| GET | `/api/v1/skill_gaps/:id` | SkillGap 詳細（LearningTask 含む） |
| POST | `/api/v1/skill_gaps` | SkillGap 作成 |
| PATCH | `/api/v1/skill_gaps/:id` | SkillGap 更新 |
| GET | `/api/v1/skill_gaps/:id/learning_tasks` | 紐づく LearningTask 一覧 |
| POST | `/api/v1/skill_gaps/:id/learning_tasks` | LearningTask 作成 |

## 開発時の接続

| プロセス | ポート（予定） | 役割 |
|---|---|---|
| Rails（backend） | 3000 | API サーバー |
| Vite（frontend） | 5173 | 開発サーバー + HMR |

開発時は Vite の proxy 設定で `/api` を Rails に転送します。CORS は開発用に許可します。

## なぜ API モード + 別 frontend か

| 選択肢 | 採用 | 理由 |
|---|---|---|
| Rails API + TS SPA | **採用** | Rails / TypeScript 中心の現場構成に近く、TypeScript 検証がしやすい |
| 通常 Rails（ERB / Hotwire） | 不採用 | 本 spike の主目的（TS API 連携）から外れる |

Hotwire は Rails として重要な選択肢ですが、本リポジトリのスコープ外とし、必要であれば別途検証します。
