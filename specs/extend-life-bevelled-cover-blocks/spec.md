# Spec

## 基本信息

- 功能名称：续命阶段斜正方形 Cover block 收集修复
- 对应 Proposal：`specs/extend-life-bevelled-cover-blocks/proposal.md`
- 当前状态：approved
- 最后更新：2026-05-06

## 问题定义

`ExtendLife` 阶段命中 `BevelledSquare cover` 后，系统必须收集并处理所有参与该 cover 几何成立的 block。当前问题表现为部分属于斜正方形边框或内部的 block 没有进入标红和清除集合。

## 用户故事

- 作为：玩家
- 我希望：续命阶段命中的斜正方形 cover 能完整标红并清除
- 从而：续命反馈与规则结果保持一致

## 功能行为

### 主流程

1. 游戏进入 `ExtendLife`。
2. 系统优先查找 `BevelledSquare cover`。
3. 命中 cover 后，系统收集所有参与该斜正方形成立的 block。
4. 边框格存在两个三角碎片时，只收集构成该边框方向的 1 个 block。
5. 边框格由 `Full` 构成时，收集该 `Full` 所属 block。
6. 系统使用同一组 block 执行标红、清除棋盘数据、清理 `dead_blocks` 和清除特效。
7. 清除结束后进入 `MoveBoard`。

### 异常流程

1. 如果没有命中任何 `BevelledSquare cover`，继续查找 `Square cover`。
2. 如果两类 cover 都不存在，进入 `Fail`。

### 空状态/加载态/错误态

- 加载态：不涉及。
- 空状态：没有 cover 时按既有失败流程处理。
- 错误态：不新增错误态。
- 重试机制：不涉及。

## 页面与交互

- 页面入口：游戏主画布。
- 路由：不变。
- 关键组件：不变。
- 关键交互：续命阶段自动触发，不新增玩家交互。

## 数据与接口

- 接口列表：无。
- 请求参数：无。
- 响应结构：无。
- 字段映射：无。
- mock 策略：无。

## 状态管理

- 本地状态：`Game.state`、`boards`、`dead_blocks` 保持既有流转。
- 全局状态：无。
- 缓存策略：无。

## 权限与安全

- 权限点：无。
- 敏感数据处理：无。
- 输入校验：不涉及外部输入。

## 可观测性

- 关键日志：不新增。
- 埋点事件：不新增。
- 错误上报：不新增。

## 验收标准

- [ ] `BevelledSquare cover` 边框格存在多个三角碎片时，只收集构成边框方向的 1 个 block。
- [ ] `BevelledSquare cover` 边框格由 `Full` 构成时，该 `Full` 所属 block 进入返回集合。
- [ ] `ExtendLife` 命中 `BevelledSquare cover` 后，标红集合与清除集合一致。
- [ ] `Square cover` 行为不被破坏。
- [ ] 相关单元测试通过。
- [ ] `pnpm build` 通过。

## 非功能要求

- 性能：保持现有棋盘扫描复杂度量级。
- 可维护性：优先复用规则层工具函数。
- 可测试性：新增测试直接覆盖 block 收集结果。

## 未决问题

- 无。
