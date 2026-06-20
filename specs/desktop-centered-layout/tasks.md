# Tasks

## 基本信息

- 功能名称：桌面居中棋盘布局
- 对应 Spec：`specs/desktop-centered-layout/spec.md`
- 负责人：Codex
- 集成人：Codex

## 任务拆解

### 任务 1

- 任务 ID：DESKTOP-CENTERED-LAYOUT-1
- 名称：补充规格文档
- Owner：Codex
- 说明：记录桌面居中棋盘布局的目标、范围和验收标准。
- 写入范围：`specs/desktop-centered-layout/*`
- 读取依赖：`AGENT.md`、`src/App.vue`
- 输入：用户布局需求
- 输出：proposal、spec、tasks
- 依赖：无
- 验证命令：人工检查规格完整性
- 交接产物：规格文档
- 完成标准：编码前存在可执行 spec 和 tasks。

### 任务 2

- 任务 ID：DESKTOP-CENTERED-LAYOUT-2
- 名称：调整主页面布局
- Owner：Codex
- 说明：将主页面改为左信息区、中棋盘区、右 samples 区，确保棋盘水平居中。
- 写入范围：`src/App.vue`
- 读取依赖：`src/components/GameScore.vue`、`src/components/GameKeyboard.vue`、`src/components/GameSampleCanvas.vue`
- 输入：`specs/desktop-centered-layout/spec.md`
- 输出：新的桌面布局结构和 cell size 计算
- 依赖：任务 1
- 验证命令：`pnpm build`
- 交接产物：代码修改
- 完成标准：构建通过，棋盘布局符合 spec。

### 任务 3

- 任务 ID：DESKTOP-CENTERED-LAYOUT-3
- 名称：调整侧栏组件适配
- Owner：Codex
- 说明：让 samples 和操作示意在新侧栏宽度下更稳定展示。
- 写入范围：`src/components/GameSampleCanvas.vue`、`src/components/GameKeyboard.vue`
- 读取依赖：`src/App.vue`
- 输入：任务 2 布局
- 输出：侧栏组件样式调整
- 依赖：任务 2
- 验证命令：`pnpm build`
- 交接产物：代码修改
- 完成标准：侧栏内容不挤压主棋盘，samples 只出现在右侧。

### 任务 4

- 任务 ID：DESKTOP-CENTERED-LAYOUT-4
- 名称：验证与验收记录
- Owner：Codex
- 说明：执行验证命令并记录布局验收结果。
- 写入范围：`specs/desktop-centered-layout/acceptance.md`
- 读取依赖：`specs/desktop-centered-layout/spec.md`
- 输入：实现和验证结果
- 输出：验收记录
- 依赖：任务 2-3
- 验证命令：`pnpm build`
- 交接产物：验证结果
- 完成标准：验收记录完整，验证通过或记录阻塞原因。

## 建议分层

- 规格更新
- 主布局实现
- 侧栏组件适配
- 构建与视觉验证
- 验收记录

## 执行约束

- 不修改游戏规则和渲染器逻辑。
- 不修改 sample 数据。
- 不引入持续 resize 重建游戏实例。
- 共享文件由 Codex 统一收口。
