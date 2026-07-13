# migration と Flyway / Liquibase

## Spring Boot での一般的なやり方

```
src/main/resources/db/migration/
  V1__create_skill_gaps.sql
  V2__create_learning_tasks.sql
```

- Flyway / Liquibase で SQL または YAML をバージョン管理
- 起動時に未適用 migration を順番に実行

## このリポジトリでのやり方（Rails migration）

```bash
rails generate model SkillGap title:string category:string status:integer
rails db:migrate
```

```ruby
# db/migrate/20260703141706_create_skill_gaps.rb
create_table :skill_gaps do |t|
  t.string :title, null: false
  t.string :category, null: false
  ...
end
```

- Ruby DSL でテーブル定義
- `db:migrate` 後に `db/schema.rb` が **自動生成**される

## 主な違い

| 観点 | Flyway / Liquibase | Rails migration |
|---|---|---|
| 記述 | SQL が多い | Ruby DSL |
| スキーマの正 | migration ファイル | `schema.rb`（生成物） |
| 生成 | 手書き or ツール | `rails g model` で雛形 |

## このリポジトリでの確認結果

- SkillGap / LearningTask の migration 2 本
- `rails db:migrate:status` で適用状態を確認
- Postgres は Docker Compose（port 5433）
