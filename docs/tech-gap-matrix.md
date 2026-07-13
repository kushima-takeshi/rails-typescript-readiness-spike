# 技術ギャップ対応表

Rails / TypeScript / Java Spring Boot の概念対応を横断的にまとめるドキュメントです。

実装を進めながら「確認済み」列を更新し、気づきを `メモ` 列に追記してください。

## 凡例

| 記号 | 意味 |
|---|---|
| ⬜ | 未確認 |
| ✅ | 確認済み |
| — | 該当なし / スコープ外 |

---

## 1. プロジェクト構成

| トピック | Spring Boot | Rails（backend） | TypeScript（frontend） | 確認済み | メモ |
|---|---|---|---|---|---|
| プロジェクト生成 | Spring Initializr | `rails new --api` | `npm create vite` | ✅ | `rails new . --api -d postgresql` で backend/ に生成 |
| ディレクトリ構成 | `src/main/java/...` | `app/`, `config/`, `db/` | `src/`, `public/` | ✅ | API モードは `app/views` 等が少ない |
| 依存管理 | Maven / Gradle | Bundler（Gemfile） | npm（package.json） | ✅ | Gemfile + bundle install |
| 設定ファイル | `application.yml` | `config/*.rb` | `vite.config.ts` | ✅ | `database.yml` で Postgres port 5433 |

## 2. ルーティング・コントローラ

| トピック | Spring Boot | Rails（backend） | TypeScript（frontend） | 確認済み | メモ |
|---|---|---|---|---|---|
| ルート定義 | `@GetMapping` 等 | `config/routes.rb` | React Router | ✅ | `namespace :api/v1` + `resources` |
| コントローラ | `@RestController` | `Api::V1::*Controller` | — | ✅ | `ActionController::API` 継承 |
| アクション分割 | メソッド単位 | アクション名（index, show, create...） | — | ✅ | REST 規約どおりのメソッド名 |
| Service 層 | 一般的に分離 | 省略 or 薄い Model 委譲 | — | ✅ | 本 spike では Service なし |
| リクエストパラメータ | `@RequestBody`, `@PathVariable` | `params` | — | ✅ | Strong Parameters + `{"skill_gap":{...}}` ラップ |
| レスポンス | `ResponseEntity<T>` | `render json:` / serializer | — | ✅ | Controller 内 private メソッドで Hash 化 |

## 3. モデル・永続化

| トピック | Spring Boot | Rails（backend） | TypeScript（frontend） | 確認済み | メモ |
|---|---|---|---|---|---|
| ORM | JPA（Hibernate） | Active Record | — | ✅ | Model が DB 操作まで担う |
| エンティティ定義 | `@Entity` クラス | `ApplicationRecord` 継承 | — | ✅ | SkillGap / LearningTask |
| Repository | `JpaRepository` インターフェース | 不要（Model に集約） | — | ✅ | `SkillGap.find` / `SkillGap.all` 等 |
| マイグレーション | Flyway / Liquibase | `db/migrate/` | — | ✅ | `rails g model` で生成 |
| スキーマ管理 | migration ツール | `db/schema.rb`（自動生成） | — | ✅ | migrate 後に自動更新 |
| バリデーション | Bean Validation（`@NotNull` 等） | `validates` マクロ | — | ✅ | 422 で `errors` を JSON 返却 |
| 関連定義 | `@OneToMany`, `@ManyToOne` | `has_many`, `belongs_to` | — | ✅ | ネストルートと対応 |
| カスケード削除 | `cascade`, `orphanRemoval` | `dependent: :destroy` | — | ✅ | SkillGap 削除時に子も削除 |

## 4. 状態管理（enum / status）

| トピック | Spring Boot | Rails（backend） | TypeScript（frontend） | 確認済み | メモ |
|---|---|---|---|---|---|
| enum 定義 | Java `enum` クラス | `enum` マクロ | union type | ✅ | `not_started: 0` 形式 |
| DB 格納 | ordinal / STRING | string / integer（設定次第） | — | ✅ | integer カラムに 0,1,2 |
| バリデーション | enum 型で制約 | `enum` の inclusion | 型 + 表示マップ | ✅ | 不正値は AR が拒否 |
| 表示変換 | サーバー側で変換 | serializer or helper | フロントのマップオブジェクト | ✅ | JSON では文字列（`"in_progress"`）で返る |

## 5. API 連携（フロントエンド）

| トピック | Spring Boot | Rails（backend） | TypeScript（frontend） | 確認済み | メモ |
|---|---|---|---|---|---|
| HTTP クライアント | —（フロント側） | — | `fetch` / axios | ✅ | `src/api/skillGaps.ts` |
| 型定義 | DTO クラス | serializer の出力 | `interface` / `type` | ✅ | `src/types/skillGap.ts` |
| エラーハンドリング | `@ControllerAdvice` | `rescue_from` / ステータスコード | `.catch` + UI 表示 | ✅ | 422 をフォーム下に表示 |
| CORS | `@CrossOrigin` | `rack-cors` | — | ✅ | 開発時は Vite proxy で回避（rack-cors 未設定） |
| 開発時 proxy | — | — | Vite `server.proxy` | ✅ | `/api` → localhost:3000 |

## 6. テスト

| トピック | Spring Boot | Rails（backend） | TypeScript（frontend） | 確認済み | メモ |
|---|---|---|---|---|---|
| モデルテスト | `@DataJpaTest` | RSpec model spec | — | ⬜ | 未着手 |
| API テスト | `@WebMvcTest`, MockMvc | RSpec request spec | — | ⬜ | curl で手動検証済み、spec は未着手 |
| フロントテスト | — | — | Vitest（任意） | — | スコープ外の可能性 |

## 7. 責務分離の違い（まとめ）

| 観点 | Spring Boot | Rails + TypeScript |
|---|---|---|
| 層の分け方 | Controller → Service → Repository → Entity | Controller → Model（Active Record） |
| フロントとの境界 | API（DTO）で明確に分離 | 同様に API（JSON）で分離 |
| ボイラープレート | アノテーション + インターフェースが多い | 規約により少ない傾向 |
| 学習の焦点 | DI / レイヤードアーキテクチャ | 規約・省略された層・Active Record の責務 |

---

## 更新履歴

| 日付 | 更新内容 |
|---|---|
| 2026-07-02 | 初稿作成（全項目 ⬜） |
| 2026-07-09 | Phase 1〜2 実装分を ✅ に更新 |
| 2026-07-13 | Phase 3 フロントエンド連携分を ✅ に更新 |
