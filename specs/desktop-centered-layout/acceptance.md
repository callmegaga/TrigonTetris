# Acceptance

## 基本信息

- 功能名称：桌面居中棋盘布局
- 对应 Spec：`specs/desktop-centered-layout/spec.md`
- 验收人：Codex
- 验收日期：2026-06-20

## 验收前提

- [x] 代码已合并或可运行：本地工作区可运行，未提交
- [x] 使用的分支和提交已记录：当前工作区未提交，未创建提交
- [x] 相关 mock / 测试数据可用：不涉及 mock
- [x] 设计稿或 UI 分析清单可访问：用户提供布局原则

## 功能验收

- [x] 主流程通过：主页面已拆为左侧信息区、中间棋盘区、右侧 samples 区
- [x] 异常流程通过：侧栏内容过高时允许侧栏内部滚动，不挤压棋盘
- [x] 边界条件通过：棋盘尺寸同时受视口高度和左右侧栏最低宽度约束
- [x] 权限逻辑符合预期：不涉及权限

## UI 验收

- [x] 布局正确：棋盘列使用实际 canvas 宽度，左右列对称占用剩余空间
- [x] 文案正确：不改文案
- [x] 图片/图标正确：samples 使用现有渲染图
- [x] 状态展示完整：左侧包含得分、next、操作示意；右侧只包含 samples
- [x] 响应式或分辨率要求满足：Playwright 检查 1366x768、1440x900、1920x1080、2560x1440，棋盘中心偏差均为 0px

## Harness 验收

- [x] 类型检查通过：`node_modules\.bin\vue-tsc.CMD --build --force`
- [x] Lint 通过：`node_modules\.bin\eslint.CMD src/App.vue src/components/GameSampleCanvas.vue src/components/GameKeyboard.vue`
- [x] Format 通过：`node_modules\.bin\prettier.CMD --check src/App.vue src/components/GameSampleCanvas.vue src/components/GameKeyboard.vue specs/desktop-centered-layout/proposal.md specs/desktop-centered-layout/spec.md specs/desktop-centered-layout/tasks.md`
- [x] Build 通过：`node_modules\.bin\vite.CMD build`
- [x] 浏览器布局检查通过：Vite dev server + Playwright 多桌面视口 DOM 检查
- [ ] 单元测试通过：不适用，本次为布局调整
- [ ] 关键 flow harness 通过：不适用，本次未改流程

## 问题记录

| 编号 | 级别 | 问题描述                                                                 | 状态     |
| ---- | ---- | ------------------------------------------------------------------------ | -------- |
| 1    | P3   | `pnpm exec` / `pnpm build` 在当前无 TTY 环境触发 pnpm 依赖状态检查并中止 | bypassed |

## 验收结论

- 结论：通过
- 备注：使用本地 `node_modules/.bin` 工具完成等价验证；Playwright 中沙箱拦截外部网络资源的错误已过滤，未发现 Vite overlay 或页面脚本错误。
