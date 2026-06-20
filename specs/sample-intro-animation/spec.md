# Spec

## 基本信息

- 功能名称：Samples 开局规则动画
- 对应 Proposal：`specs/sample-intro-animation/proposal.md`
- 当前状态：approved
- 最后更新：2026-06-20

## 问题定义

游戏开始前的视频展示了 block 变化和“鱼吃东西”的规则意象，但进入正式游戏后右侧 samples 直接显示静态示例，缺少从视频演示到真实游戏规则的过渡。本功能要求在正式开局前先在 samples 区播放一次简化 block 动画，等完整 samples 恢复显示后再开始游戏。

## 用户故事

- 作为：游戏玩家
- 我希望：正式开始游戏前先在 samples 区看到用 block 复现的视频核心变化
- 从而：更自然地理解 samples 与游戏规则、消除、得分之间的关系

## 功能行为

### 主流程

1. 用户点击欢迎页进入游戏。
2. 现有 intro.js 引导流程按原逻辑执行。
3. `App.vue` 计算欢迎视频区域到 `#sample` 区域的目标位移和缩放。
4. 欢迎页视频先通过缩小、透明度变化和位移动画过渡到 samples 区位置。
5. 视频过渡期间，右侧 samples 列表暂不显示，避免在过渡过程中提前露出静态 samples。
6. 视频过渡完成后，`TheWelcome` 发出完成事件，`App.vue` 隐藏欢迎页。
7. 现有 intro.js 引导流程按原逻辑执行。
8. `App.vue` 更新 samples intro 播放 token，但暂不调用 `game.start()`。
9. `GameSampleCanvas` 收到新 token 后隐藏 samples 列表，显示独立的 `SampleIntroAnimation` 组件。
10. 动画用棋盘相同 `cellSize` 绘制格子和 block，分阶段表现目标、追逐、覆盖、成形、消除。
11. `SampleIntroAnimation` 播放完成后发出完成事件，`GameSampleCanvas` 自动隐藏动画组件并恢复完整 samples 列表。
12. `GameSampleCanvas` 等待 samples DOM 更新完成后通知 `App.vue`。
13. `App.vue` 收到完成事件后正式调用 `game.start()`。

### 异常流程

1. 如果 `playIntroToken` 为 `0`，不自动播放动画，直接显示 samples。
2. 如果播放期间收到新的 `playIntroToken`，当前动画应取消并从头播放新动画。
3. 如果找不到 `#sample` 或欢迎视频 DOM，过渡动画应使用居中缩小淡出兜底，避免卡住进入游戏。
4. 组件卸载时应取消 `requestAnimationFrame` 和计时器，避免卸载后继续更新 DOM。

### 空状态/加载态/错误态

- 加载态：组件挂载前 samples 为空。
- 空状态：无 samples 时显示空容器。
- 错误态：不涉及。
- 重试机制：不涉及。

## 页面与交互

- 页面入口：主游戏页面。
- 路由：根页面。
- 关键组件：`App.vue`、`TheWelcome`、`GameSampleCanvas`、`SampleIntroAnimation`、sample intro canvas renderer。
- 关键交互：点击欢迎页后，视频先过渡到 samples 区；过渡结束后播放 sample intro；sample intro 播放完成且 samples 自动出现后，游戏才正式开始。

## 数据与接口

- 接口列表：无。
- 请求参数：无。
- 响应结构：无。
- 字段映射：无。
- mock 策略：无。

## 状态管理

- 本地状态：`TheWelcome` 管理视频离场样式；`GameSampleCanvas` 管理 sample 图片和动画播放状态；`SampleIntroAnimation` 管理 canvas ref 与 renderer 生命周期。
- 父组件状态：`App.vue` 维护递增 `sample_intro_token`，仅作为播放触发信号；`GameSampleCanvas` 完成后通知父组件启动游戏。
- 全局状态：无。
- 缓存策略：sample 图片仍按现有方式在组件内生成。

## 权限与安全

- 权限点：无。
- 敏感数据处理：无。
- 输入校验：`cellSize` 保持默认值兜底。

## 可观测性

- 关键日志：无。
- 埋点事件：无。
- 错误上报：无。

## 验收标准

- [ ] 点击欢迎页并完成/跳过引导后，正式开局前会触发 samples 区动画。
- [ ] sample intro 播放期间游戏不开始下落。
- [ ] sample intro 结束且完整 samples 列表显示后，游戏才正式开始。
- [ ] 点击欢迎页后，欢迎视频先缩小、淡出并位移到 samples 区域。
- [ ] 视频过渡完成前不触发 sample intro 动画。
- [ ] 视频过渡期间不提前露出完整 samples 列表。
- [ ] 动画播放期间不显示完整 samples 列表。
- [ ] 动画使用与棋盘一致的 `cellSize` 绘制。
- [ ] 动画结束后自动显示完整 samples 列表。
- [ ] 重复触发播放 token 时不会留下多个动画循环。
- [ ] lint、type-check、build 通过。

## 非功能要求

- 性能：动画只在 samples 区一个 canvas 上绘制，不影响主游戏 canvas；正式游戏循环必须等 sample intro 完成后才启动。
- 可维护性：samples 列表组件不直接持有动画 canvas 和 renderer，后续调整动画时优先修改 `SampleIntroAnimation` 和 renderer。
- 可测试性：可通过 DOM 检查动画 canvas 显隐和 samples 恢复。

## 未决问题

- 简化动画的具体分镜可根据后续视频精确帧再微调。
