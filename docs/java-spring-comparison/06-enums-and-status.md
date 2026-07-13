# enum / status 管理

## Spring Boot での一般的なやり方

```java
public enum SkillGapStatus {
    NOT_STARTED, IN_PROGRESS, DONE
}

@Enumerated(EnumType.STRING)
private SkillGapStatus status;
```

- Java `enum` クラス
- DB には STRING または ORDINAL で格納

## このリポジトリでのやり方（Rails）

```ruby
enum :status, { not_started: 0, in_progress: 1, done: 2 }
```

- DB には integer（0, 1, 2）
- JSON では文字列 `"in_progress"` として返る

**TypeScript 側**

```ts
export type SkillGapStatus = 'not_started' | 'in_progress' | 'done'
```

## 主な違い

| 観点 | Java enum | Rails enum |
|---|---|---|
| 定義 | クラス | Model 上の `enum` マクロ |
| API 出力 | DTO で変換することが多い | デフォルトで文字列キー |
| フロント | — | union type で型安全に |

## このリポジトリでの確認結果

- create 時に `status` 未指定 → `not_started` をデフォルト
- PATCH で `in_progress` に更新可能
- フロントでは `"in_progress"` をそのまま表示（日本語マップは未実装）
