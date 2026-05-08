# TrigonTetris

一个基于 Vue 3 + Vite 的几何拼块消除游戏。玩家控制由 `Square`、`BevelledSquare` 相关碎片组成的活动板块下落、拼接、消除，并在溢出时进入 `extend life` 续命判定。

## 开发入口

```sh
pnpm install
pnpm dev
vercel dev
```

## 常用命令

```sh
pnpm type-check
pnpm build
pnpm lint
pnpm test:unit
pnpm test:e2e
```

说明：

- 当前仓库已经配置了 `Vitest`，已有规则层单元测试位于 `src/**/__tests__/*`。
- 当前仓库已经配置了 `Playwright`，端到端用例位于 `e2e/`。
- `tests/harness` 用于沉淀可重复验证装置与说明，不属于 `Vitest` 自动测试。

## 部署

当前发布目标为 Vercel，不再使用 `gh-pages`。

首次部署前需要：

```sh
vercel link
vercel env add BUG_FEEDBACK_ADMIN_KEY
vercel integration add blob
```

日常命令：

```sh
vercel
vercel --prod
vercel logs --since 1h
```

说明：

- 仓库已包含 `.vercel/project.json`，当前目录已经 link 到 Vercel 项目 `trigon-tetris`
- 前端静态资源由 Vite 构建到 `dist`
- `api/` 目录下的函数会由 Vercel Functions 托管
- `admin.html` 与 `restore.html` 会随主站一起部署，并通过 `cleanUrls` 以 `/admin`、`/restore` 访问
- BUG 反馈存储依赖 Vercel Blob，对应环境变量需在 Vercel 项目中配置完成

## 关键文档

- [AGENT.md](AGENT.md)
- [Architecture Overview](docs/architecture/overview.md)
- [Core Gameplay Baseline](docs/architecture/gameplay.md)
- [Feedback Architecture](docs/architecture/feedback.md)
- [Development Process](docs/process/README.md)
- [Harness](tests/harness/README.md)
- [Specs Templates](specs/_templates/README.md)
- [Extend Life Cover Spec](specs/extend-life-bevelled-cover-blocks/spec.md)

## 当前工程结构

- `src/game`: 核心规则、状态机、渲染器、方块定义
- `src/components`: Vue 界面层
- `src/utils`: 几何判定、得分、历史分数、音频等工具函数
- `e2e`: Playwright 端到端测试
- `tests/harness`: 可重复执行的验证装置说明与 fixture / flow / api / ui 分层
- `docs`: 架构、流程、编码规范文档
- `specs`: 需求规格与模板

## 后续开发约定

涉及游戏规则、状态机、得分、消除、续命逻辑的改动，先更新 `specs/`，再改代码，再补对应 harness 或自动化测试。
