# Proposal

## 基本信息

- 功能名称：Perfect 清除后仅保留横向 SpreadLight
- 任务 ID：GAME-HORIZONTAL-SPREAD-LIGHT
- 提出人：用户
- 计划日期：2026-05-08
- 相关链接：`docs/architecture/gameplay.md`

## 背景

当前 `Perfect Square` 或 `Perfect BevelledSquare` 清除后，会向上下左右四个方向发出同宽光芒，并清除横向与纵向光芒覆盖到的 block。该效果清除范围较大，玩家对后续棋盘变化的预期不够集中。

## 目标

- 将 `Perfect` 后的 SpreadLight 视觉效果调整为仅左右横向扩散。
- 将 SpreadLight 后续清除范围同步调整为仅横向光芒覆盖到的 block。

## 非目标

- 本次不调整 `Perfect` 图形识别规则。
- 本次不调整 `Cover` 规则。
- 本次不调整得分公式。
- 本次不调整 `MoveBoard` 下落规则。

## 用户价值

- 面向谁：游戏玩家。
- 解决什么问题：减少纵向大范围清除带来的不可控变化。
- 成功后用户得到什么：Perfect 后棋盘变化更聚焦，视觉反馈与实际清除范围一致。

## 范围

### In Scope

- `Perfect` 后 SpreadLight 动画方向。
- SpreadLight 后 block 清除范围。
- 规则层单元测试。
- 核心玩法基线文档同步。

### Out of Scope

- UI 布局调整。
- 音效调整。
- 反馈后台功能。
- Playwright 截图回归。

## 输入条件

- 是否有设计稿：否。
- 是否有接口：否。
- 是否需要 mock：仅单元测试使用轻量 block mock。
- 是否涉及权限：否。
- 是否涉及埋点/日志：否。

## 风险与约束

- 技术风险：视觉动画方向与实际清除范围必须一致。
- 业务风险：清除范围缩小会改变游戏难度，需要规则文档明确记录。
- 依赖约束：`BevelledSquare` 仍按外接轴对齐正方形计算横向光带。

## 验收概览

- 需要补充 `spec.md`、`tasks.md`、`acceptance.md`。
- 需要新增规则层单元测试覆盖横向光带清除范围。
- 不需要 UI 截图回归。

## 交付物

- `specs/horizontal-spread-light/spec.md`
- `specs/horizontal-spread-light/tasks.md`
- 代码实现
- 验收记录
