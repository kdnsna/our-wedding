/**
 * 图片管线：把 assets/*.jpg（母版，不会被打包）转成
 *   assets/img/<name>-<w>.webp  （两档宽度，配 srcset）
 *   assets/img/<name>.jpg       （JPEG 兜底，给不支持 WebP 的老设备）
 * 只改体积和加载方式，不改构图/调色。
 *
 * 用法（sharp 不放进项目依赖，免得拖慢部署）：
 *   npm i --no-save sharp@0.33 && node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

// 每张图：两档 WebP 宽度 + 兜底 JPEG 宽度。全屏大图（hero / 过场）保留原始宽度那一档，避免 3x 屏发虚。
const PLAN = {
  hero:       { webp: [750, 1535], jpg: 1200 },
  interlude:  { webp: [1200, 1920], jpg: 1200 },
  "story-1":  { webp: [750, 1200], jpg: 1200 },
  "story-2":  { webp: [540, 1080], jpg: 1080 },
  "gallery-1": { webp: [600, 1200], jpg: 1200 },
  "gallery-2": { webp: [600, 1200], jpg: 1200 },
  "gallery-3": { webp: [750, 1200], jpg: 1200 },
  "gallery-4": { webp: [540, 1080], jpg: 1080 },
  "gallery-5": { webp: [600, 1080], jpg: 1080 },
  "gallery-6": { webp: [750, 1200], jpg: 1200 },
  "gallery-7": { webp: [600, 1200], jpg: 1200 },
  "gallery-8": { webp: [600, 1200], jpg: 1200 },
  // 第三幕「奔赴山海」：自己拍的荣成海景（华星桥 / 海湾栏杆）
  "journey-1": { webp: [960, 1440], jpg: 1200 },
  "journey-2": { webp: [540, 1080], jpg: 1080 },
};

mkdirSync("assets/img", { recursive: true });
// 只跑指定的图：node scripts/optimize-images.mjs journey-1 journey-2
const only = process.argv.slice(2);
for (const [name, p] of Object.entries(PLAN)) {
  if (only.length && !only.includes(name)) continue;
  const src = `assets/${name}.jpg`;
  for (const w of p.webp) {
    const out = `assets/img/${name}-${w}.webp`;
    const info = await sharp(src).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6, smartSubsample: true }).toFile(out);
    console.log(out, info.width + "x" + info.height, (info.size / 1024).toFixed(0) + "KB");
  }
  const out = `assets/img/${name}.jpg`;
  const info = await sharp(src).resize({ width: p.jpg, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(out);
  console.log(out, info.width + "x" + info.height, (info.size / 1024).toFixed(0) + "KB");
}
