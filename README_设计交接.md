# AI666 移动端源代码设计交接包

## 包含内容

- 24 个移动端 H5 原型页面源文件
- 移动端共享样式与交互脚本：`mobile-h5.css`、`mobile-h5.js`
- 页面实际引用的品牌图、内容图、Remix Icon 图标资源
- 已确认的邀请页第三版设计参考、实现截图与对照图
- 移动端专项验证结果与设计 QA 记录

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

## 设计交接说明

- `design-handoff/selected-invite-design.png`：用户确认的邀请页第三版设计方向
- `design-handoff/implementation-390x844.png`：当前 390 × 844 实现截图
- `design-handoff/reference-vs-implementation.png`：参考图与实现效果对照
- `design-handoff/design-qa.md`：设计走查记录
- `validation/community-mobile-h5-prototype-validation.json`：24 页移动端专项验证结果

## 边界

本包是静态产品原型与设计交接快照，不包含真实接口、账号、积分、支付或发布能力。后续迭代的唯一源文件仍以项目仓库中的 `outputs/community-homepage-style-exploration/` 为准。
