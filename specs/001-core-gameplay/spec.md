# Core Gameplay Spec

## Background

本规格定义当前版本游戏的核心玩法与规则边界，作为后续 SDD 开发的基线。

## Goal

- 固化当前游戏状态机与核心几何规则
- 为后续重构、补测试、修 bug 提供统一依据

## Non-Goals

- 不规定具体 UI 排版
- 不规定美术表现细节
- 不规定动画时长的最终数值

## Terms

- `Active Block`: 正在由玩家控制并持续下落的方块
- `dead block`: 已经写入棋盘、不再受玩家直接控制的方块
- `BoardCell`: 棋盘中的一个格子，可包含多个碎片
- `Perfect Square`: 几何上恰好构成的轴对齐正方形
- `Perfect BevelledSquare`: 几何上恰好构成的斜正方形
- `Cover`: 在 `ExtendLife` 阶段使用的较宽松判定
- `Spread Light`: Perfect 消除后向上下左右扩散的清除光芒

## State Machine

1. 游戏开始后进入 `Active`
2. 若当前没有活动块，则生成新的 `Active Block`
3. 玩家在 `Active` 阶段可移动、旋转、翻转、速降
4. 当 `Active Block` 无法继续下落时，写入 `boards`，转为 `dead block`
5. 若落地位置越过可操作区域，则进入 `ExtendLife`
6. 否则执行 Perfect 判定
7. Perfect 消除或 Cover 消除后进入 `MoveBoard`
8. `MoveBoard` 负责让悬空死块继续下落直到稳定
9. 当没有合法续命 cover 时，进入 `Fail`

## Shape And Cell Rules

1. 棋盘格允许存放多个碎片
2. 一个格子的几何结果由其中所有碎片共同决定
3. 两个互补三角形可以几何上组成一个满格
4. 很多规则应基于“几何结果是否为满格”，而不是只看是否存在字面量 `CellValue.Full`

## Perfect Square Rules

1. `Perfect Square` 必须几何上构成完整轴对齐正方形
2. 图形必须满足有效性约束
3. 参与该 `Perfect Square` 的 block 必须整体位于该正方形内

## Perfect BevelledSquare Rules

1. `Perfect BevelledSquare` 必须几何上恰好构成斜正方形
2. 边框必须包含指定方向的三角形
3. 边框格可以同时有两个三角形，只要包含指定三角形即可
4. 内部格必须几何上是满格
5. 内部满格允许由两个互补三角形拼成

## Cover Rules

1. `ExtendLife` 阶段先搜索 `BevelledSquare cover`
2. 若未命中，再搜索 `Square cover`
3. 若都未命中，则游戏结束
4. `Cover` 命中时会清除参与该 cover 的 block
5. `Cover` 不得分，或当前版本得分为 0

## Perfect Resolution Rules

1. 命中 `Perfect Square` 或 `Perfect BevelledSquare` 时，先清除组成该图形的 block
2. 然后从该图形向上下左右发出同宽光芒
3. 被光芒覆盖到的 block 整体清除
4. 清除完成后进入 `MoveBoard`

## MoveBoard Rules

1. `MoveBoard` 应使悬空 `dead block` 尽可能继续下落
2. 直到棋盘稳定前，不应重新生成新的 `Active Block`
3. 稳定后才允许进入下一轮判定或恢复 `Active`

## Acceptance Scenarios

### Scenario 1: Perfect bevelled square with full interior from two triangles

- Given: 一个斜正方形内部格由两个互补三角组成
- When: 执行 `Perfect BevelledSquare` 判定
- Then: 该内部格应视为满格

### Scenario 2: Extend life search order

- Given: 棋盘越界且同时存在 `BevelledSquare cover` 和 `Square cover`
- When: 进入 `ExtendLife`
- Then: 必须优先命中 `BevelledSquare cover`

### Scenario 3: Perfect clear spread light

- Given: 一个合法 `Perfect` 图形已经被识别
- When: 执行消除
- Then: 先清除组成图形的 block，再按上下左右同宽光芒清除覆盖到的 block

### Scenario 4: MoveBoard stability

- Given: 一次消除导致多个死块悬空
- When: 进入 `MoveBoard`
- Then: 这些死块应持续下落直到稳定后再进入下一阶段

## Verification

- `pnpm build`
- 规则层 `Vitest`
- 必要时使用 `test/renderer` 做可视化确认

## Open Questions

- `MoveBoard` 稳定后是否应重新扫描 `Perfect BevelledSquare` 连锁，目前需要以实现与设计继续对齐
- `BevelledSquare` 边框格存在两个来自不同 block 的三角时，计分和清除是否都应覆盖两个 block，需要在后续 spec 中进一步细化
