# Spike 01: SkillGap CRUD 縦切り

Phase 1〜3 を通じて、SkillGap の CRUD と LearningTask の関連表示を **1 本の縦切り** として実装・検証します。

## この spike で確認すること

### Rails（backend）

- [ ] `rails new --api` でのプロジェクト構成
- [ ] migration の書き方と `db:migrate` の流れ
- [ ] SkillGap / LearningTask モデルの定義
- [ ] validation（`validates`）の書き方とエラーレスポンス
- [ ] association（`has_many` / `belongs_to`）の定義と使い方
- [ ] enum（`enum status:`）の定義と DB 格納
- [ ] `routes.rb` での RESTful ルーティング
- [ ] Controller のアクション（index, show, create, update）の処理の流れ
- [ ] JSON レスポンスの返し方

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

- [ ] Controller と Service の責務の違い
- [ ] Active Record と JPA + Repository の違い
- [ ] migration と Flyway の違い
- [ ] バリデーションの置き場所の違い
- [ ] フロントエンドとの API 連携パターンの違い

---

## 実装後に記録すること

以下のセクションは、実装完了後に記入します。

### やったこと

（実装したファイル・エンドポイント・画面の一覧）

### 詰まった点

（エラー内容、調べたこと、解決方法）

### Spring Boot との違いで印象に残ったこと

（責務分離、ボイラープレート、規約の違いなど）

### 次に深掘りしたいこと

（本 spike で触れなかったが、次に調べたいトピック）

---

## 関連ドキュメント

- [domain.md](../domain.md) — モデル定義
- [architecture.md](../architecture.md) — 責務分離
- [tech-gap-matrix.md](../tech-gap-matrix.md) — 横断対応表
- [implementation-phases.md](../implementation-phases.md) — フェーズ計画

## ステータス

| 項目 | 状態 |
|---|---|
| Phase 1（Model） | 未着手 |
| Phase 2（API） | 未着手 |
| Phase 3（Frontend） | 未着手 |
| 学習ログ記入 | 未着手 |
