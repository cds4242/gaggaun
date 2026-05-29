// 가까운교회 어드민 매뉴얼용 캡쳐 스크립트
// 사용법: node scripts/capture-admin.mjs
// 결과: manual-assets/*.png

import { chromium } from "file:///C:/Users/forla/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://gaggaun.vercel.app";
const EMAIL = "admin@admin.com";
const PASSWORD = "admin1234";
const OUT = path.resolve("manual-assets");
fs.mkdirSync(OUT, { recursive: true });

const shots = [
  { name: "01-login", url: "/login", before: async () => {} },
  { name: "02-dashboard", url: "/admin" },
  { name: "03-this-week", url: "/admin/this-week" },
  { name: "04-nav", url: "/admin/nav" },
  { name: "05-notices-list", url: "/admin/notices" },
  { name: "06-notices-new", url: "/admin/notices/new" },
  { name: "07-boards-list", url: "/admin/boards" },
  { name: "08-boards-new", url: "/admin/boards/new" },
  { name: "09-board-posts", url: "/admin/board" },
  { name: "10-sermons-list", url: "/admin/sermons" },
  { name: "11-sermons-new", url: "/admin/sermons/new" },
  { name: "12-gallery-list", url: "/admin/gallery" },
  { name: "13-gallery-new", url: "/admin/gallery/new" },
  { name: "14-new-members", url: "/admin/new-members" },
  { name: "15-feedback-tool", url: "/admin/feedback-tool" },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// 로그인 페이지 먼저 캡쳐
console.log("→ login page");
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(OUT, "01-login.png"), fullPage: true });

// 로그인
console.log("→ logging in");
await page.fill('input[type="email"], input[name="email"]', EMAIL).catch(() => {});
await page.fill('input[type="password"], input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL(/\/admin/, { timeout: 15000 }),
  page.click('button[type="submit"]'),
]);
console.log("✓ logged in:", page.url());

for (const s of shots.slice(1)) {
  console.log(`→ ${s.name}  ${s.url}`);
  try {
    await page.goto(`${BASE}${s.url}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, `${s.name}.png`), fullPage: true });
  } catch (e) {
    console.log(`  ! ${s.name} 실패:`, e.message);
  }
}

console.log("done");
await browser.close();
