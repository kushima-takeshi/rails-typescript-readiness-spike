# ドキュメント索引

このディレクトリには、技術検証の方針・ドメイン定義・Java / Spring Boot との差分メモを集約します。

## 構成

| ファイル / ディレクトリ | 内容 |
|---|---|
| [architecture.md](architecture.md) | Rails API + Vite React TypeScript の責務分離・全体構成 |
| [domain.md](domain.md) | SkillGap / LearningTask のモデル定義 |
| [implementation-phases.md](implementation-phases.md) | Phase 0〜4 の実装計画 |
| [tech-gap-matrix.md](tech-gap-matrix.md) | Rails / TypeScript / Spring Boot の横断対応表 |
| [java-spring-comparison/](java-spring-comparison/) | トピック別の比較メモ（今後追加） |
| [spikes/](spikes/) | 縦切り実装ごとの学習ログ |

## ドキュメントの書き方

1. **方針・定義** は `architecture.md` / `domain.md` に集約し、重複を避ける
2. **実装後の気づき** は `spikes/` に記録し、要点を `tech-gap-matrix.md` に転記する
3. **Spring Boot との詳細比較** は `java-spring-comparison/` にトピックごとに分割する

## 更新タイミング

| タイミング | 更新するドキュメント |
|---|---|
| Phase 0 完了時 | 本索引、architecture、domain、implementation-phases |
| 各 spike 実装後 | spikes/*.md → tech-gap-matrix.md |
| 比較の深掘り時 | java-spring-comparison/*.md |
