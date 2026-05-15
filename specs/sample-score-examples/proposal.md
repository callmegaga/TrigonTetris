# Proposal

## 基本信息

- 功能名称：新增 Sample 得分示例
- 任务 ID：SAMPLE-SCORE-EXAMPLES
- 提出人：用户
- 计划日期：2026-05-14
- 相关链接：用户提供的最新 samples 截图

## 背景

当前游戏右侧 samples 只展示已有 9 个得分示例。用户提供了最新截图，需要补充 27 分和 6,400,000 分两个示例，并确保它们都是 `Perfect` 拼法。

## 目标

- 在 samples 列表中新增 27 分示例。
- 在 samples 列表中新增 6,400,000 分示例。
- 使用现有得分规则自动验证两个示例的分数。

## 非目标

- 本次不修改游戏得分公式。
- 本次不修改主游戏状态机、渲染风格或随机方块概率。
- 本次不新增外部依赖。

## 用户价值

- 面向玩家：展示更多可学习的高低分拼法。
- 解决问题：当前 samples 与最新截图不一致。
- 成功后用户得到：右侧 samples 中可见 27 分和 6,400,000 分两个新增示例。

## 范围

### In Scope

- `src/utils/sample.ts` 中新增两个 sample。
- `sample-scores.test.ts` 验证新增分数和 perfect 识别。

### Out of Scope

- 游戏规则变更。
- UI 布局调整。
- 截图回归基建。

## 输入条件

- 是否有设计稿：有，用户提供截图。
- 是否有接口：无。
- 是否需要 mock：无。
- 是否涉及权限：否。
- 是否涉及埋点/日志：否。

## 风险与约束

- 技术风险：需要从截图复原 block 组合，必须通过规则函数反算校验。
- 业务风险：示例若不是 `Perfect` 会误导玩家。
- 依赖约束：必须继续使用现有 Shape1-Shape7 和 sample 渲染链路。

## 验收概览

- 需要补充 `specs/sample-score-examples/spec.md`。
- 需要更新 `src/utils/__tests__/sample-scores.test.ts`。
- 需要执行 focused unit test。
- 不需要 UI 自动截图回归。

## 交付物

- `specs/sample-score-examples/spec.md`
- `specs/sample-score-examples/tasks.md`
- `src/utils/sample.ts`
- `src/utils/__tests__/sample-scores.test.ts`
