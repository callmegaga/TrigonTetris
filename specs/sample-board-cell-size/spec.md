# Spec

## 基本信息

- 功能名称：Samples 使用棋盘同尺寸格子
- 对应 Proposal：`specs/sample-board-cell-size/proposal.md`
- 当前状态：approved
- 最后更新：2026-06-20

## 问题定义

Samples 展示必须与主棋盘使用相同的格子尺寸，避免 sample 图像被固定尺寸渲染或 CSS 缩放后产生与实际游戏区域不同的尺度感。

## 用户故事

- 作为：游戏玩家
- 我希望：示例中的每个格子和主棋盘格子一样大
- 从而：看示例时建立的空间判断可以直接迁移到游戏操作中

## 功能行为

### 主流程

1. 页面初始化时计算主棋盘 `cell_size`。
2. `App.vue` 将该 `cell_size` 传给 `GameSampleCanvas`。
3. `GameSampleCanvas` 使用该值创建 `SampleRenderer`。
4. 每个 sample 按真实 canvas 尺寸生成图片。
5. CSS 按图片原始尺寸展示，不再缩放 sample 图。
6. 右侧 samples 区域通过滚动承载超出空间的内容。

### 异常流程

1. 如果未传入 `cellSize`，组件应回退到 `30`，保持兼容。
2. 如果右侧宽度不足，samples 自动换行或通过右侧区域滚动访问。

### 空状态/加载态/错误态

- 加载态：组件挂载前 samples 为空
- 空状态：无 samples 时展示空容器
- 错误态：不涉及
- 重试机制：不涉及

## 页面与交互

- 页面入口：主游戏页面
- 路由：根页面
- 关键组件：`App.vue`、`GameSampleCanvas`
- 关键交互：玩家查看右侧 samples

## 数据与接口

- 接口列表：无
- 请求参数：无
- 响应结构：无
- 字段映射：无
- mock 策略：无

## 状态管理

- 本地状态：sample 图片列表仍由 `GameSampleCanvas` 内部维护
- 全局状态：无
- 缓存策略：无

## 权限与安全

- 权限点：无
- 敏感数据处理：无
- 输入校验：`cellSize` 使用默认值兜底

## 可观测性

- 关键日志：无
- 埋点事件：无
- 错误上报：无

## 验收标准

- [ ] `GameSampleCanvas` 使用主棋盘 `cell_size` 渲染 samples。
- [ ] sample 图片 CSS 不再设置固定缩放宽度或最大宽度。
- [ ] sample 图片显示尺寸等于图片自然尺寸。
- [ ] 右侧 samples 区域可滚动承载大尺寸 sample。
- [ ] lint、format、build 通过。

## 非功能要求

- 性能：samples 仍只在挂载时生成一次。
- 可维护性：sample cell size 从父组件显式传入。
- 可测试性：通过 DOM 检查 naturalWidth 与 clientWidth 一致验证。

## 未决问题

- 是否后续增加“缩略图模式”，由后续需求决定。
