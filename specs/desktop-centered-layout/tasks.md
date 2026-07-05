# Tasks

## 基本信息

- 功能名称：桌面居中棋盘布局
- 对应 Spec：`specs/desktop-centered-layout/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：DESKTOP-CENTERED-LAYOUT-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录桌面居中棋盘布局的目标、范围和验收标准。
- 写入范围：`specs/desktop-centered-layout/*`
- 读取依赖：`AGENT.md`、`src/App.vue`
- 输入：用户布局需求
- 输出：proposal、spec、tasks
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：DESKTOP-CENTERED-LAYOUT-2
- 名称：调整主页面布局
- Owner：Codex
- 说明：将主页面改为左信息区、中棋盘区、右 samples 区，确保棋盘水平居中。
- 写入范围：`src/App.vue`
- 读取依赖：`src/components/GameScore.vue`、`src/components/GameKeyboard.vue`、`src/components/GameSampleCanvas.vue`
- 输入：`specs/desktop-centered-layout/spec.md`
- 输出：新的桌面布局结构和 cell size 计算
- 依赖：任务 1
- 验证命令：`pnpm build`
- 交接产物：代码修改
- 完成标准：构建通过，棋盘布局符合 spec。

### 任务 3

- 任务 ID：DESKTOP-CENTERED-LAYOUT-3
- 名称：调整侧栏组件适配
- Owner：Codex
- 说明：让 samples 和操作示意在新侧栏宽度下更稳定展示。
- 写入范围：`src/components/GameSampleCanvas.vue`、`src/components/GameKeyboard.vue`
- 读取依赖：`src/App.vue`
- 输入：任务 2 布局
- 输出：侧栏组件样式调整
- 依赖：任务 2
- 验证命令：`pnpm build`
- 交接产物：代码修改
- 完成标准：侧栏内容不挤压主棋盘，samples 只出现在右侧。

### 任务 4

- 任务 ID：DESKTOP-CENTERED-LAYOUT-4
- 名称：验证与验收记录
- Owner：Codex
- 说明：执行验证命令并记录布局验收结果。
- 写入范围：`specs/desktop-centered-layout/acceptance.md`
- 读取依赖：`specs/desktop-centered-layout/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 2-3
- 验证命令：`pnpm build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

### 任务 5

- 任务 ID：DESKTOP-CENTERED-LAYOUT-5
- 名称：极矮桌面视口兼容
- Owner：Codex
- 说明：针对 `1272 × 432` inner 视口修正棋盘尺寸计算和左侧紧凑布局，确保棋盘完整显示。
- 写入范围：`src/App.vue`、`src/components/GameScore.vue`、`src/components/GameKeyboard.vue`
- 读取依赖：`specs/desktop-centered-layout/spec.md`
- 输入：用户反馈的环境信息
- 输出：极矮桌面视口兼容样式和 cell size 计算
- 依赖：任务 1-4
- 验证命令：`node_modules\.bin\vue-tsc.CMD --build --force`、`node_modules\.bin\eslint.CMD src\App.vue src\components\GameScore.vue src\components\GameKeyboard.vue`、`node_modules\.bin\vite.CMD build`
- 交接产物：代码修改与验收记录
- 完成标准：`1272 × 432` inner 视口下棋盘完整显示且主文档不滚动。

### 任务 6

- 任务 ID：DESKTOP-CENTERED-LAYOUT-6
- 名称：窗口 resize 后重算布局
- Owner：Codex
- 说明：监听浏览器窗口尺寸变化，按帧节流更新布局尺寸，并同步重绘棋盘、next 和 samples。
- 写入范围：`src/App.vue`、`src/game/game.ts`、`src/components/GameSampleCanvas.vue`
- 读取依赖：`src/game/renderer/canvas/renderer.ts`、`src/game/renderer/canvas/next_renderer.ts`
- 输入：用户 resize 兼容需求
- 输出：窗口调整大小后的动态布局和 canvas 重绘
- 依赖：任务 5
- 验证命令：`node_modules\.bin\vue-tsc.CMD --build --force`、`node_modules\.bin\eslint.CMD src\App.vue src\game\game.ts src\components\GameSampleCanvas.vue`、`node_modules\.bin\vite.CMD build`
- 交接产物：代码修改与验收记录
- 完成标准：窗口 resize 后棋盘、next、samples 使用新 cell size 渲染，游戏状态不被重置。

## 建议分层

- 规格更新
- 主布局实现
- 侧栏组件适配
- 极矮桌面视口兼容
- 窗口 resize 后重算布局
- 构建与视觉验证
- 验收记录

## 执行约束

- 不修改游戏规则和渲染器逻辑。
- 不修改 sample 数据。
- resize 时只重建渲染器和 canvas，不重建游戏实例或游戏状态。
- 共享文件由 Codex 统一收口。
