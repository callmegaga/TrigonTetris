# AGENT.md

## Scope

本文件约束在本仓库内工作的开发者或代码代理，目标是让后续改动统一遵循当前工程结构、harness 方式和 Spec-Driven Development, SDD 流程。

## Product Summary

这是一个类似俄罗斯方块的几何拼块游戏，但核心单元不是纯矩形，而是：

- 满格 `Square`
- 斜正方形相关的半格三角形组合 `BevelledSquare`

核心玩法：

- 游戏在 `Active` 阶段按概率生成活动板块 `Active Block`
- 玩家控制活动板块下落、移动、旋转、翻转、速降
- 落地后 `Active Block` 转为 `dead block`
- 若形成 `Perfect Square` 或 `Perfect BevelledSquare`，则得分并消除
- `Perfect` 消除后会向上下左右发出与该图形同宽的光芒，覆盖到的 `Block` 也会被整体清除
- 若落地位置越过可操作区域，则进入 `ExtendLife`
- `ExtendLife` 先找 `BevelledSquare cover`，找不到再找 `Square cover`
- 若没有任何合法 `cover`，游戏结束

## Non-Negotiable Rule Baseline

除非 `specs/` 先更新并明确批准，否则不要擅自改变以下规则：

- `Perfect BevelledSquare` 必须几何上恰好构成斜正方形
- `Perfect BevelledSquare` 的边框必须包含指定方向的三角形
- 边框格允许同时有两个三角形，只要包含指定三角形即可
- `Perfect BevelledSquare` 的内部必须是满格
- 内部满格允许由两个互补三角形拼成
- `ExtendLife` 搜索顺序固定为：
  1. `BevelledSquare cover`
  2. `Square cover`
  3. 否则 `Fail`

## Repo Map

- `src/game/game.ts`: 主状态机与循环
- `src/game/types.ts`: 领域类型、状态、格子枚举
- `src/game/blocks/*`: 各种方块定义与通用 `Block`
- `src/game/renderer/*`: 画布渲染与效果
- `src/utils/utils.ts`: 几何判定、得分、辅助工具
- `src/App.vue`: 应用入口与 UI 组装
- `test/renderer/*`: 手工视觉 harness

## Harness Strategy

当前仓库存在 3 层验证方式：

1. 纯规则测试
   目标：验证几何判定、状态转换、得分、清除范围
   推荐位置：`src/**/*.test.ts` 或 `src/**/__tests__/*`

2. 规则夹具 / board harness
   目标：构建可复现棋盘、死块、活动块场景，给单元测试和规则测试复用
   推荐位置：`test/harness/*` 或 `src/game/__tests__/helpers/*`

3. 手工视觉 harness
   当前已有：`test/renderer`
   用途：目视检查渲染和动画
   限制：不能替代自动化断言

## Required SDD Workflow

只要改动涉及游戏规则、状态机、消除逻辑、得分逻辑、续命逻辑、输入语义，必须遵循：

1. 先读相关 spec
2. 若需求变化，先改 `specs/`
3. 写清楚 acceptance scenarios
4. 再改代码
5. 增加或更新对应 harness / 自动化测试
6. 最后跑最小必要验证

## Spec Update Policy

以下改动必须更新 spec：

- 新增或修改方块形状
- 修改 `Perfect` 或 `Cover` 判定
- 修改光芒清除范围
- 修改 `ExtendLife` 触发条件或搜索顺序
- 修改计分公式
- 修改状态机流转

## Implementation Checklist

提交前至少检查：

- 规则改动是否已写入 `specs/`
- `docs/architecture.md` 是否仍然准确
- 新逻辑是否可由确定性输入复现，不依赖随机数
- `pnpm build` 是否通过
- 若有新增测试，`pnpm test:unit` 是否通过

## Testing Priorities

优先补以下自动化测试，而不是先补 UI 测试：

- `getBoardCellValue`
- `checkBevelledSquaresValid`
- `checkBevelledSquaresPerfect`
- `findMaxValidSquare`
- `findMaxValidBevelledSquare`
- `calculateSquareScore`
- `findBlocksInSpreadLight`
- `moveDeadBlocksFall`
- `ExtendLife` 搜索顺序与失败条件

## Editing Guidance

- 规则逻辑优先抽到纯函数，便于测试
- 避免把规则写死在渲染层
- 随机生成逻辑要能被 deterministic fixture 绕开
- 如果发现当前实现与 spec 不一致，先修 spec 还是先修代码，必须在变更说明里讲清楚
