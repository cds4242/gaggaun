// 어드민 등록 → 사이트에는 이렇게 보임 (짝 캡쳐)
// 비로그인 상태로 라이브 사이트 공개 화면을 캡쳐한다.

import { chromium } from "file:///C:/Users/forla/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://gaggaun.vercel.app";
const OUT = path.resolve("manual-assets");
fs.mkdirSync(OUT, { recursive: true });

// (어드민에서 작성/수정한 것이) 사이트에는 이렇게 보입니다
const shots = [
  { name: "p01-home", url: "/" },                            // 금주 정보 + 메뉴 + 최신 공지/설교
  { name: "p02-notices-list", url: "/notices" },             // 공지사항 목록
  { name: "p03-board-list", url: "/board" },                 // 멀티 보드 입구
  { name: "p04-sermons-list", url: "/media/sermon" },        // 설교 영상 목록
  { name: "p05-gallery-list", url: "/media/gallery" },       // 갤러리 목록
  { name: "p06-new-member-form", url: "/new-member" },       // 새가족 등록 폼 (성도가 보는 화면)
  { name: "p07-worship", url: "/worship" },                  // 예배 안내 (참고)
  { name: "p08-about", url: "/about" },                      // 교회 소개 (참고)
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const s of shots) {
  console.log(`→ ${s.name}  ${s.url}`);
  try {
    await page.goto(`${BASE}${s.url}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `${s.name}.png`), fullPage: true });
  } catch (e) {
    console.log(`  ! ${s.name} 실패:`, e.message);
  }
}

// 모바일 사이즈 홈(목사님 휴대폰으로 확인하는 화면 톤)
console.log("→ p09-home-mobile");
const mobile = await browser.newContext({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 2 });
const mp = await mobile.newPage();
await mp.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 30000 });
await mp.waitForTimeout(900);
await mp.screenshot({ path: path.join(OUT, "p09-home-mobile.png"), fullPage: true });

console.log("done");
await browser.close();
