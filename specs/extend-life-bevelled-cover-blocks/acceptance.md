# Acceptance

## 基本信息

- 功能名称：续命阶段斜正方形 Cover block 收集修复
- 对应 Spec：`specs/extend-life-bevelled-cover-blocks/spec.md`
- 验收人：Codex
- 验收日期：2026-05-06

## 验收前提

- [x] 代码已合并或可运行
- [ ] 使用的分支和提交已记录
- [x] 相关 mock / 测试数据可用
- [x] 设计稿或 UI 分析清单可访问：不适用，本次未改 UI

## 功能验收

- [x] 主流程通过
- [x] 异常流程通过
- [x] 边界条件通过
- [x] 边框双三角只覆盖构成边框方向的 1 个 block
- [x] 边框 `Full` 覆盖该 `Full` 所属 block
- [x] 权限逻辑符合预期：不适用，本次不涉及权限

## UI 验收

- [x] 布局正确：不适用，本次未改布局
- [x] 文案正确：不适用，本次未改文案
- [x] 图片/图标正确：不适用，本次未改图片或图标
- [x] 状态展示完整：不适用，本次未改页面状态
- [x] 响应式或分辨率要求满足：不适用，本次未改响应式样式

## Harness 验收

- [x] 类型检查通过
- [x] Lint 通过
- [x] 单元测试通过
- [x] 关键 flow harness 通过：由规则层单元测试覆盖
- [x] 截图回归通过：不适用，本次未改视觉样式

## 问题记录

| 编号 | 级别 | 问题描述                                                                        | 状态  |
| ---- | ---- | ------------------------------------------------------------------------------- | ----- |
| 1    | P1   | `BevelledSquare cover` 边框允许 `Full` 成立，但参与 block 收集漏掉 `Full` block | fixed |

## 验收结论

- 结论：通过
- 备注：已执行 `pnpm exec vitest run src\utils\__tests__\bevelled-cover-blocks.test.ts`、`pnpm build`、`pnpm exec eslint src\utils\utils.ts src\utils\__tests__\bevelled-cover-blocks.test.ts`、`pnpm exec prettier --check src\utils\utils.ts src\utils\__tests__\bevelled-cover-blocks.test.ts specs\extend-life-bevelled-cover-blocks\proposal.md specs\extend-life-bevelled-cover-blocks\spec.md specs\extend-life-bevelled-cover-blocks\tasks.md specs\extend-life-bevelled-cover-blocks\acceptance.md`。
