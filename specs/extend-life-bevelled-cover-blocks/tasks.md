# Tasks

## 基本信息

- 功能名称：续命阶段斜正方形 Cover block 收集修复
- 对应 Spec：`specs/extend-life-bevelled-cover-blocks/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：BUG-EXTEND-LIFE-BEVELLED-COVER-BLOCKS-1
- 名称：定位 BevelledSquare cover block 收集问题
- Owner：Codex
- 说明：检查 `ExtendLife`、`findMaxValidBevelledSquare`、`getBevelledSquareColorsAndBlocks` 的数据流。
- 写入范围：无
- 读取依赖：`src/game/game.ts`、`src/utils/utils.ts`
- 输入：用户反馈与核心玩法基线
- 输出：问题定位结论
- 依赖：无
- 验证命令：无
- 交接产物：定位说明
- 完成标准：明确导致 block 漏收集的代码路径

### 任务 2

- 任务 ID：BUG-EXTEND-LIFE-BEVELLED-COVER-BLOCKS-2
- 名称：修复参与 block 收集逻辑
- Owner：Codex
- 说明：让 `BevelledSquare cover` 收集所有参与 cover 几何成立的 block。
- 写入范围：`src/utils/utils.ts`
- 读取依赖：`src/game/types.ts`
- 输入：任务 1 结论
- 输出：代码修复
- 依赖：任务 1
- 验证命令：`pnpm exec vitest run`
- 交接产物：修改文件列表
- 完成标准：新增测试通过，既有 square 行为不回归

### 任务 3

- 任务 ID：BUG-EXTEND-LIFE-BEVELLED-COVER-BLOCKS-3
- 名称：补充测试与验收记录
- Owner：Codex
- 说明：新增或更新单元测试并填写 `acceptance.md`。
- 写入范围：`src/**/__tests__/*`、`specs/extend-life-bevelled-cover-blocks/acceptance.md`
- 读取依赖：`specs/extend-life-bevelled-cover-blocks/spec.md`
- 输入：修复代码
- 输出：测试与验收记录
- 依赖：任务 2
- 验证命令：`pnpm build`
- 交接产物：测试结果和验收结论
- 完成标准：相关验证通过或记录阻塞原因

## 建议分层

- 规格更新
- 规则层修复
- 测试与 harness
- 验收与文档

## 执行约束

- 每个任务都必须能独立验证。
- 实现不得改变续命搜索顺序。
- 标红、清除和特效必须使用同一组 block。
- 共享文件由 Codex 统一收口。
