# Tasks

## 基本信息

- 功能名称：Perfect 得分公式调整
- 对应 Spec：`specs/perfect-score-formula/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：GAME-PERFECT-SCORE-FORMULA-1
- 名称：新增得分公式测试
- Owner：Codex
- 说明：新增单元测试覆盖普通正方形、斜正方形和 Cover 得分。
- 写入范围：`src/utils/__tests__/*`
- 读取依赖：`src/utils/utils.ts`、`src/game/types.ts`
- 输入：`specs/perfect-score-formula/spec.md`
- 输出：失败的单元测试
- 依赖：无
- 验证命令：`pnpm exec vitest run src\utils\__tests__\score.test.ts`
- 交接产物：测试文件
- 完成标准：测试在旧公式下失败

### 任务 2

- 任务 ID：GAME-PERFECT-SCORE-FORMULA-2
- 名称：实现统一得分公式
- Owner：Codex
- 说明：修改 `calculateSquareScore`，让普通正方形和斜正方形统一使用新公式。
- 写入范围：`src/utils/utils.ts`
- 读取依赖：`src/game/types.ts`
- 输入：任务 1 测试
- 输出：规则层实现
- 依赖：任务 1
- 验证命令：`pnpm exec vitest run src\utils\__tests__\score.test.ts`
- 交接产物：修改文件列表
- 完成标准：得分公式测试通过

### 任务 3

- 任务 ID：GAME-PERFECT-SCORE-FORMULA-3
- 名称：同步示例分数与文档
- Owner：Codex
- 说明：重算 `src/utils/sample.ts` 中展示分数，并更新核心玩法基线。
- 写入范围：`src/utils/sample.ts`、`docs/architecture/gameplay.md`
- 读取依赖：`src/utils/utils.ts`
- 输入：新公式
- 输出：示例分数和文档
- 依赖：任务 2
- 验证命令：`pnpm test:unit -- run`
- 交接产物：修改文件列表
- 完成标准：示例分数与新公式一致

### 任务 4

- 任务 ID：GAME-PERFECT-SCORE-FORMULA-4
- 名称：验收与验证
- Owner：Codex
- 说明：执行验证命令并填写 `acceptance.md`。
- 写入范围：`specs/perfect-score-formula/acceptance.md`
- 读取依赖：`specs/perfect-score-formula/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 1-3
- 验证命令：`pnpm test:unit -- run`、`pnpm type-check`、`pnpm lint`、`pnpm build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因

## 建议分层

- 规则层得分公式
- 示例数据同步
- 文档与验收

## 执行约束

- `Cover` 必须继续不得分。
- 不改变图形识别、清除和动画逻辑。
- 不迁移或清空历史最高分。
- 共享文件由 Codex 统一收口。
