# Proposal

## 基本信息

- 功能名称：Samples 使用棋盘同尺寸格子
- 任务 ID：SAMPLE-BOARD-CELL-SIZE
- 提出人：用户
- 计划日期：2026-06-20
- 相关链接：无

## 背景

当前 samples 使用固定 `30px` cell size 渲染，并通过 CSS 缩放图片。主棋盘 cell size 会根据桌面视口动态计算，因此 samples 的格子视觉尺寸可能与主棋盘不一致，玩家查看示例和实际操作时容易产生空间尺度错觉。

## 目标

- samples 使用与主棋盘完全相同的 `cell_size` 渲染。
- samples 图片按真实 canvas 尺寸展示，不再通过 CSS 缩放。
- 右侧 samples 区域负责滚动和换行，避免为了塞入空间而压缩示例。

## 非目标

- 本次不调整 sample 数据、得分、图形内容。
- 本次不调整主棋盘尺寸计算策略。
- 本次不做缩略图模式。

## 用户价值

- 面向谁：游戏玩家
- 解决什么问题：示例格子和实际棋盘格子大小不同造成的视觉误判
- 成功后用户得到什么：示例图的空间尺度与游戏操作区域一致

## 范围

### In Scope

- `App.vue` 向 `GameSampleCanvas` 传入当前 `cell_size`。
- `GameSampleCanvas` 使用传入的 cell size 创建 `SampleRenderer`。
- samples 图片按原始尺寸展示，右侧区域滚动。

### Out of Scope

- 游戏规则、Renderer 主流程、样例数据。
- 移动端专项布局。
- 动态 resize 后重建 samples。

## 输入条件

- 是否有设计稿：无
- 是否有接口：无
- 是否需要 mock：否
- 是否涉及权限：否
- 是否涉及埋点/日志：否

## 风险与约束

- 技术风险：大屏时 sample 图片变大，右侧必须允许滚动。
- 业务风险：samples 可见数量可能减少，但尺度一致性优先。
- 依赖约束：`SampleRenderer` 已支持构造时传入 `board_cell_size`。

## 验收概览

- 需要补充 `specs/sample-board-cell-size/spec.md`
- 需要更新 `src/App.vue`
- 需要更新 `src/components/GameSampleCanvas.vue`
- 需要通过 lint、format、build
- 需要浏览器验证 sample 图片自然宽度等于 canvas 尺寸

## 交付物

- `specs/sample-board-cell-size/spec.md`
- `specs/sample-board-cell-size/tasks.md`
- 代码实现
- 验收记录
