# Tasks

## 基本信息

- 功能名称：Perfect 清除后仅保留横向 SpreadLight
- 对应 Spec：`specs/horizontal-spread-light/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：GAME-HORIZONTAL-SPREAD-LIGHT-1
- 名称：新增横向光带清除范围测试
- Owner：Codex
- 说明：在规则层新增单元测试，覆盖普通正方形和斜正方形的横向光带 block 收集。
- 写入范围：`src/utils/__tests__/*`
- 读取依赖：`src/utils/utils.ts`、`src/game/types.ts`
- 输入：`specs/horizontal-spread-light/spec.md`
- 输出：失败的单元测试
- 依赖：无
- 验证命令：`pnpm exec vitest run src\utils\__tests__\spread-light-blocks.test.ts`
- 交接产物：测试文件
- 完成标准：测试在实现前因函数缺失或旧行为失败

### 任务 2

- 任务 ID：GAME-HORIZONTAL-SPREAD-LIGHT-2
- 名称：实现横向光带 block 收集纯函数
- Owner：Codex
- 说明：将 SpreadLight 清除范围迁移到规则层纯函数，并只返回横向光带覆盖的 block。
- 写入范围：`src/utils/utils.ts`、`src/game/game.ts`
- 读取依赖：`src/game/types.ts`
- 输入：任务 1 测试
- 输出：规则层实现和 `Game` 接入
- 依赖：任务 1
- 验证命令：`pnpm exec vitest run src\utils\__tests__\spread-light-blocks.test.ts`
- 交接产物：修改文件列表
- 完成标准：横向清除范围测试通过

### 任务 3

- 任务 ID：GAME-HORIZONTAL-SPREAD-LIGHT-3
- 名称：调整 SpreadLight 动画为仅左右扩散
- Owner：Codex
- 说明：删除或停用上下光芒矩形，只绘制并更新左右横向光芒。
- 写入范围：`src/game/renderer/canvas/effect.ts`
- 读取依赖：`src/game/renderer/canvas/renderer.ts`
- 输入：`specs/horizontal-spread-light/spec.md`
- 输出：动画实现
- 依赖：任务 2
- 验证命令：`pnpm build`
- 交接产物：修改文件列表
- 完成标准：构建通过，动画代码不再绘制上下光芒

### 任务 4

- 任务 ID：GAME-HORIZONTAL-SPREAD-LIGHT-4
- 名称：更新文档与验收记录
- Owner：Codex
- 说明：同步核心玩法基线并填写验收记录。
- 写入范围：`docs/architecture/gameplay.md`、`specs/horizontal-spread-light/acceptance.md`
- 读取依赖：`specs/horizontal-spread-light/spec.md`
- 输入：实现和验证结果
- 输出：文档更新与验收记录
- 依赖：任务 1-3
- 验证命令：`pnpm test:unit -- run`、`pnpm type-check`、`pnpm lint`、`pnpm build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因

## 建议分层

- 规则层横向清除范围
- Game 状态机接入
- Canvas 动画方向
- 测试与文档验收

## 执行约束

- 视觉动画方向必须与实际清除范围一致。
- 不改变 `Perfect` 图形识别规则。
- 不改变 `Cover` 规则。
- 不改变得分公式。
- 共享文件由 Codex 统一收口。
