# Proposal

## 基本信息

- 功能名称：Perfect 按得分最高优先
- 任务 ID：PERFECT-SCORE-PRIORITY
- 提出人：用户
- 计划日期：2026-05-20
- 相关链接：无

## 背景

当前正常落地后的 Perfect 搜索优先级是先查 `BevelledSquare`，只要命中斜正方形就不会再比较普通正方形。这个规则会导致较低分的斜正方形优先于更高分的普通正方形被清除，和玩家对“高分组合优先”的预期不一致。

## 目标

- 正常落地后的 Perfect 候选统一按实际得分最高优先。
- 普通正方形和斜正方形参与同一个优先级比较。
- 保留得分相同时的稳定兜底规则，避免选择结果不可预测。

## 非目标

- 本次不调整 `Cover` 搜索优先级。
- 本次不调整 `MoveBoard` 阶段是否扫描斜正方形。
- 本次不修改得分公式、图形有效性规则或消除动画。

## 用户价值

- 面向谁：游戏玩家
- 解决什么问题：避免低分 Perfect 抢先消除高分 Perfect
- 成功后用户得到什么：同时存在多个 Perfect 候选时，系统优先清除收益最高的图形

## 范围

### In Scope

- 正常落地后 `Perfect` 候选选择。
- Rule 层新增统一选择函数。
- 单元测试覆盖普通高分优先和斜正方形高分优先。

### Out of Scope

- `ExtendLife` 的 `Cover` 优先级。
- `MoveBoard` 阶段的 Perfect 扫描范围。
- UI 展示、音效、输入和历史最高分逻辑。

## 输入条件

- 是否有设计稿：无
- 是否有接口：无
- 是否需要 mock：使用现有单元测试 mock block
- 是否涉及权限：否
- 是否涉及埋点/日志：否

## 风险与约束

- 技术风险：必须扫描所有 Perfect 候选，不能只比较每类面积最大的候选，否则会漏掉颜色数或 block 数带来的高分候选。
- 业务风险：得分相同时需要保持确定性排序。
- 依赖约束：必须沿用当前 `calculateSquareScore` 作为唯一得分来源。

## 验收概览

- 需要补充 `specs/perfect-score-priority/spec.md`
- 需要更新 `src/utils/utils.ts` 和 `src/game/game.ts`
- 需要新增或更新单元测试
- 需要通过 focused unit test、lint、format、build

## 交付物

- `specs/perfect-score-priority/spec.md`
- `specs/perfect-score-priority/tasks.md`
- 代码实现
- 单元测试
- 验收记录
