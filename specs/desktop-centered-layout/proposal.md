# Proposal

## 基本信息

- 功能名称：桌面居中棋盘布局
- 任务 ID：DESKTOP-CENTERED-LAYOUT
- 提出人：用户
- 计划日期：2026-06-20
- 相关链接：无

## 背景

当前主游戏页面使用三段 flex 布局，左侧得分和操作说明、中央棋盘、右侧 next 与 samples。棋盘居中依赖左右内容宽度接近，桌面分辨率变化时容易被侧栏内容推偏；同时 next 模块占用右侧 samples 区域，不符合新的信息布局目标。

## 目标

- 主棋盘在各种桌面分辨率下始终位于页面水平中心。
- 棋盘根据屏幕长宽比例尽可能大，同时预留左右信息区。
- 左侧显示得分、下 2 个 block 和操作示意，并能根据屏幕高度灵活排布。
- 右侧区域全部用于 samples 展示。

## 非目标

- 本次不调整游戏规则、得分、方块渲染、sample 数据或引导文案。
- 本次不重做移动端专用布局。
- 本次不改变 next canvas 内部渲染逻辑。

## 用户价值

- 面向谁：桌面端玩家
- 解决什么问题：棋盘不居中、侧栏信息挤占主要区域、samples 展示空间不足
- 成功后用户得到什么：主棋盘稳定居中且尽可能大，左右信息区域更清晰

## 范围

### In Scope

- `App.vue` 主布局结构调整。
- 主棋盘 cell size 计算策略调整。
- 左侧信息区和右侧 samples 区样式调整。
- `GameSampleCanvas` 在右侧区域内自适应展示。
- `GameKeyboard` 在左侧窄栏中更紧凑展示。

### Out of Scope

- 游戏状态机、Renderer、方块逻辑。
- sample 数据和得分公式。
- 后台反馈、恢复、管理页面。

## 输入条件

- 是否有设计稿：无
- 是否有接口：无
- 是否需要 mock：否
- 是否涉及权限：否
- 是否涉及埋点/日志：否

## 风险与约束

- 技术风险：棋盘尺寸在窄宽桌面上需要同时满足高度和左右栏宽度约束。
- 业务风险：若侧栏过宽会牺牲棋盘尺寸；若侧栏过窄会影响信息可读性。
- 依赖约束：`Game` 初始化时 cell size 仍是一次性计算，本次不做运行时 resize 重建。

## 验收概览

- 需要补充 `specs/desktop-centered-layout/spec.md`
- 需要更新 `src/App.vue`
- 需要视情况更新 `GameSampleCanvas` 和 `GameKeyboard`
- 需要通过 lint、format、build
- 需要进行桌面视口布局检查

## 交付物

- `specs/desktop-centered-layout/spec.md`
- `specs/desktop-centered-layout/tasks.md`
- 代码实现
- 验收记录
