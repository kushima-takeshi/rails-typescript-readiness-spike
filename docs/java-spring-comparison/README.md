# Java / Spring Boot 比較メモ

トピック別に、Spring Boot との差分を深掘りするためのドキュメントを配置します。

各ファイルは Phase 1〜4 の実装を進めながら追加・更新します。現時点では比較する観点の一覧のみを定義します。

## 比較観点一覧

| # | ファイル（予定） | 比較トピック | 対応する spike / Phase |
|---|---|---|---|
| 01 | `01-routing-and-controllers.md` | ルーティングとコントローラの責務 | Phase 2 ✅ |
| 02 | `02-active-record-vs-jpa.md` | Active Record と JPA Entity の違い | Phase 1 ✅ |
| 03 | `03-migrations.md` | migration と Flyway / Liquibase | Phase 1 ✅ |
| 04 | `04-validations.md` | バリデーション（validates vs Bean Validation） | Phase 1 ✅ |
| 05 | `05-associations.md` | アソシエーション（has_many / belongs_to vs JPA 関連） | Phase 1 ✅ |
| 06 | `06-enums-and-status.md` | enum / status 管理 | Phase 1 ✅ |
| 07 | `07-typescript-api-client.md` | TypeScript からの API 連携 | Phase 3 ✅ |

## 各ドキュメントの記載テンプレート（予定）

```markdown
# [トピック名]

## Spring Boot での一般的なやり方
（コード例・構成）

## Rails / TypeScript でのやり方
（コード例・構成）

## 主な違い
（箇条書き）

## このリポジトリでの確認結果
（実装後に追記）

## 参考リンク
```

## 使い方

1. 実装前: 本一覧で「何を比較するか」を把握する
2. 実装中: 気づきをメモする
3. 実装後: 該当ファイルを作成し、要点を `docs/tech-gap-matrix.md` に転記する
