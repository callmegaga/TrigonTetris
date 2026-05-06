# Proposal

## 基本信息

- 功能名称：续命阶段斜正方形 Cover block 收集修复
- 任务 ID：BUG-EXTEND-LIFE-BEVELLED-COVER-BLOCKS
- 提出人：用户反馈
- 计划日期：2026-05-06
- 相关链接：`docs/architecture/gameplay.md`

## 背景

在续命阶段寻找 Cover 时，如果命中 `BevelledSquare cover`，存在属于该斜正方形的部分 block 没有被正确标红，也没有被清除的情况。该问题会造成续命表现与实际规则不一致，并可能让越界棋盘残留本应清除的 block。

## 目标

- 修复 `ExtendLife` 阶段命中 `BevelledSquare cover` 时参与 block 的收集逻辑。
- 确保属于该 cover 的 block 在标红、特效和清除三个环节使用同一组 block。

## 非目标

- 本次不调整 `Perfect BevelledSquare` 的判定规则。
- 本次不调整续命搜索顺序。
- 本次不新增得分规则。

## 用户价值

- 面向谁：游戏玩家与维护者。
- 解决什么问题：续命阶段命中斜正方形 cover 后，视觉反馈和实际清除不完整。
- 成功后用户得到什么：所有参与 cover 的 block 都会被一致地标红并清除。

## 范围

### In Scope

- `BevelledSquare cover` 的参与 block 收集。
- 续命阶段标红和清除一致性。
- 相关单元测试。

### Out of Scope

- UI 布局调整。
- 反馈后台功能。
- 普通正方形 cover 规则变更。

## 输入条件

- 是否有设计稿：否。
- 是否有接口：否。
- 是否需要 mock：否。
- 是否涉及权限：否。
- 是否涉及埋点/日志：否。

## 风险与约束

- 技术风险：`BoardCell` 可包含多个碎片，block 收集必须基于几何参与关系，不能只按单一字面值判断。
- 业务风险：误扩大收集范围会清除不属于 cover 的 block。
- 依赖约束：必须保持 `BevelledSquare cover` 优先于 `Square cover`。

## 验收概览

- 需要补充 `spec.md`、`tasks.md`、`acceptance.md`。
- 需要补充单元测试覆盖同一边框格含多个三角时的 block 收集。
- 不需要 UI 截图回归。

## 交付物

- `specs/extend-life-bevelled-cover-blocks/spec.md`
- `specs/extend-life-bevelled-cover-blocks/tasks.md`
- 代码实现
- 验收记录
