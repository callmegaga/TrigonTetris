# Proposal

## 基本信息

- 功能名称：Samples 开局规则动画
- 任务 ID：SAMPLE-INTRO-ANIMATION
- 提出人：用户
- 计划日期：2026-06-20
- 相关链接：`public/video/fish_eating.mp4`

## 背景

当前游戏开始前的视频动画通过板块变化展示了“鱼吃东西”的规则意象，但用户点击后直接进入正式游戏，视频内容和正式游戏界面之间缺少连续性。右侧 samples 区域本身承担规则示例展示，因此适合在正式开局后先播放一段简化的 block 动画，再切换到完整 samples。

## 目标

- 在正式开始游戏后，在 samples 区播放一次简化 block 动画。
- 动画使用与棋盘相同的格子尺寸和 block 绘制风格。
- 动画结束后自动展示完整 samples 列表。

## 非目标

- 本次不复刻完整视频素材、音频或逐帧内容。
- 本次不改变游戏规则、得分逻辑或现有 sample 数据。
- 本次不改变欢迎页视频的播放方式。

## 用户价值

- 面向谁：新玩家和回流玩家。
- 解决什么问题：开局视频演示和实际游戏界面的关联弱。
- 成功后用户得到什么：正式开局后能在 samples 区看到与游戏画面一致的规则复现，再查看完整得分示例。

## 范围

### In Scope

- `App.vue` 在 `game.start()` 后发出 samples intro 播放信号。
- `GameSampleCanvas` 在收到播放信号时展示 canvas 动画，播放完毕后恢复 samples。
- 新增 canvas renderer 复用 `drawGrid`、`drawBlock`、`drawSquareBorder`。

### Out of Scope

- 视频解码、视频嵌入或逐帧同步。
- 新增音效。
- 游戏主棋盘布局调整。

## 输入条件

- 是否有设计稿：无，参考现有视频意象和 samples 样式。
- 是否有接口：无。
- 是否需要 mock：无。
- 是否涉及权限：无。
- 是否涉及埋点/日志：无。

## 风险与约束

- 技术风险：动画不能阻塞游戏主循环。
- 业务风险：动画过长会影响玩家查看 samples。
- 依赖约束：必须继续通过 TypeScript、ESLint、Prettier 和构建验证。

## 验收概览

- 需要补充 `specs/sample-intro-animation/spec.md`
- 需要 UI 验收：开局后 samples 区先显示动画，随后显示 samples。
- 需要截图回归：验证动画 canvas 和 samples 列表均可见。

## 交付物

- `specs/sample-intro-animation/spec.md`
- `specs/sample-intro-animation/tasks.md`
- `specs/sample-intro-animation/acceptance.md`
- 代码实现
