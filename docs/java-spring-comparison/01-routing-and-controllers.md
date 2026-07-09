# ルーティングとコントローラの責務

## Spring Boot での一般的なやり方

```java
@RestController
@RequestMapping("/api/v1/skill-gaps")
public class SkillGapController {
    private final SkillGapService service;

    @GetMapping
    public List<SkillGapDto> index() { ... }

    @GetMapping("/{id}")
    public SkillGapDto show(@PathVariable Long id) { ... }

    @PostMapping
    public ResponseEntity<SkillGapDto> create(@Valid @RequestBody CreateSkillGapRequest req) { ... }
}
```

- URL は各 Controller クラスに `@RequestMapping` / `@GetMapping` で分散定義
- ビジネスロジックは Service 層に委譲するのが一般的
- 入力は DTO + Bean Validation、出力も DTO
- 例外は `@ControllerAdvice` で横断処理

## Rails でのやり方（本リポジトリ）

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :skill_gaps, only: %i[index show create update] do
      resources :learning_tasks, only: %i[index create]
    end
  end
end
```

```ruby
# app/controllers/api/v1/skill_gaps_controller.rb
module Api
  module V1
    class SkillGapsController < ApplicationController
      def index
        skill_gaps = SkillGap.includes(:learning_tasks).order(:id)
        render json: skill_gaps.map { |sg| skill_gap_json(sg) }
      end
      # ...
    end
  end
end
```

- URL は `routes.rb` に集約。`resources` で REST の 7 アクションが規約どおりにマッピングされる
- Service 層は省略し、Controller が Model（Active Record）を直接呼ぶ
- 入力は Strong Parameters（`params.require(:skill_gap).permit(...)`）
- 出力は `render json:` で Hash を返す（serializer 未使用）
- 404 は `rescue_from ActiveRecord::RecordNotFound`、422 は `render_validation_errors`

## 主な違い

| 観点 | Spring Boot | Rails（本 spike） |
|---|---|---|
| ルート定義の場所 | 各 Controller | `config/routes.rb` |
| 命名規約 | 自由度高い | `resources` + 複数形 URL + アクション名が規約 |
| Service 層 | ほぼ必須 | 省略可（Model に委譲） |
| リクエストボディ | フラット or DTO | `{"skill_gap": {...}}` のようにラップ |
| パラメータ制限 | DTO のフィールド | `permit` によるホワイトリスト |
| ネストリソース | パス設計を自分で決める | `resources` のネストで `skill_gap_id` が自動 |

## このリポジトリでの確認結果

- `GET /api/v1/skill_gaps` — 200、N+1 対策で `includes(:learning_tasks)` を使用
- `POST /api/v1/skill_gaps` — 201（成功）、422（title / category 未入力）
- `GET /api/v1/skill_gaps/:id` — 200、詳細に `learning_tasks` 配列を同梱
- `PATCH /api/v1/skill_gaps/:id` — 200、enum の `status` を更新可能
- ネストした `learning_tasks` の index / create も動作確認済み
- 存在しない ID → 404 `{"error":"Not Found"}`（`ApplicationController#not_found`）

## 参考リンク

- [Rails Routing from the Outside In](https://guides.rubyonrails.org/routing.html)
- [Action Controller Overview](https://guides.rubyonrails.org/action_controller_overview.html)
