# SDD Workflow

## Goal

本仓库后续采用轻量但严格的 Spec-Driven Development, SDD 流程，避免游戏规则靠口头描述或临时记忆演化。

## When Spec Is Mandatory

以下改动必须先更新 spec：

- 修改核心规则
- 修改状态机
- 修改得分公式
- 修改方块形状或生成概率
- 修改 `Perfect` / `Cover` 的定义
- 修改光芒扩散逻辑
- 修改 `ExtendLife` 触发与搜索顺序

## Workflow

1. 明确变更目标
   写清楚要解决的问题、保持不变的内容、边界条件

2. 创建或更新 spec
   在 `specs/` 下新增或修改一个规格目录

3. 写 acceptance scenarios
   用输入场景 + 预期结果描述

4. 设计 harness
   决定哪些场景用单元测试，哪些场景用 visual harness

5. 实现代码
   优先改纯规则函数，再改状态机，再改 UI / renderer

6. 验证
   至少执行：
   - `pnpm build`
   - 相关自动化测试
   - 必要的 visual harness 检查

7. 回写文档
   若架构、模块职责或流程有变化，同步更新 `docs/`

## Spec Directory Convention

推荐目录结构：

```text
specs/
  001-core-gameplay/
    spec.md
  002-extend-life-refactor/
    spec.md
```

每个 spec 目录至少包含一个 `spec.md`。

## Spec Content Checklist

每份 spec 至少包含：

- 背景
- 目标
- 非目标
- 术语
- 规则定义
- 验收场景
- 验证方式
- 风险或待确认问题

## Scenario Writing Rules

场景要尽量可执行，而不是泛泛描述。

好例子：

- 给定一个斜正方形内部格由两个互补三角组成
- 当执行 `checkBevelledSquaresPerfect`
- 则结果应为 `true`

坏例子：

- 应该正确处理复杂情况

## Done Definition

一个规则改动只有在以下条件都满足时才算完成：

- spec 已更新
- 代码已实现
- 至少一个 harness 覆盖了关键场景
- `pnpm build` 通过
- 文档没有明显过期
