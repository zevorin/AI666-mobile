# AI666 移动端源代码设计交接包

## 包含内容

- 22 个移动端 H5 原型页面源文件
- 移动端共享样式与交互脚本：`mobile-h5.css`、`mobile-h5.js`
- 页面实际引用的品牌图、内容图、Remix Icon 图标资源
- 已确认的邀请页第三版设计参考

## 查看方式

在本目录启动任意静态文件服务器，然后打开：

```text
/outputs/community-homepage-style-exploration/mobile-home.html
```

例如：

```powershell
npx serve .
```

邀请页入口：

```text
/outputs/community-homepage-style-exploration/mobile-invite.html
```

移动端 UI 设计规范：

```text
/outputs/community-homepage-style-exploration/UI设计规范.html
```

规范页记录 11px 最小字号基准、完整语义文字层级、共享组件类名、现有移动页面覆盖范围，并提供 360 / 390 / 430 三档真实页面预览。

## 设计交接说明

- `design-handoff/selected-invite-design.png`：用户确认的邀请页第三版设计方向
- `design-handoff/2026-08-21-web-style-mobile-redesign.md`：移动端重设计交接说明

## 边界

本包是静态产品原型与设计交接快照，不包含真实接口、账号、积分、支付或发布能力。后续迭代的唯一源文件仍以项目仓库中的 `outputs/community-homepage-style-exploration/` 为准。
