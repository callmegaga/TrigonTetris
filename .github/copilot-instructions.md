# GitHub Copilot Repository Instructions

Before proposing or generating code in this repository, read:

- `AGENT.md`
- `docs/process/README.md`
- `docs/process/ai-collaboration-policy.md`
- `docs/process/multi-agent-collaboration-contract.md`
- `specs/_templates/README.md`
- `tests/harness/README.md`

## Required workflow

- Follow the repository's SDD-first process
- Create or update the matching `proposal/spec/tasks/acceptance` before implementation
- If requirements are underspecified, ask clarifying questions before planning or coding
- After generating `proposal/spec/tasks` and test or harness plans, ask for confirmation before implementation
- If `superpowers` is available, use it first for requirement decomposition and spec structuring
- If `Context7` is available, use it first for official documentation lookup during initialization, installation, upgrade, or migration work

## Collaboration constraints

- Use `pnpm`
- Treat `.gitlab-ci.yml` as the CI baseline
- In multi-agent work, declare `owner`, `write scope`, `read dependencies`, and `integrator`
- Do not silently edit shared files such as `package.json`, CI files, or shared process docs without making ownership explicit

## Validation baseline

Prefer these commands when relevant:

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`
- `pnpm build`
- `pnpm exec playwright test`
