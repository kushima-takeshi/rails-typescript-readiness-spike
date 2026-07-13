# アソシエーション（has_many / belongs_to vs JPA 関連）

## Spring Boot での一般的なやり方

```java
@Entity
public class SkillGap {
    @OneToMany(mappedBy = "skillGap", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LearningTask> learningTasks;
}

@Entity
public class LearningTask {
    @ManyToOne
    @JoinColumn(name = "skill_gap_id")
    private SkillGap skillGap;
}
```

## このリポジトリでのやり方

```ruby
class SkillGap < ApplicationRecord
  has_many :learning_tasks, dependent: :destroy
end

class LearningTask < ApplicationRecord
  belongs_to :skill_gap
end
```

**ネストした API**

```
GET  /api/v1/skill_gaps/:skill_gap_id/learning_tasks
POST /api/v1/skill_gaps/:skill_gap_id/learning_tasks
```

```ruby
@skill_gap.learning_tasks.build(learning_task_params)
```

## 主な違い

| 観点 | JPA | Active Record |
|---|---|---|
| 親子定義 | `@OneToMany` / `@ManyToOne` | `has_many` / `belongs_to` |
| カスケード | `cascade`, `orphanRemoval` | `dependent: :destroy` |
| 子の作成 | Entity に親を set | `parent.children.build` |

## このリポジトリでの確認結果

- 詳細 API で `learning_tasks` を同梱
- ネスト POST で `skill_gap_id` が自動セット
- フロント詳細画面で LearningTask 一覧を表示
