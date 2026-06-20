# Acceptance

## 基本信息

- 功能名称：Samples 使用棋盘同尺寸格子
- 对应 Spec：`specs/sample-board-cell-size/spec.md`
- 验收人：Codex
- 验收日期：2026-06-20

## 验收前提

- [x] 代码已合并或可运行：本地工作区可运行，未提交
- [x] 使用的分支和提交已记录：当前工作区未提交，未创建提交
- [x] 相关 mock / 测试数据可用：不涉及 mock
- [x] 设计稿或 UI 分析清单可访问：用户要求 samples 使用棋盘相同 cell size

## 功能验收

- [x] 主流程通过：`App.vue` 将主棋盘 `cell_size` 传入 `GameSampleCanvas`
- [x] 异常流程通过：`GameSampleCanvas` 未传入 `cellSize` 时默认使用 30
- [x] 边界条件通过：右侧 samples 使用 flex wrap 排布，图片不缩放，区域负责滚动
- [x] 权限逻辑符合预期：不涉及权限

## UI 验收

- [x] 布局正确：samples 位于右侧区域并按原始尺寸多行换行
- [x] 文案正确：不改文案
- [x] 图片/图标正确：sample 图片显示尺寸等于自然尺寸
- [x] 状态展示完整：samples 挂载后展示所有 11 个示例
- [x] 响应式或分辨率要求满足：Playwright 检查 1366x768、1920x1080、2560x1440，sample 图片 `clientWidth/clientHeight` 均等于 `naturalWidth/naturalHeight`

## Harness 验收

- [x] 类型检查通过：`node_modules\.bin\vue-tsc.CMD --build --force`
- [x] Lint 通过：`node_modules\.bin\eslint.CMD src/App.vue src/components/GameSampleCanvas.vue`
- [x] Format 通过：`node_modules\.bin\prettier.CMD --check src/App.vue src/components/GameSampleCanvas.vue specs/sample-board-cell-size/proposal.md specs/sample-board-cell-size/spec.md specs/sample-board-cell-size/tasks.md`
- [x] Build 通过：`node_modules\.bin\vite.CMD build`
- [x] 浏览器布局检查通过：Vite dev server + Playwright 多桌面视口 DOM 检查
- [ ] 单元测试通过：不适用，本次为布局与渲染尺寸接入
- [ ] 关键 flow harness 通过：不适用，本次未改游戏流程

## 问题记录

| 编号 | 级别 | 问题描述 | 状态 |
| ---- | ---- | -------- | ---- |

## 验收结论

- 结论：通过
- 备注：samples 不再通过 CSS 缩放，右侧区域承载换行和滚动。
