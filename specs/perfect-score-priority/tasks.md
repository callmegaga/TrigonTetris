# Tasks

## 基本信息

- 功能名称：Perfect 按得分最高优先
- 对应 Spec：`specs/perfect-score-priority/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：PERFECT-SCORE-PRIORITY-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录得分最高优先的范围、平分规则和非目标。
- 写入范围：`specs/perfect-score-priority/*`
- 读取依赖：`AGENT.md`、`src/game/game.ts`、`src/utils/utils.ts`
- 输入：用户需求
- 输出：proposal、spec、tasks
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：PERFECT-SCORE-PRIORITY-2
- 名称：新增 Perfect 选择测试
- Owner：Codex
- 说明：覆盖普通正方形高分优先、斜正方形高分优先、平分时沿用几何优先级。
- 写入范围：`src/utils/__tests__/perfect-selection.test.ts`
- 读取依赖：`src/utils/utils.ts`、`src/game/types.ts`
- 输入：`specs/perfect-score-priority/spec.md`
- 输出：失败或可验证的单元测试
- 依赖：任务 1
- 验证命令：`pnpm exec vitest run src/utils/__tests__/perfect-selection.test.ts`
- 交接产物：测试文件
- 完成标准：测试覆盖新选择函数的核心行为。

### 任务 3

- 任务 ID：PERFECT-SCORE-PRIORITY-3
- 名称：实现得分最高优先选择
- Owner：Codex
- 说明：新增统一 Perfect 候选选择函数，并让正常落地后调用该函数。
- 写入范围：`src/utils/utils.ts`、`src/game/game.ts`
- 读取依赖：`src/utils/__tests__/perfect-selection.test.ts`
- 输入：任务 2 测试
- 输出：按得分最高选择 Perfect 候选
- 依赖：任务 2
- 验证命令：`pnpm exec vitest run src/utils/__tests__/perfect-selection.test.ts`
- 交接产物：代码修改
- 完成标准：focused unit test 通过。

### 任务 4

- 任务 ID：PERFECT-SCORE-PRIORITY-4
- 名称：验证与验收记录
- Owner：Codex
- 说明：执行验证命令并填写验收记录。
- 写入范围：`specs/perfect-score-priority/acceptance.md`
- 读取依赖：`specs/perfect-score-priority/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 3
- 验证命令：`pnpm build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

## 建议分层

- 规格更新
- Rule 层测试
- Rule 层实现
- Game 状态机接入
- 验证与验收

## 执行约束

- 不修改 `Cover` 搜索优先级。
- 不修改 `MoveBoard` 阶段的斜正方形扫描行为。
- 不修改 Perfect 得分公式。
- 共享文件由 Codex 统一收口。
