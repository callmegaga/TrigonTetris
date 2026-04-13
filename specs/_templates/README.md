# Specs 模板说明

本目录用于统一需求规格相关文档的结构，避免人和 AI 在编写 `proposal`、`spec`、`tasks`、`acceptance` 时自由发挥。

## 使用顺序

1. 先创建 `proposal`
2. 评审通过后补充或更新 `spec`
3. 将实现拆解为 `tasks`
4. 开发完成后依据 `acceptance` 进行验收

## 命名建议

- `specs/<功能名>/proposal.md`
- `specs/<功能名>/spec.md`
- `specs/<功能名>/tasks.md`
- `specs/<功能名>/acceptance.md`

## 基本规则

- 文档和注释使用中文
- 每次功能变更必须至少对应一个 `specs/<功能名>/`
- 若变更影响已有功能，需要同步更新对应 `spec`
- 编码前必须确认 `proposal/spec/tasks` 已达到可执行状态
