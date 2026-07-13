# Active Record と JPA Entity の違い

## Spring Boot での一般的なやり方

```java
@Entity
public class SkillGap {
    @Id @GeneratedValue
    private Long id;
    @NotNull
    private String title;
    @OneToMany(mappedBy = "skillGap")
    private List<LearningTask> learningTasks;
}

public interface SkillGapRepository extends JpaRepository<SkillGap, Long> {}
```

- Entity（データ構造）と Repository（DB アクセス）を **分離**
- Service 層が Repository を呼ぶ構成が一般的

## このリポジトリでのやり方（Active Record）

```ruby
class SkillGap < ApplicationRecord
  has_many :learning_tasks, dependent: :destroy
  enum :status, { not_started: 0, in_progress: 1, done: 2 }
  validates :title, presence: true
end

# 利用例（Repository 不要）
SkillGap.find(1)
SkillGap.all
skill_gap.save
```

- **Model が DB 操作まで担う**（find / save / where 等）
- Repository インターフェースは不要

## 主な違い

| 観点 | JPA | Active Record |
|---|---|---|
| DB アクセス | Repository | Model クラス上のメソッド |
| 関連 | `@OneToMany` 等 | `has_many` / `belongs_to` |
| バリデーション | 別（Bean Validation） | 同じ Model に `validates` |
| 学習コスト | 層が多い | 1 クラスに集約 |

## このリポジトリでの確認結果

- `SkillGap.find(params[:id])` で Controller から直接取得
- `skill_gap.save` / `update` で永続化
- `includes(:learning_tasks)` で N+1 対策（JOIN FETCH 相当）
