# Acceptance

## 基本信息

- 功能名称：新增 Sample 得分示例
- 对应 Spec：`specs/sample-score-examples/spec.md`
- 验收人：Codex
- 验收日期：2026-05-14

## 验收前提

- [x] 代码已合并或可运行：本地工作区可运行，未提交
- [x] 使用的分支和提交已记录：当前工作区未提交，未创建提交
- [x] 相关 mock / 测试数据可用：`sample-scores.test.ts` 使用 sample 数据和规则函数
- [x] 设计稿或 UI 分析清单可访问：用户提供最新 samples 截图

## 功能验收

- [x] 主流程通过：`getSampleBlocks()` 已包含 27 分和 6,400,000 分示例
- [x] 异常流程通过：测试会在 sample 无 perfect 候选或分数不匹配时失败
- [x] 边界条件通过：27 分验证为 3 block / 2 色 / 3x3 普通 perfect；6,400,000 分验证为 10 block / 6 色 / size=4 斜 perfect
- [x] 权限逻辑符合预期：不涉及权限

## UI 验收

- [ ] 布局正确：不适用，本次不改布局
- [x] 文案正确：新增分数沿用现有 `${score}分` 展示
- [x] 图片/图标正确：新增 sample 使用现有 block 渲染链路生成图片
- [ ] 状态展示完整：不适用，本次不改状态
- [ ] 响应式或分辨率要求满足：不适用，本次不改响应式样式

## Harness 验收

- [x] 类型检查通过：`pnpm type-check`
- [x] Lint 通过：`pnpm lint`
- [x] 单元测试通过：`pnpm exec vitest run src/utils/__tests__/sample-scores.test.ts`、`pnpm test:unit -- run`
- [ ] 关键 flow harness 通过：不适用，本次不改流程
- [ ] 截图回归通过：不适用，本次不引入截图回归

## 问题记录

| 编号 | 级别 | 问题描述 | 状态 |
| ---- | ---- | -------- | ---- |

## 验收结论

- 结论：通过
- 备注：`pnpm build` 已通过；本次未新增截图回归。
