// 실제 YouTube 영상으로 설교 6건 교체
// 사용: cd web && node scripts/reseed-sermons-real.mjs

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

// 기존 [샘플] 시드 모두 제거
await sb.from("sermons").delete().like("title", "[샘플]%");

const rows = [
  {
    title: "새 계명, 서로 사랑하라",
    preacher: "양평 주사랑교회",
    verse: "요한복음 13:31-35",
    badge: "주일 설교",
    youtube_id: "zo6tryp9w30",
    duration: "20:01",
    summary: "예수님이 마지막 밤에 남기신 새 계명을 오늘 우리의 식탁과 일터로 가져옵니다. 사랑이 명령이 될 수 있는 자리는 어디인지, 그 자리에서 우리는 무엇을 선택할 수 있는지 함께 묵상합니다. (출처 채널: 양평주사랑교회)",
    preached_at: "2025-05-18",
  },
  {
    title: "만나를 내리신 하나님",
    preacher: "황명환 목사 (수서교회)",
    verse: "출애굽기 16:1-20",
    badge: "주일 설교",
    youtube_id: "ED4jFXgimhA",
    duration: "33:43",
    summary: "광야의 만나를 통해 오늘 우리에게 일용할 양식이 무엇인지 다시 묻습니다. 하루치만 거두라는 명령 안에 담긴 자유에 대해 묵상합니다. (출처 채널: 수서교회방송)",
    preached_at: "2025-04-20",
  },
  {
    title: "여호와는 나의 목자이시니",
    preacher: "김소리 목사 (평촌교회)",
    verse: "시편 23:1-6",
    badge: "주일 설교",
    youtube_id: "g7Wa3b4YMbE",
    duration: "30:00",
    summary: "익숙한 시편 23편을 한 절씩 천천히 다시 듣습니다. 부족함이 없다는 고백이 어디서 시작되는지, 사망의 음침한 골짜기를 지날 때 누구를 바라봐야 하는지 함께 살펴봅니다. (출처 채널: 평촌교회)",
    preached_at: "2023-10-08",
  },
  {
    title: "엘리야 다시보기 — 그릿 시냇가의 은혜",
    preacher: "삼일교회",
    verse: "열왕기상 17:1-7",
    badge: "강해 설교",
    youtube_id: "m7REfemQdRc",
    duration: "30:00",
    summary: "공급하시는 하나님과, 그 공급을 기다리는 사람의 마음을 함께 살핍니다. 가뭄의 자리에 까마귀를 보내신 하나님은 오늘도 우리 삶의 작은 시냇가에서 일하십니다. (출처 채널: SamilChurch삼일교회)",
    preached_at: "2024-03-10",
  },
  {
    title: "어린 아이 같은 자들의 천국",
    preacher: "보라마을교회",
    verse: "마태복음 19:13-15",
    badge: "어린이주일",
    youtube_id: "q7L8oo32di4",
    duration: "30:00",
    summary: "어린이주일에 함께 듣는, 어린이를 향한 예수님의 마음을 묵상합니다. 누가 천국에 가까이 있는가, 다시 어린아이처럼 된다는 것은 무엇인가? (출처 채널: 보라마을교회)",
    preached_at: "2018-05-06",
  },
  {
    title: "153의 은혜 — 부활하신 주님이 차리신 식탁",
    preacher: "안광복 담임목사 (상당교회)",
    verse: "요한복음 21:1-14",
    badge: "주일 설교",
    youtube_id: "za-DCDhHuhs",
    duration: "40:00",
    summary: "부활하신 주님이 다시 일터로 부르시는 자리. 빈 그물의 자리에서 다시 시작하시는 주님의 음성을 함께 듣습니다. (출처 채널: 상당교회SDTV)",
    preached_at: "2022-12-04",
  },
];

const { data, error } = await sb.from("sermons").insert(rows).select("id, title");
if (error) { console.error("insert failed:", error.message); process.exit(1); }
console.log(`✓ inserted ${data.length} sermons`);
for (const s of data) console.log(`  - #${s.id} ${s.title}`);
