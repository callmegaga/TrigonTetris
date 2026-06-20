# Tasks

## 基本信息

- 功能名称：Samples 开局规则动画
- 对应 Spec：`specs/sample-intro-animation/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：SAMPLE-INTRO-ANIMATION-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录 samples 开局动画的触发、展示和恢复行为。
- 写入范围：`specs/sample-intro-animation/*`
- 读取依赖：`AGENT.md`、`src/App.vue`、`src/components/GameSampleCanvas.vue`
- 输入：用户需求
- 输出：proposal、spec、tasks、acceptance
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：SAMPLE-INTRO-ANIMATION-2
- 名称：实现动画绘制器
- Owner：Codex
- 说明：新增 sample intro canvas renderer，复用现有 grid/block 绘制工具，按时间轴绘制 `main_square` 拆分并拼成 `split_square_1`、`split_square_2` 的过程。
- 写入范围：`src/game/renderer/canvas/sample_intro_renderer.ts`
- 读取依赖：`src/game/renderer/canvas/utils.ts`、`src/game/types.ts`
- 输入：任务 1 spec
- 输出：可在 canvas 上播放的 intro renderer
- 依赖：任务 1
- 验证命令：`node_modules\\.bin\\vue-tsc.CMD --build --force`
- 交接产物：代码修改
- 完成标准：renderer 可启动、停止并完成回调。

### 任务 3

- 任务 ID：SAMPLE-INTRO-ANIMATION-3
- 名称：拆分 SampleIntroAnimation 组件
- Owner：Codex
- 说明：将 intro canvas、renderer 生命周期和完成事件封装到独立组件，避免后续动画调整影响 samples 列表组件。
- 写入范围：`src/components/SampleIntroAnimation.vue`、`src/components/GameSampleCanvas.vue`
- 读取依赖：任务 2
- 输入：renderer 和父组件 token
- 输出：独立 intro 组件与 samples 区状态切换
- 依赖：任务 2
- 验证命令：`node_modules\\.bin\\eslint.CMD src\\components\\SampleIntroAnimation.vue src\\components\\GameSampleCanvas.vue`
- 交接产物：代码修改
- 完成标准：动画状态切换稳定，动画组件卸载时清理 renderer。

### 任务 4

- 任务 ID：SAMPLE-INTRO-ANIMATION-4
- 名称：接入欢迎视频过渡与正式开局触发点
- Owner：Codex
- 说明：点击欢迎页后先播放视频缩小、淡出、位移到 samples 区的过渡；过渡完成后隐藏欢迎页；首次进入时触发 sample intro 并在完成后恢复 samples、写入已看标记再调用 `game.start()`，已经看过 sample intro 时直接显示 samples 并开始游戏。
- 写入范围：`src/App.vue`、`src/components/TheWelcome.vue`、`src/components/GameSampleCanvas.vue`
- 读取依赖：任务 3
- 输入：GameSampleCanvas prop
- 输出：欢迎视频过渡、sample intro 触发和延后的正式开局
- 依赖：任务 3
- 验证命令：`node_modules\\.bin\\eslint.CMD src\\App.vue src\\components\\TheWelcome.vue`
- 交接产物：代码修改
- 完成标准：点击欢迎页先播放视频过渡；首次进入时过渡完成后触发 sample intro，sample intro 结束并恢复 samples 后正式开局；已看过 sample intro 后再次进入时跳过 sample intro 并直接开局。

### 任务 5

- 任务 ID：SAMPLE-INTRO-ANIMATION-5
- 名称：验证与验收记录
- Owner：Codex
- 说明：执行 lint、type-check、build 和浏览器验证，填写验收记录。
- 写入范围：`specs/sample-intro-animation/acceptance.md`
- 读取依赖：实现代码
- 输入：验证结果
- 输出：验收记录
- 依赖：任务 2-4
- 验证命令：`node_modules\\.bin\\vite.CMD build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

## 建议分层

- 规格更新
- canvas renderer
- Vue 状态接入
- 启动流程接入
- 构建与浏览器验证
- 验收记录

## 执行约束

- 不修改 sample 数据。
- 不修改游戏规则和得分逻辑。
- sample intro 播放期间不得启动正式游戏循环。
- 动画结束必须恢复完整 samples 列表。
- 欢迎视频过渡完成前不得提前触发 sample intro。
