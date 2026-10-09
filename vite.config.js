import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const escapeAttr = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * 分享信息只维护一份：index.html 里的 <script id="share-config">。
 * 这里把它写进 <head> 的 %SHARE_*% 占位（爬虫和微信不执行 JS，必须是静态标签）。
 */
function shareMeta() {
  return {
    name: "share-meta",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const m = html.match(/<script type="application\/json" id="share-config">([\s\S]*?)<\/script>/);
        if (!m) throw new Error("index.html 缺少 #share-config");
        const share = JSON.parse(m[1]);
        for (const k of ["title", "desc", "image", "link"]) {
          if (!share[k]) throw new Error(`#share-config 缺少 ${k}`);
        }
        if (!/^https?:\/\//.test(share.image)) throw new Error("share-config.image 必须是绝对地址（https://…）");
        return html
          .replaceAll("%SHARE_TITLE%", escapeAttr(share.title))
          .replaceAll("%SHARE_DESC%", escapeAttr(share.desc))
          .replaceAll("%SHARE_IMAGE%", escapeAttr(share.image))
          .replaceAll("%SHARE_LINK%", escapeAttr(share.link));
      },
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [shareMeta()],
});
