# Acceptance

## 基本信息

- 功能名称：棋盘垂直辅助线
- 对应 Spec：`specs/board-vertical-guides/spec.md`
- 验收人：Codex
- 验收日期：2026-05-15

## 验收前提

- [x] 代码已合并或可运行：本地工作区可运行，未提交
- [x] 使用的分支和提交已记录：当前工作区未提交，未创建提交
- [x] 相关 mock / 测试数据可用：不涉及
- [x] 设计稿或 UI 分析清单可访问：用户要求增加很淡的垂直分隔线

## 功能验收

- [x] 主流程通过：主棋盘背景缓存创建时先绘制深浅格子，再绘制内部垂直辅助线
- [x] 异常流程通过：辅助线按 `width` 和 `board_cell_size` 自动计算，只绘制小于背景宽度的内部列边界
- [x] 边界条件通过：辅助线不绘制外框，不影响棋盘顶部活动区
- [x] 权限逻辑符合预期：不涉及权限

## UI 验收

- [x] 布局正确：不改变 canvas 尺寸和页面布局
- [x] 文案正确：不涉及文案
- [x] 图片/图标正确：不涉及图片和图标
- [x] 状态展示完整：空棋盘和有方块时均复用同一背景
- [x] 响应式或分辨率要求满足：辅助线随单元格尺寸计算

## Harness 验收

- [x] 类型检查通过：`pnpm build` 已包含 `vue-tsc --build --force`
- [x] Lint 通过：`pnpm exec eslint src/game/config.ts src/game/renderer/canvas/utils.ts`
- [x] Format 通过：`pnpm exec prettier --check src/game/config.ts src/game/renderer/canvas/utils.ts specs/board-vertical-guides/proposal.md specs/board-vertical-guides/spec.md specs/board-vertical-guides/tasks.md`
- [ ] 单元测试通过：不适用，本次为 canvas 静态背景绘制
- [ ] 关键 flow harness 通过：不适用，本次不改流程
- [ ] 截图回归通过：未配置截图回归

## 问题记录

| 编号 | 级别 | 问题描述 | 状态 |
| ---- | ---- | -------- | ---- |

## 验收结论

- 结论：通过
- 备注：本次只影响主棋盘背景缓存，不修改下一块预览区、sample 渲染和游戏逻辑。
