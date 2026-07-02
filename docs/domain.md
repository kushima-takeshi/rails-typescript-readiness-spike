# ドメインモデル定義

## 概要

最小ドメインとして **SkillGap**（技術ギャップ）と **LearningTask**（学習タスク）の 2 エンティティを定義します。

## ER 図（概念）

```
┌─────────────────────┐       ┌─────────────────────┐
│      SkillGap       │       │    LearningTask     │
├─────────────────────┤       ├─────────────────────┤
│ id                  │──┐    │ id                  │
│ title (必須)        │  │    │ skill_gap_id (必須) │──┐
│ category (必須)     │  └──<│ title (必須)        │  │
│ current_level       │       │ status              │  │
│ target_level        │       │ due_date            │  │
│ reason              │       │ memo                │  │
│ status              │       │ created_at          │  │
│ created_at          │       │ updated_at          │  │
│ updated_at          │       └─────────────────────┘  │
└─────────────────────┘                                  │
         1                          N                    │
         └──────────────────────────────────────────────┘
```

## SkillGap

技術的なギャップ（習得したいスキル・知識）を表す。

| カラム | 型 | NULL | 説明 |
|---|---|---|---|
| id | bigint | NOT NULL | 主キー（自動採番） |
| title | string | NOT NULL | ギャップのタイトル（例: 「Rails routing の理解」） |
| category | string | NOT NULL | カテゴリ（例: `rails`, `typescript`, `infra`） |
| current_level | integer | NULL 可 | 現在の習熟度（0〜5 など、任意スケール） |
| target_level | integer | NULL 可 | 目標の習熟度 |
| reason | text | NULL 可 | なぜこのギャップがあるか |
| status | string / enum | NOT NULL | 進捗状態 |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

### status（予定値）

| 値 | 意味 |
|---|---|
| `not_started` | 未着手 |
| `in_progress` | 学習中 |
| `done` | 完了 |

### バリデーション（予定）

- `title`: 必須、最大 255 文字
- `category`: 必須
- `current_level`, `target_level`: 整数、0 以上（任意）
- `status`: 必須、定義済み enum 値のみ

### アソシエーション

- `has_many :learning_tasks, dependent: :destroy`

## LearningTask

SkillGap に紐づく具体的な学習タスクを表す。

| カラム | 型 | NULL | 説明 |
|---|---|---|---|
| id | bigint | NOT NULL | 主キー（自動採番） |
| skill_gap_id | bigint | NOT NULL | 外部キー（SkillGap） |
| title | string | NOT NULL | タスクのタイトル（例: 「routes.rb を読む」） |
| status | string / enum | NOT NULL | タスクの状態 |
| due_date | date | NULL 可 | 期限 |
| memo | text | NULL 可 | メモ |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

### status（予定値）

| 値 | 意味 |
|---|---|
| `todo` | 未着手 |
| `doing` | 進行中 |
| `done` | 完了 |

### バリデーション（予定）

- `title`: 必須、最大 255 文字
- `skill_gap_id`: 必須、存在する SkillGap を参照
- `status`: 必須、定義済み enum 値のみ

### アソシエーション

- `belongs_to :skill_gap`

## JSON API レスポンス例（予定）

### SkillGap

```json
{
  "id": 1,
  "title": "Rails routing の理解",
  "category": "rails",
  "current_level": 1,
  "target_level": 3,
  "reason": "Spring MVC の @RequestMapping との違いを把握したい",
  "status": "in_progress",
  "learning_tasks_count": 2,
  "created_at": "2026-07-02T00:00:00.000Z",
  "updated_at": "2026-07-02T00:00:00.000Z"
}
```

### LearningTask

```json
{
  "id": 1,
  "skill_gap_id": 1,
  "title": "routes.rb を読んで RESTful ルーティングを確認",
  "status": "todo",
  "due_date": "2026-07-10",
  "memo": null,
  "created_at": "2026-07-02T00:00:00.000Z",
  "updated_at": "2026-07-02T00:00:00.000Z"
}
```

## Spring Boot との対応

| 概念 | Spring Boot | Rails（本リポジトリ） |
|---|---|---|
| エンティティ | `@Entity` クラス | `ActiveRecord::Base` を継承した Model |
| 関連 | `@OneToMany` / `@ManyToOne` | `has_many` / `belongs_to` |
| バリデーション | Bean Validation (`@NotNull` 等) | Model の `validates` |
| 状態管理 | enum クラス | `enum` マクロ |
| テーブル定義 | JPA アノテーション or Flyway | migration ファイル |
