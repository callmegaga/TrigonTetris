# TrigonTetris

一个基于 Vue 3 + Vite 的几何拼块消除游戏。玩家控制由 `Square`、`BevelledSquare` 相关碎片组成的活动板块下落、拼接、消除，并在溢出时进入 `extend life` 续命判定。

## 开发入口

```sh
pnpm install
pnpm dev
```

## 常用命令

```sh
pnpm build
pnpm lint
pnpm test:unit
```

说明：

- 当前仓库已经配置了 `Vitest`，但还没有完善的自动化测试用例。
- `test/renderer` 目前是手工可视化 harness，不属于 `Vitest` 自动测试。

## 关键文档

- [AGENT.md](/d:/Works/TrigonTetris/AGENT.md)
- [Architecture](/d:/Works/TrigonTetris/docs/architecture.md)
- [Harness](/d:/Works/TrigonTetris/docs/harness.md)
- [SDD Workflow](/d:/Works/TrigonTetris/docs/sdd-workflow.md)
- [Specs README](/d:/Works/TrigonTetris/specs/README.md)
- [Core Gameplay Spec](/d:/Works/TrigonTetris/specs/001-core-gameplay/spec.md)

## 当前工程结构

- `src/game`: 核心规则、状态机、渲染器、方块定义
- `src/components`: Vue 界面层
- `src/utils`: 几何判定、得分、历史分数、音频等工具函数
- `test/renderer`: 手工视觉验证 harness
- `docs`: 架构、harness、SDD 流程文档
- `specs`: 需求规格与模板

## 后续开发约定

涉及游戏规则、状态机、得分、消除、续命逻辑的改动，先更新 `specs/`，再改代码，再补对应 harness 或自动化测试。
