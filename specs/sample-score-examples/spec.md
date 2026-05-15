# Spec

## 基本信息

- 功能名称：新增 Sample 得分示例
- 对应 Proposal：`specs/sample-score-examples/proposal.md`
- 当前状态：approved
- 最后更新：2026-05-14

## 问题定义

samples 展示需要与用户提供的最新截图一致，新增 27 分和 6,400,000 分两个 `Perfect` 示例，并保持示例分数与当前得分公式同步。

## 用户故事

- 作为：玩家
- 我希望：在 samples 区域看到更多得分示例
- 从而：学习低分基础拼法和高分复杂拼法

## 功能行为

### 主流程

1. `getSampleBlocks()` 返回包含既有 samples 和新增 samples 的数组。
2. `GameSampleCanvas` 继续按现有逻辑把每个 sample 渲染成图片。
3. 新增 27 分 sample 必须能被识别为 `Perfect Square` 或 `Perfect BevelledSquare`。
4. 新增 6,400,000 分 sample 必须能被识别为 `Perfect Square` 或 `Perfect BevelledSquare`。
5. 每个新增 sample 的 `score` 必须等于规则函数计算出的 perfect 得分。

### 异常流程

1. 如果新增 sample 无法被 perfect 识别，单元测试必须失败。
2. 如果标注分数与规则函数计算结果不一致，单元测试必须失败。

### 空状态/加载态/错误态

- 加载态：沿用现有 samples 挂载后生成图片的行为。
- 空状态：不涉及。
- 错误态：不新增运行时错误态。
- 重试机制：不涉及。

## 页面与交互

- 页面入口：主游戏页面右侧 samples 区域。
- 路由：不变。
- 关键组件：`GameSampleCanvas`。
- 关键交互：不新增玩家交互。

## 数据与接口

- 接口列表：无。
- 请求参数：无。
- 响应结构：无。
- 字段映射：无。
- mock 策略：无。

## 状态管理

- 本地状态：`GameSampleCanvas.sample_images` 继续保存渲染后的图片。
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

- [ ] `getSampleBlocks()` 包含 27 分 sample。
- [ ] `getSampleBlocks()` 包含 6,400,000 分 sample。
- [ ] 27 分 sample 由规则层识别为 perfect 图形。
- [ ] 6,400,000 分 sample 由规则层识别为 perfect 图形。
- [ ] 所有 sample 标注分数与当前 perfect 得分公式一致。
- [ ] focused unit test 通过。

## 非功能要求

- 性能：samples 数量增加 2 个，不应改变主游戏性能。
- 可维护性：新增 sample 应继续使用现有 `createBlock` 表达方式。
- 可测试性：单元测试必须覆盖新增分数列表和 perfect 识别。

## 未决问题

- 无。
