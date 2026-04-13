# 核心玩法基线

## 定位

本文件记录当前版本已经稳定采用的核心玩法、状态机和几何规则。

它描述的是“系统现在是什么”。
如果后续要新增或修改需求，先在 `specs/` 写规格；需求完成并稳定后，再把结果回写到本文件。

## 目标

- 固化当前游戏状态机与核心几何规则
- 为后续重构、补测试、修 bug 提供统一依据

## 非目标

- 不规定具体 UI 排版
- 不规定美术表现细节
- 不规定动画时长的最终数值

## 术语

- `Active Block`: 正在由玩家控制并持续下落的方块
- `dead block`: 已经写入棋盘、不再受玩家直接控制的方块
- `BoardCell`: 棋盘中的一个格子，可包含多个碎片
- `Perfect Square`: 几何上恰好构成的轴对齐正方形
- `Perfect BevelledSquare`: 几何上恰好构成的斜正方形
- `Cover`: 在 `ExtendLife` 阶段使用的较宽松判定
- `Spread Light`: Perfect 消除后向上下左右扩散的清除光芒

## 核心玩法循环

- 游戏开始后进入 `Active`
- 若当前没有活动块，则生成新的 `Active Block`
- 玩家在 `Active` 阶段可移动、旋转、翻转、速降
- 当 `Active Block` 无法继续下落时，写入棋盘并转为 `dead block`
- 若落地位置越过可操作区域，则进入 `ExtendLife`
- 否则执行图形判定与清除
- 清除后进入 `MoveBoard`
- 当棋盘稳定后，回到下一轮 `Active`
- 若 `ExtendLife` 找不到合法 cover，则进入 `Fail`

## 状态机基线

当前主要状态：

- `NotStart`
- `Active`
- `MoveBoard`
- `ExtendLife`
- `Fail`

稳定流转：

1. `NotStart` -> `Active`
2. `Active` -> 落地写盘
3. 越界时 `Active` -> `ExtendLife`
4. 命中清理后进入 `MoveBoard`
5. `MoveBoard` 稳定后回到 `Active`
6. `ExtendLife` 无解时进入 `Fail`

## 棋盘与几何模型

- 棋盘中的一个格子是 `BoardCell`
- 一个 `BoardCell` 可以包含多个碎片
- 一个格子的几何结果由其中所有碎片共同决定
- 规则判断基于几何合成结果，而不是只看单个碎片字面值
- 两个互补三角形可以几何上组成一个满格

因此很多规则必须基于“格子是否几何上为满格”来判断。

## 图形类型

- `Square`: 轴对齐正方形
- `BevelledSquare`: 斜正方形
- `Perfect Square`: 几何上恰好成立的轴对齐正方形
- `Perfect BevelledSquare`: 几何上恰好成立的斜正方形
- `Cover`: `ExtendLife` 阶段使用的较宽松判定

## Perfect Square 基线

- `Perfect Square` 必须几何上构成完整轴对齐正方形
- 图形必须满足有效性约束
- 参与该图形的 block 必须整体落在该图形覆盖范围内

## Perfect BevelledSquare 基线

- `Perfect BevelledSquare` 必须几何上恰好构成斜正方形
- 边框必须包含指定方向的三角形
- 边框格允许同时存在两个三角形，只要包含指定方向即可
- 内部格必须几何上是满格
- 内部满格允许由两个互补三角形拼成

## ExtendLife 基线

- 当落地结果越过可操作区域时，进入 `ExtendLife`
- 搜索顺序固定为：
  1. `BevelledSquare cover`
  2. `Square cover`
  3. 若都不存在则 `Fail`
- `Cover` 命中时清除参与该 cover 的 block
- 当前版本 `Cover` 不作为常规得分来源

## 清除与扩散基线

- 命中 `Perfect Square` 或 `Perfect BevelledSquare` 时，先清除组成图形的 block
- 然后从该图形向上下左右发出与图形同宽的扩散光芒
- 被光芒覆盖到的 block 会被整体清除
- 清除完成后进入 `MoveBoard`

## MoveBoard 基线

- `MoveBoard` 负责让悬空 `dead block` 持续下落直到稳定
- 棋盘未稳定前，不应生成新的 `Active Block`
- 稳定后才进入下一轮游戏推进

## 验收场景

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

## 已知待确认点

- `MoveBoard` 稳定后是否应重新扫描 `Perfect BevelledSquare` 连锁，需要持续与实现保持对齐
- `BevelledSquare` 边框格存在两个来自不同 block 的三角时，计分和清除是否都应覆盖两个 block，后续需要更细化需求规格

## 代码映射

主要实现位置：

- `src/game/game.ts`
- `src/game/types.ts`
- `src/game/blocks/*`
- `src/utils/utils.ts`
- `src/game/renderer/*`

## 变更方式

如果要修改本文件中的稳定基线：

1. 先在 `specs/` 写需求或变更规格
2. 再改代码与测试 / harness
3. 交付完成后，把最终稳定结果回写到本文件
