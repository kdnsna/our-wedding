# A Love Story, By the Sea · 婚礼数字请柬

> 2026.11.14 · 山东威海荣成 · 华星宾馆户外草坪
> 手机端沉浸式婚礼网站（六幕滚动叙事长页）

设计依据：`婚礼专属数字请柬设计方案_V1.0.pdf`

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开终端里显示的地址即可（默认 http://localhost:5173）。
手机预览：让手机和电脑连同一 Wi-Fi，访问 `http://<电脑IP>:5173`。

## 上线前要做的事（按顺序）

### 1. 照片（assets/ 目录）

`assets/*.jpg` 是母版，页面实际用的是 `assets/img/` 里压缩好的版本（两档宽度 WebP + 一张 JPEG 兜底）。
换照片时：替换 `assets/` 里同名的 jpg，然后运行

```bash
npm i --no-save sharp@0.33 && node scripts/optimize-images.mjs
```

首屏 hero 会被预加载并优先下载，其余照片都是滚动到附近才加载。`photos-original/` 是原片存档，页面不引用。

### 2. 修改文字配置（index.html 底部 `CONFIG`）

```js
const CONFIG = {
  groomName: "高嘉琪",
  brideName: "张靖",
  ceremonyTime: "上午 10:58",
  contacts: [                       // 电话自动变成一键拨号
    { name: "高嘉琪", tel: "15550070122", wechat: "Kdnsna7" },
    { name: "张靖",   tel: "13061243813", wechat: "" },  // 留空 = 不显示微信行
  ],
  mapKeyword: "荣成华星宾馆",
  mapCity: "威海",
  music: "",                        // 留空 = 不显示 ♪；见下方「背景音乐」
  share: …                          // 读取 #share-config，见下方「分享卡片」
};
```

- 「回复赴约」按钮会打开页内抽屉：每位联系人一个「拨打」按钮；填了 `wechat` 才会出现「复制微信号」。

### 3. 背景音乐（待定）

把 mp3 放进 `public/`（例如 `public/bgm.mp3`），再把 `CONFIG.music` 改成 `"bgm.mp3"`。
没配置时 ♪ 按钮不出现；文件加载失败也会自动收起，不弹任何提示。不自动播放。

### 4. 分享卡片（微信 / 以后的公众号）

只改 `index.html` 里 `<script id="share-config">` 这一份（标题、摘要、封面绝对地址、链接）。
构建时会自动写进 `<title>`、`og:*` 和 `itemprop` 标签；页面脚本里也能用 `CONFIG.share`，以后接公众号 JS-SDK（`updateAppMessageShareData`）直接用这份数据。
封面文件是 `public/share-cover.jpg`（1080×1080），构建后位于站点根目录。

### 5. 部署

push 到 `main` 会自动构建并发布到 GitHub Pages（`.github/workflows/deploy.yml`）。**main 上的改动会立刻上线**，改版请先在分支上做。

## 字体

马善政体（中文情绪句）、Cormorant Garamond（英文标题与数字）、Pinyon Script（英文图注）都自托管在 `assets/fonts/`，均为 SIL OFL 1.1，许可证文件放在同目录。英文两款只保留基本拉丁字符，合计约 35KB。

## 六幕结构

01 The Opening 电影开场 → 02 Our Story 关于我们 → 03 The Journey 奔赴山海 → 04 The Gallery 婚纱影像 → 05 The Invitation 正式邀请（含赴约指南 + 回复赴约）→ 06 The Ending 尾声致谢

右下角「婚礼信息」快捷入口，宾客可随时跳到第五幕，不必看完动画；到了第五幕之后自动收起，不挡正文。

## 当前页面说明（2026-10-09）

已按用户反馈恢复初版视觉与原有顺序，包括原版八张画廊布局和「所爱隔山海，山海皆可平」的照片过场。仅保留两处小调整：① 首屏显示新人姓名，姓名自动读取 `CONFIG`；② 正式邀请页标注酒店详细地址「荣成市成山大道东段1号」。

其余仍以初版网页为准。正式传播前请核验婚礼时间、实际场地入口及分享效果。公开仓库中的个人联系方式和原始婚纱照片亦需按实际隐私需求处理。
