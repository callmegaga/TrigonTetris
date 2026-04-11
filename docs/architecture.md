# Architecture

## Overview

项目当前分为 4 个主要层次：

- Vue UI 层：负责页面、分数、引导、游戏结束提示
- Game 状态机层：负责主循环、状态流转、落地、消除、续命
- Geometry / Rule 层：负责方块碰撞、正方形判定、斜正方形判定、得分计算
- Renderer 层：负责画布渲染、方块消除特效、光芒扩散

## Runtime Flow

主入口在 [src/App.vue](/d:/Works/TrigonTetris/src/App.vue)，核心运行类在 [src/game/game.ts](/d:/Works/TrigonTetris/src/game/game.ts)。

核心状态：

- `NotStart`
- `Active`
- `MoveBoard`
- `ExtendLife`
- `Fail`

高层流程：

1. `Active`
   生成活动块，允许输入控制，按时间下落
2. 落地
   活动块写入 `boards`，转为 `dead_blocks`
3. Perfect 判定
   正常落地后先查 `Perfect BevelledSquare`，再查 `Perfect Square`
4. 消除与光芒
   Perfect 图形消除后再触发上下左右扩散清除
5. `MoveBoard`
   让悬空死块继续下落，直到稳定
6. `ExtendLife`
   当新落地块越过可操作区域时触发，先找 `BevelledSquare cover`，再找 `Square cover`

## Core Data Model

定义位于 [src/game/types.ts](/d:/Works/TrigonTetris/src/game/types.ts)。

- `CellValue`
  表示空格、四种方向的半格三角形、以及满格
- `BoardCell`
  一个棋盘格中可能叠加多个来自不同 `Block` 的碎片
- `Board`
  二维棋盘，每个格子是 `BoardCell`
- `NormalSquare`
  轴对齐正方形
- `BevelledSquare`
  斜正方形

## Why Board Cells Can Hold Multiple Entries

这个项目的核心不是单纯“一个格子只能有一个值”的俄罗斯方块。

一个 `BoardCell` 里可能有：

- 一个满格
- 一个三角形
- 两个互补三角形，几何上构成满格

因此很多规则判断必须基于“几何结果”，而不是只看某个格子数组里有没有字面量 `CellValue.Full`。

## Rule Layer

规则函数主要位于 [src/utils/utils.ts](/d:/Works/TrigonTetris/src/utils/utils.ts)。

关键职责：

- 从 `BoardCell` 合成几何值
- 普通正方形搜索
- 斜正方形搜索
- `Perfect` 与 `Cover` 判定
- 得分计算
- 辅助坐标与光芒范围处理

## Current Harness Layout

- [test/renderer](/d:/Works/TrigonTetris/test/renderer) 是手工视觉 harness
- 当前还缺少自动化规则测试
- `Vitest` 已配置，但尚未形成稳定测试资产

## Recommended Next Test Targets

应优先把规则层做成可断言的 deterministic harness：

- 互补三角是否合成为满格
- `BevelledSquare` 内部满格判定
- `ExtendLife` 搜索顺序
- 光芒清除范围
- 消除后 `MoveBoard` 的状态机流转
