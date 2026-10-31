# 背景音乐：自托管《奔赴山海》

对照截图（390×844）：`before-player.png`（网易云外链播放器）→ `after-player.png`（自托管音轨走带）；
`after-footer.png` 是页脚署名「音乐：原创《奔赴山海》」。

## 文件

| 文件 | 说明 |
| --- | --- |
| `assets/audio/wedding-loop.m4a` | AAC-LC，立体声 44.1kHz 96kbps，1,174,111 字节 |
| `assets/audio/wedding-loop.mp3` | MP3 立体声 44.1kHz 96kbps，1,152,724 字节 |
| `scripts/encode-audio.sh` | 从 96 秒 WAV 母版重新编码这两个文件 |

解码后两份都是 **96.000 秒 / 4,233,600 采样**，与母版一致（AAC 容器里多出的十几毫秒是编码器补的静音，
播放时按 `CONFIG.music.seconds` 裁掉，否则每圈接缝会空一下）。

## 循环方式

`<audio loop>` 在 Chromium 实测每绕一圈掉约 10ms（-40dB 左右的一次空档），所以播放主路径不是它：

1. 点 ♪ 时在同一个点击调用栈里创建 / 恢复 `AudioContext`（微信、iOS 要求这个手势）；
2. `fetch` 音轨 → `decodeAudioData` → 按 96.000s 裁尾 → `AudioBufferSourceNode` 精确循环；
3. `AudioContext` 不可用或两份都解码失败，才退回 `<audio loop>`，并用 `ended` 兜住 loop 失效的 WebView。

实测（Chromium，用 ScriptProcessor 在音频图上取样 103 秒，跨越 96 秒接缝）：
- 自托管 + WebAudio：全程没有低于 -45dB 的 10ms 帧，接缝处没有空档；
- 纯 `<audio loop>` 对照：每一圈都有一次 10ms 的静音。

## 已验证 / 未验证

已验证（Chromium + Playwright，390×844 与 1280×900，dev 与 build 两种产物）：
- 点 ♪ 之前没有任何音频请求（`preload="none"`）；点后才拉文件；
- 点一下即出声，进度条与时钟跟着走（10 秒实测前进 10 秒）；
- 收起播放器音乐不停；暂停 / 继续正常；关闭后 `AudioContext` 关闭、`src` 移除，再点可重新加载；
- 页脚署名为「音乐：原创《奔赴山海》」；
- `provider` 改成 `"netease"` 后回到旧外链播放器，标题 / 版权行一起切换；
- 无 console 报错、无 4xx；
- 禁用 `AudioContext` 与「AAC 解码失败」两种降级路径都能出声。

未验证（这里没有真机 / 微信环境）：真机微信内置浏览器、iOS Safari、Android 微信的首次手势解锁表现；
微信里长时间挂后台再回来能否接着放。需要上线前在手机上点一次确认。
