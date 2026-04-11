# Specs

`specs/` 用来保存这个仓库的需求规格，而不是保存实现细节。

## 目录约定

每个功能或规则变更使用一个独立目录：

```text
specs/
  001-core-gameplay/
    spec.md
  002-some-change/
    spec.md
```

## 使用方式

- 基线规则直接写在 `001-core-gameplay/spec.md`
- 后续规则变更新增编号目录，或在现有基线 spec 上修订
- 任何核心规则代码变更都应能追溯到某个 spec

## 模板

模板位于：

- [spec-template.md](/d:/Works/TrigonTetris/specs/templates/spec-template.md)
