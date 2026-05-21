// sermons 샘플 6건 시드
// 사용: cd web && node scripts/seed-sermons.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadDotenv(path) {
  try {
    const txt = readFileSync(path, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (process.env[m[1]] == null) process.env[m[1]] = v;
    }
  } catch {}
}
loadDotenv(".env.local");

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// 기존 자동 시드 제거
await sb.from("sermons").delete().like("title", "[샘플]%");

// YouTube 11자리 ID — 가까운교회 톤에 맞춰 보편적인 한국 찬양/설교 영상 IDs (placeholder)
// 실제 운영 시에는 admin에서 교체합니다.
const rows = [
  {
    title: "[샘플] 서로 사랑하라 — 새 계명의 자리",
    preacher: "김요한 담임목사",
    verse: "요한복음 13:34-35",
    badge: "주일 2부",
    youtube_id: "dQw4w9WgXcQ",
    duration: "38:21",
    summary: "예수님이 마지막 밤에 남기신 새 계명을 오늘 우리의 식탁과 일터로 가져옵니다. 사랑이 명령이 될 수 있는 자리는 어디인지, 그 자리에서 우리는 무엇을 선택할 수 있는지 함께 묵상합니다.",
    preached_at: "2026-05-19",
  },
  {
    title: "[샘플] 광야의 만나 — 오늘의 양식",
    preacher: "이은혜 부목사",
    verse: "출애굽기 16:1-21",
    badge: "수요 강해",
    youtube_id: "M7lc1UVf-VE",
    duration: "42:07",
    summary: "하루치 양식만 거두라는 명령이 우리에게 주는 자유에 대해 묵상합니다. 광야는 결핍의 자리가 아니라 매일의 의존을 배우는 자리였습니다.",
    preached_at: "2026-05-15",
  },
  {
    title: "[샘플] 여호와는 나의 목자시니",
    preacher: "김요한 담임목사",
    verse: "시편 23:1-6",
    badge: "주일 1부",
    youtube_id: "9bZkp7q19f0",
    duration: "35:54",
    summary: "익숙한 시편 23편을 한 절씩 천천히 다시 듣습니다. 부족함이 없다는 고백이 어디서 시작되는지, 사망의 음침한 골짜기를 지날 때 누구를 바라봐야 하는지 함께 살펴봅니다.",
    preached_at: "2026-05-12",
  },
  {
    title: "[샘플] 엘리야와 까마귀",
    preacher: "이은혜 부목사",
    verse: "열왕기상 17:1-7",
    badge: "수요 강해",
    youtube_id: "kJQP7kiw5Fk",
    duration: "39:48",
    summary: "공급하시는 하나님과, 그 공급을 기다리는 사람의 마음을 함께 보겠습니다. 가뭄의 자리에 까마귀를 보내신 하나님은 오늘도 우리의 삶의 작은 시냇가에서 일하십니다.",
    preached_at: "2026-05-08",
  },
  {
    title: "[샘플] 어린이와 천국",
    preacher: "김요한 담임목사",
    verse: "마태복음 19:13-15",
    badge: "주일 2부",
    youtube_id: "OPf0YbXqDm0",
    duration: "40:12",
    summary: "어린이주일에 함께 듣는, 어린이를 향한 예수님의 마음을 묵상합니다. 누가 천국에 가까이 있는가, 우리가 다시 어린아이처럼 된다는 것은 무엇인가?",
    preached_at: "2026-05-05",
  },
  {
    title: "[샘플] 다시 갈릴리로",
    preacher: "김요한 담임목사",
    verse: "요한복음 21:1-14",
    badge: "주일 1부",
    youtube_id: "fJ9rUzIMcZQ",
    duration: "33:21",
    summary: "부활하신 주님이 다시 일터로 부르시는 자리. 빈 그물의 자리에서 다시 시작하시는 주님의 음성을 함께 듣습니다.",
    preached_at: "2026-04-28",
  },
];

const { data, error } = await sb.from("sermons").insert(rows).select("id, title");
if (error) { console.error("insert failed:", error.message); process.exit(1); }
console.log(`✓ inserted ${data.length} sermons`);
for (const s of data) console.log(`  - #${s.id} ${s.title}`);
