# Acceptance

## 基本信息

- 功能名称：Sample 分数居中覆盖
- 对应 Spec：`specs/sample-score-overlay/spec.md`
- 验收人：Codex
- 验收日期：2026-06-20

## 验收前提

- [x] 代码已合并或可运行：本地工作区可运行，未提交
- [x] 使用的分支和提交已记录：当前工作区未提交，未创建提交
- [x] 相关 mock / 测试数据可用：不涉及 mock
- [x] 设计稿或 UI 分析清单可访问：用户要求回退外围格子并将分数放到示例中间

## 功能验收

- [x] 主流程通过：normal sample 不再增加外围 padding，分数以覆盖层显示在 sample 图片中心
- [x] 异常流程通过：长分数保持单行显示，右侧区域继续滚动承载
- [x] 边界条件通过：sample 图片不被 CSS 缩放，仍按自然尺寸展示
- [x] 权限逻辑符合预期：不涉及权限

## UI 验收

- [x] 布局正确：分数标签位于 sample 图片中心
- [x] 文案正确：沿用原有分数文本
- [x] 图片/图标正确：sample 图片恢复无外围 padding
- [x] 状态展示完整：所有 samples 正常展示
- [x] 响应式或分辨率要求满足：Playwright 检查 1366x768，27 分 sample 为 72x72，分数中心偏差为 0px

## Harness 验收

- [x] 类型检查通过：`node_modules\.bin\vue-tsc.CMD --build --force`
- [x] Lint 通过：`node_modules\.bin\eslint.CMD src/App.vue src/components/GameSampleCanvas.vue src/game/renderer/canvas/sample_renderer.ts`
- [x] Format 通过：`node_modules\.bin\prettier.CMD --check src/App.vue src/components/GameSampleCanvas.vue src/game/renderer/canvas/sample_renderer.ts specs/sample-score-overlay/proposal.md specs/sample-score-overlay/spec.md specs/sample-score-overlay/tasks.md`
- [x] Build 通过：`node_modules\.bin\vite.CMD build`
- [x] 浏览器布局检查通过：Vite dev server + Playwright DOM 检查
- [ ] 单元测试通过：不适用，本次为样式和回退调整
- [ ] 关键 flow harness 通过：不适用，本次未改游戏流程

## 问题记录

| 编号 | 级别 | 问题描述 | 状态 |
| ---- | ---- | -------- | ---- |

## 验收结论

- 结论：通过
- 备注：`normal-sample-padding` 过期 spec 和 renderer 测试已删除。
