# Tasks

## 基本信息

- 功能名称：Samples 使用棋盘同尺寸格子
- 对应 Spec：`specs/sample-board-cell-size/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：SAMPLE-BOARD-CELL-SIZE-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录 samples 使用主棋盘 cell size 的行为和验收标准。
- 写入范围：`specs/sample-board-cell-size/*`
- 读取依赖：`AGENT.md`、`src/App.vue`、`src/components/GameSampleCanvas.vue`
- 输入：用户需求
- 输出：proposal、spec、tasks
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：SAMPLE-BOARD-CELL-SIZE-2
- 名称：传入并使用棋盘 cell size
- Owner：Codex
- 说明：`App.vue` 向 `GameSampleCanvas` 传入 `cell_size`，组件用该值创建 `SampleRenderer`。
- 写入范围：`src/App.vue`、`src/components/GameSampleCanvas.vue`
- 读取依赖：`src/game/renderer/canvas/sample_renderer.ts`
- 输入：`specs/sample-board-cell-size/spec.md`
- 输出：samples 使用主棋盘 cell size 渲染
- 依赖：任务 1
- 验证命令：`node_modules\\.bin\\vue-tsc.CMD --build --force`
- 交接产物：代码修改
- 完成标准：type-check 通过。

### 任务 3

- 任务 ID：SAMPLE-BOARD-CELL-SIZE-3
- 名称：取消 sample 图片缩放
- Owner：Codex
- 说明：移除 sample 图片固定宽度和最大宽度，让图片以自然尺寸显示，右侧区域负责滚动。
- 写入范围：`src/components/GameSampleCanvas.vue`、`src/App.vue`
- 读取依赖：任务 2
- 输入：`specs/sample-board-cell-size/spec.md`
- 输出：sample 图片不再被 CSS 缩放
- 依赖：任务 2
- 验证命令：浏览器 DOM 检查
- 交接产物：样式修改
- 完成标准：sample `clientWidth` 等于 `naturalWidth`。

### 任务 4

- 任务 ID：SAMPLE-BOARD-CELL-SIZE-4
- 名称：验证与验收记录
- Owner：Codex
- 说明：执行验证命令并填写验收记录。
- 写入范围：`specs/sample-board-cell-size/acceptance.md`
- 读取依赖：`specs/sample-board-cell-size/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 2-3
- 验证命令：`node_modules\\.bin\\vite.CMD build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

## 建议分层

- 规格更新
- Props 接入
- 样式调整
- 构建与浏览器验证
- 验收记录

## 执行约束

- 不修改 sample 数据。
- 不缩放 sample 图片。
- 不修改主棋盘渲染逻辑。
- 不引入持续 resize 重建逻辑。
