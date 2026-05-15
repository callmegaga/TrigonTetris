# Tasks

## 基本信息

- 功能名称：新增 Sample 得分示例
- 对应 Spec：`specs/sample-score-examples/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：SAMPLE-SCORE-EXAMPLES-1
- 名称：新增 sample 分数测试
- Owner：Codex
- 说明：更新 `sample-scores.test.ts`，让测试先要求出现 27 分和 6,400,000 分，并验证每个 sample 可被 perfect 识别。
- 写入范围：`src/utils/__tests__/sample-scores.test.ts`
- 读取依赖：`src/utils/sample.ts`、`src/utils/utils.ts`
- 输入：`specs/sample-score-examples/spec.md`
- 输出：失败的单元测试
- 依赖：无
- 验证命令：`pnpm exec vitest run src/utils/__tests__/sample-scores.test.ts`
- 交接产物：测试文件
- 完成标准：测试在实现前因缺少新增 sample 而失败。

### 任务 2

- 任务 ID：SAMPLE-SCORE-EXAMPLES-2
- 名称：复原并实现新增 samples
- Owner：Codex
- 说明：根据用户截图和规则函数复原 27 分、6,400,000 分两个 perfect sample，并加入 `getSampleBlocks()`。
- 写入范围：`src/utils/sample.ts`
- 读取依赖：`src/game/blocks/*`、`src/utils/utils.ts`
- 输入：任务 1 测试、用户截图
- 输出：新增 sample 数据
- 依赖：任务 1
- 验证命令：`pnpm exec vitest run src/utils/__tests__/sample-scores.test.ts`
- 交接产物：修改文件列表
- 完成标准：focused unit test 通过。

### 任务 3

- 任务 ID：SAMPLE-SCORE-EXAMPLES-3
- 名称：验收记录
- Owner：Codex
- 说明：执行验证命令并填写验收记录。
- 写入范围：`specs/sample-score-examples/acceptance.md`
- 读取依赖：`specs/sample-score-examples/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 1-2
- 验证命令：`pnpm exec vitest run src/utils/__tests__/sample-scores.test.ts`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

## 建议分层

- 规格更新
- 测试更新
- sample 数据实现
- 验收记录

## 执行约束

- 不修改得分公式。
- 不修改主游戏状态机。
- 不修改 sample 渲染组件样式。
- 共享文件由 Codex 统一收口。
