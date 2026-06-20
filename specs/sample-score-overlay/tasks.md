# Tasks

## 基本信息

- 功能名称：Sample 分数居中覆盖
- 对应 Spec：`specs/sample-score-overlay/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：SAMPLE-SCORE-OVERLAY-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录回退外围格子和分数居中覆盖的行为。
- 写入范围：`specs/sample-score-overlay/*`
- 读取依赖：`AGENT.md`、`src/components/GameSampleCanvas.vue`
- 输入：用户需求
- 输出：proposal、spec、tasks
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：SAMPLE-SCORE-OVERLAY-2
- 名称：回退 normal sample padding
- Owner：Codex
- 说明：移除 sample renderer padding 支持和 normal sample padding 判断。
- 写入范围：`src/game/renderer/canvas/sample_renderer.ts`、`src/components/GameSampleCanvas.vue`
- 读取依赖：`specs/sample-score-overlay/spec.md`
- 输入：任务 1 spec
- 输出：sample 恢复无外围 padding
- 依赖：任务 1
- 验证命令：`node_modules\\.bin\\vue-tsc.CMD --build --force`
- 交接产物：代码修改
- 完成标准：normal sample 图片尺寸恢复为原始 blocks 边界。

### 任务 3

- 任务 ID：SAMPLE-SCORE-OVERLAY-3
- 名称：分数居中覆盖
- Owner：Codex
- 说明：将分数文本绝对定位到 sample 图片中心，并用半透明背景保证可读性。
- 写入范围：`src/components/GameSampleCanvas.vue`
- 读取依赖：任务 2
- 输入：用户需求
- 输出：居中覆盖的 sample 分数
- 依赖：任务 2
- 验证命令：浏览器 DOM 检查
- 交接产物：样式修改
- 完成标准：分数中心接近图片中心，图片不缩放。

### 任务 4

- 任务 ID：SAMPLE-SCORE-OVERLAY-4
- 名称：验证与验收记录
- Owner：Codex
- 说明：执行验证命令并填写验收记录。
- 写入范围：`specs/sample-score-overlay/acceptance.md`
- 读取依赖：`specs/sample-score-overlay/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 2-3
- 验证命令：`node_modules\\.bin\\vite.CMD build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

## 建议分层

- 规格更新
- 回退过期实现
- 样式调整
- 构建与浏览器验证
- 验收记录

## 执行约束

- 不修改 sample 数据。
- 不缩放 sample 图片。
- 不修改主棋盘布局。
- 不保留 normal sample padding 过期 spec。
