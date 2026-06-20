# Acceptance

## 基本信息

- 功能名称：Samples 开局规则动画
- 对应 Spec：`specs/sample-intro-animation/spec.md`
- 验收人：Codex
- 验收日期：2026-06-20

## 验收前提

- [x] 代码已合并或可运行
- [x] 使用的分支和提交已记录
- [x] 相关 mock / 测试数据可用
- [x] 设计稿或 UI 分析清单可访问

## 功能验收

- [x] 主流程通过
- [x] 异常流程通过
- [x] 边界条件通过
- [x] 权限逻辑符合预期

## UI 验收

- [x] 布局正确
- [x] 文案正确
- [x] 图片/图标正确
- [x] 状态展示完整
- [x] 响应式或分辨率要求满足

## Harness 验收

- [x] 类型检查通过
- [x] Lint 通过
- [ ] 单元测试通过
- [x] 关键 flow harness 通过
- [x] 截图回归通过

## 问题记录

| 编号 | 级别 | 问题描述                                                                                                                          | 状态 |
| ---- | ---- | --------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 1    | P3   | Playwright 验证时外部资源请求因沙箱网络限制出现 `ERR_NETWORK_ACCESS_DENIED`，不影响页面、视频过渡、sample intro、延后开局或构建。 | open |

## 验收结论

- 结论：有条件通过
- 备注：已通过 `eslint`、`vue-tsc`、`vite build` 和 Playwright UI flow 验证；欢迎视频会先缩小、位移并淡出到 samples 区，完成后触发 intro canvas；sample intro 现在展示 `main_square` 从中下方拆分为上方左侧 `split_square_1`、上方右侧 `split_square_2` 的过程，飞行过程中 block 不替换为目标形状，不使用 canvas 缩放、拉伸、压扁、旋转、对翻或透明度渐变；移动 block 预先渲染为固定尺寸离屏 sprite，播放时只用未缩放的 `drawImage(sprite.image, x, y)` 做整数像素平移，目标旋转/对翻状态只在落位后出现；首次完整播放后写入 `is_show_sample_intro=true`，再次进入时跳过 sample intro canvas 并直接显示 11 个 samples、启动游戏；播放期间主棋盘活动区保持空白，完整 samples 恢复后才启动游戏循环；intro canvas 已拆分到独立组件，本次未新增纯逻辑单元测试。
