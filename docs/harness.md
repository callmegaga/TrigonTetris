# Harness

## Current State

当前仓库已经有一个“手工视觉验证” harness：

- [test/renderer/index.html](/d:/Works/TrigonTetris/test/renderer/index.html)
- [test/renderer/main.ts](/d:/Works/TrigonTetris/test/renderer/main.ts)
- [test/renderer/tool.ts](/d:/Works/TrigonTetris/test/renderer/tool.ts)

这个 harness 的用途是：

- 手工构造棋盘
- 渲染出当前效果
- 观察消除、边框、动画等视觉结果

它不适合承担以下职责：

- 自动回归
- 规则断言
- 状态机边界验证

## Harness Layers For This Repo

后续建议维护 3 层 harness。

### 1. Pure Rule Harness

目标：

- 针对纯函数直接断言
- 不依赖 DOM
- 不依赖随机生成

典型对象：

- `getBoardCellValue`
- `checkTileIsFull`
- `findMaxValidSquare`
- `findMaxValidBevelledSquare`
- `calculateSquareScore`

建议位置：

- `src/utils/__tests__/*`
- `src/game/__tests__/*`

### 2. Board Fixture Harness

目标：

- 快速构造特定棋盘场景
- 给多个测试复用
- 消除随机数影响

建议内容：

- `createEmptyBoard()`
- `placeBlock(block, board)`
- `buildBoardFromBlocks(blocks)`
- `createExtendLifeScenario()`
- `createSpreadLightScenario()`

建议位置：

- `test/harness/board.ts`
- `test/harness/fixtures/*`

### 3. Visual Harness

目标：

- 目视检查画布与动画
- 手工验证复杂效果

当前位置：

- `test/renderer/*`

## SDD Expectations

当你修改规则时，不要只改 visual harness。

最低要求应该是：

1. 先写 spec
2. 再给纯规则层补断言
3. 若涉及动画或坐标，再补 visual harness

## Recommended First Automated Harness Backlog

建议先补这些 deterministic case：

- `BoardCell` 两个互补三角是否为满格
- `Perfect BevelledSquare` 内部由两个三角拼满格时应成立
- `Cover BevelledSquare` 内部由两个三角拼满格时应成立
- `ExtendLife` 必须先找 `BevelledSquare cover`
- `MoveBoard` 稳定后是否继续链式消除
- 光芒传播后清除的 block 集合是否正确
