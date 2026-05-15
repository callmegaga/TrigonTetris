# Tasks

## 基本信息

- 功能名称：棋盘垂直辅助线
- 对应 Spec：`specs/board-vertical-guides/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：BOARD-VERTICAL-GUIDES-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录主棋盘垂直辅助线的范围、行为和验收标准。
- 写入范围：`specs/board-vertical-guides/*`
- 读取依赖：`AGENT.md`、`src/game/renderer/canvas/utils.ts`
- 输入：用户需求
- 输出：proposal、spec、tasks
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：BOARD-VERTICAL-GUIDES-2
- 名称：实现主棋盘垂直辅助线
- Owner：Codex
- 说明：在主棋盘背景缓存创建时绘制内部列边界线。
- 写入范围：`src/game/config.ts`、`src/game/renderer/canvas/utils.ts`
- 读取依赖：`src/game/renderer/canvas/renderer.ts`
- 输入：`specs/board-vertical-guides/spec.md`
- 输出：背景 canvas 包含垂直辅助线
- 依赖：任务 1
- 验证命令：`pnpm build`
- 交接产物：代码修改
- 完成标准：构建通过，渲染逻辑只影响主棋盘背景。

### 任务 3

- 任务 ID：BOARD-VERTICAL-GUIDES-3
- 名称：验收记录
- Owner：Codex
- 说明：执行验证命令并记录结果。
- 写入范围：`specs/board-vertical-guides/acceptance.md`
- 读取依赖：`specs/board-vertical-guides/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 2
- 验证命令：`pnpm build`
- 交接产物：验收文档
- 完成标准：验收记录说明通过项和未覆盖项。

## 建议分层

- 规格更新
- canvas 背景实现
- 构建验证
- 验收记录

## 执行约束

- 不修改游戏规则和状态机。
- 不修改下一块预览区和 sample 渲染。
- 不引入运行时每帧额外绘制成本。
