# Proposal

## 基本信息

- 功能名称：Sample 分数居中覆盖
- 任务 ID：SAMPLE-SCORE-OVERLAY
- 提出人：用户
- 计划日期：2026-06-20
- 相关链接：无

## 背景

Normal square sample 外围增加一圈格子的方案视觉效果不好，需要回退。为了减少 samples 纵向空间占用，同时保留分数信息，将 sample 分数从图片下方移动到示例图中心覆盖显示。

## 目标

- 撤销 normal square sample 外围 padding。
- Sample 图片恢复原始渲染尺寸，不额外加圈。
- 分数显示在 sample 图片中心，减少每个 sample 的额外高度。

## 非目标

- 本次不修改 sample 数据、得分公式或顺序。
- 本次不缩放 sample 图片。
- 本次不改变主棋盘布局。

## 用户价值

- 面向谁：游戏玩家
- 解决什么问题：外围格子占用空间且视觉效果差，分数下置增加 sample 高度
- 成功后用户得到什么：samples 更紧凑，分数仍清晰可见

## 范围

### In Scope

- `GameSampleCanvas` 分数样式调整为中心覆盖。
- 回退 `SampleRenderer` padding 支持。
- 删除 normal sample padding 相关过期 spec 和测试。

### Out of Scope

- sample blocks 数据。
- 主游戏规则和 renderer。
- 移动端专项布局。

## 输入条件

- 是否有设计稿：无
- 是否有接口：无
- 是否需要 mock：否
- 是否涉及权限：否
- 是否涉及埋点/日志：否

## 风险与约束

- 技术风险：分数覆盖不能导致 sample 图片被 CSS 缩放。
- 业务风险：分数可能遮挡部分示例内容，但能显著减少空间占用。
- 依赖约束：保留 samples 与棋盘相同 cell size 的既有改动。

## 验收概览

- 需要补充 `specs/sample-score-overlay/spec.md`
- 需要更新 `src/components/GameSampleCanvas.vue`
- 需要回退 `src/game/renderer/canvas/sample_renderer.ts`
- 需要通过 lint、format、build
- 需要浏览器验证分数位于示例中心且 sample 图片不缩放

## 交付物

- `specs/sample-score-overlay/spec.md`
- `specs/sample-score-overlay/tasks.md`
- 代码实现
- 验收记录
