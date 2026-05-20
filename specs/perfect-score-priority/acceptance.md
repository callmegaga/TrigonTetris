# Acceptance

## 基本信息

- 功能名称：Perfect 按得分最高优先
- 对应 Spec：`specs/perfect-score-priority/spec.md`
- 验收人：Codex
- 验收日期：2026-05-20

## 验收前提

- [x] 代码已合并或可运行：本地工作区可运行，未提交
- [x] 使用的分支和提交已记录：当前工作区未提交，未创建提交
- [x] 相关 mock / 测试数据可用：`perfect-selection.test.ts` 使用 mock block 构造普通和斜正方形候选
- [x] 设计稿或 UI 分析清单可访问：不涉及 UI 设计

## 功能验收

- [x] 主流程通过：正常落地后调用统一 `findBestPerfectSquare`，从普通和斜正方形 Perfect 候选中选择最高分
- [x] 异常流程通过：无候选时返回 `undefined`，游戏保持原有继续下落流程
- [x] 边界条件通过：同分时沿用面积、更靠下的几何优先级
- [x] 权限逻辑符合预期：不涉及权限

## UI 验收

- [x] 布局正确：不修改布局
- [x] 文案正确：不修改文案
- [x] 图片/图标正确：不涉及图片和图标
- [x] 状态展示完整：沿用现有 Perfect 消除动画和得分展示
- [x] 响应式或分辨率要求满足：不涉及响应式

## Harness 验收

- [x] 类型检查通过：`pnpm build` 已包含 `vue-tsc --build --force`
- [x] Lint 通过：`pnpm exec eslint src/game/game.ts src/utils/utils.ts src/utils/__tests__/perfect-selection.test.ts`
- [x] Format 通过：`pnpm exec prettier --check src/game/game.ts src/utils/utils.ts src/utils/__tests__/perfect-selection.test.ts specs/perfect-score-priority/proposal.md specs/perfect-score-priority/spec.md specs/perfect-score-priority/tasks.md`
- [x] 单元测试通过：`pnpm exec vitest run src/utils/__tests__/perfect-selection.test.ts`、`pnpm test:unit -- run`
- [x] 相关回归通过：`pnpm exec vitest run src/utils/__tests__/cover-selection.test.ts src/utils/__tests__/sample-scores.test.ts`
- [ ] 关键 flow harness 通过：不适用，本次无 e2e flow
- [ ] 截图回归通过：不适用，本次不改 UI

## 问题记录

| 编号 | 级别 | 问题描述 | 状态 |
| ---- | ---- | -------- | ---- |

## 验收结论

- 结论：通过
- 备注：本次只改变正常落地后的 Perfect 候选选择；`Cover` 和 `MoveBoard` 阶段扫描范围保持现状。
