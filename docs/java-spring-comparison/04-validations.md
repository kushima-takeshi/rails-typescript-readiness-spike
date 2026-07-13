# バリデーション（validates vs Bean Validation）

## Spring Boot での一般的なやり方

```java
public class CreateSkillGapRequest {
    @NotBlank
    @Size(max = 255)
    private String title;
    @NotBlank
    private String category;
}

@PostMapping
public ResponseEntity<?> create(@Valid @RequestBody CreateSkillGapRequest req) { ... }
```

- DTO にアノテーション
- Controller で `@Valid` によりチェック
- エラーは `@ControllerAdvice` で整形

## このリポジトリでのやり方

**Model（永続化層）**

```ruby
validates :title, presence: true, length: { maximum: 255 }
validates :category, presence: true
```

**Controller（入力の入口）**

```ruby
params.require(:skill_gap).permit(:title, :category, ...)
```

**エラー応答**

```ruby
render json: { errors: record.errors }, status: :unprocessable_entity  # 422
```

**Frontend**

```tsx
.catch((err) => {
  if (err.status === 422) setFormErrors(err.body.errors)
})
```

## 主な違い

| 観点 | Bean Validation | Rails |
|---|---|---|
| 定義場所 | DTO / Entity | Model の `validates` |
| 入力制限 | DTO フィールド | Strong Parameters |
| エラー形式 | フレームワーク依存 | `{ errors: { title: [...] } }` |

## このリポジトリでの確認結果

- 空の title / category → 422 + エラーメッセージ
- curl と React フォームの両方で確認済み
