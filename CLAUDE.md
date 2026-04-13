# Claude Project Bootstrap

在本仓库中开始任何分析、规格编写或代码修改前，必须先阅读以下文件：

1. `AGENT.md`
2. `docs/process/README.md`
3. `docs/process/ai-collaboration-policy.md`
4. `docs/process/multi-agent-collaboration-contract.md`
5. `specs/_templates/README.md`
6. `tests/harness/README.md`

## 必须遵守的规则

- 实际编码前，必须先生成或修改对应 `spec`
- 若需求细节不清，必须先澄清关键决策，不能自行假设
- 生成 `proposal/spec/tasks` 与测试方案后，必须先请求确认，再进入实现
- 涉及初始化、安装、升级时，优先查询最新官方文档
- 若当前工具支持 `superpowers`，在需求梳理和生成 `proposal/spec` 阶段优先使用
- 若当前工具支持 `Context7`，在初始化、安装、升级、迁移场景优先使用
- 多 agent 并行时，必须声明 `owner`、`write scope`、`integrator`

## 当前项目约束

- 包管理工具：`pnpm`
- CI 平台：`GitLab`，使用 `.gitlab-ci.yml`
- 默认验证命令：
  - `pnpm lint`
  - `pnpm type-check`
  - `pnpm test`
  - `pnpm build`
  - `pnpm exec playwright test`

## 禁止事项

- 不读取上述文档就直接开始实现
- 在没有 `spec` 或 `spec` 明显不完整时直接写代码
- 未经确认直接开始实现
- 多 agent 场景下隐式修改共享文件并覆盖他人工作

若当前环境不支持 `superpowers` 或 `Context7`，必须主动说明，并按仓库流程采用替代方案。
