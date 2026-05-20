// 게시판/공지/새가족 각각 50건 시드
// 사용: cd web && node scripts/seed-50.mjs

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

// 날짜 분포: 오늘부터 과거 6개월 사이 균등 분포
const now = Date.now();
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;
function daysAgoIso(i, total) {
  const ratio = i / Math.max(1, total - 1);
  const ts = now - Math.floor(ratio * SIX_MONTHS_MS);
  return new Date(ts).toISOString();
}

const SAMPLE_AUTHORS = ["김유진", "박지훈", "이서연", "최민재", "정하늘", "한도윤", "오시우", "윤서아", "임지안", "노은우", "백다현", "송채원", "고건우", "장수아", "안태이"];

const NOTICE_TITLES = [
  "2026년 상반기 전교인 수련회 안내",
  "어버이주일 — 부모님 점심 식사 초청",
  "새가족부 정기 모임 (매월 둘째 주일)",
  "교회력 5월호 발간 — 입구 데스크에서",
  "청년부 야외 예배 (자전거 라이딩 · 한강길)",
  "선교부 동남아 단기선교 보고회",
  "여전도회 월례 모임 장소 안내",
  "남선교회 봉사 — 인근 어르신 댁 환경 정비",
  "주일학교 어린이주일 행사 안내",
  "수요예배 본문 변경 안내",
  "금요 기도회 시간 조정 (8시 30분)",
  "교회 차량 정기 점검 일정",
  "성탄절 칸타타 합창단원 모집",
  "신년 감사예배 안내",
  "사순절 묵상집 배부",
  "여름 성경학교 모집 시작",
  "교회 주차 운영 변경 공지",
  "교회 공동체 사진전 — 친교실",
  "헌혈 캠페인 안내",
  "장년부 성경통독 모임 시작",
  "초등부 가족 캠프 일정",
  "선교 헌금 결산 보고",
  "찬양대 신규 단원 환영회",
  "셀 모임 장소 변경 안내",
  "주보 광고 신청 안내",
  "교회 명부 정비 — 연락처 확인",
  "여름 단기선교 — 캄보디아 일정 확정",
  "교회 학교 교사 모집",
  "주일 점심 식사 메뉴 변경",
  "송년 감사예배 시간 안내",
];

const NOTICE_BODY_TEMPLATES = [
  "이번 주 주보와 함께 자세한 안내문을 배부합니다. 참여 신청은 입구 안내데스크에서 받습니다.",
  "성도 여러분의 많은 관심과 참여를 부탁드립니다. 문의는 사무실로 연락 주세요.",
  "다음 주일까지 신청을 받습니다. 신청서는 교회 홈페이지에서도 다운로드 받으실 수 있습니다.",
  "기존 일정과 일부 변경된 부분이 있으니 주보를 꼭 확인해 주세요.",
];

const BOARD_TITLES = [
  "이번 주 설교 너무 은혜로웠습니다", "새가족 환영 점심 사진 공유합니다", "주일학교 봄소풍 후기",
  "QT 나눔 — 시편 23편을 묵상하며", "교회 인근 카페 추천드려요", "수요예배 참여 후기",
  "여름 단기선교 함께 가실 분", "기도 부탁드려요", "찬양대 합창 연습 일정 공유",
  "어린이주일 행사 사진", "교회 셔틀 시간 문의", "주차장 이용 팁",
  "셀 모임 후기 — 따뜻한 시간이었습니다", "성경통독 함께 하실 분", "주보 광고 신청은 어디서 하나요?",
  "교회 청소 봉사 함께 해요", "유아실 이용 문의", "선교 후원 가정 소식",
  "지난 주 부흥회 은혜 나눔", "찬양 추천 — 새로 알게 된 곡",
  "주일 점심 메뉴 의견 받습니다", "교회 화단 꽃 심기 봉사 모집",
  "노숙인 사역 봉사 함께 하실 분", "겨울 김장 봉사 후기",
  "북클럽 신간 추천", "어른들을 위한 큐티 모임 소개",
  "주일학교 교사 헌신 인터뷰", "선교지 후원 가정에 보내는 편지",
  "성탄 칸타타 사진 공유", "신년 새벽기도 함께 해요",
];

const BOARD_BODY = (i) => {
  const lines = [
    "이번 주에 받은 은혜를 함께 나누고 싶어 글을 남깁니다.",
    "처음에는 어색했지만, 함께 모인 자리에서 마음이 조금씩 열리는 시간이었습니다.",
    "다음 주에도 함께 모이기로 했습니다. 관심 있으신 분들 환영합니다.",
    "구체적인 시간과 장소는 사무실 또는 댓글로 문의 주세요.",
  ];
  return lines.slice(0, ((i % 4) + 1)).join("\n\n");
};

const VISITED_FROM = ["주변 이웃 소개", "지인 초청", "인터넷 검색", "현수막 보고", "교회 차량 보고"];

async function clearOldAuto() {
  // 자동 시드만 정리: 이름/제목 prefix 매칭
  await sb.from("notices").delete().like("title", "[시드]%");
  await sb.from("board_posts").delete().like("title", "[시드]%");
  await sb.from("new_members").delete().like("name", "시드_%");
  // 이전 자동 생성 데이터(CRUD 테스트)는 그대로 두지 않고 정리
  await sb.from("board_posts").delete().like("title", "[자동]%");
  await sb.from("new_members").delete().like("name", "CRUD_AUTO%");
  await sb.from("new_members").delete().like("name", "CRUD_TEST%");
}

async function seedNotices() {
  const rows = [];
  for (let i = 0; i < 50; i++) {
    const base = NOTICE_TITLES[i % NOTICE_TITLES.length];
    rows.push({
      title: `[시드] ${base} (#${String(i + 1).padStart(2, "0")})`,
      content: `${NOTICE_BODY_TEMPLATES[i % NOTICE_BODY_TEMPLATES.length]}\n\n— 가까운교회 사무국`,
      pinned: i < 5, // 상위 5건은 고정
      created_at: daysAgoIso(i, 50),
      author_email: "office@nearchurch.kr",
    });
  }
  const { error, data } = await sb.from("notices").insert(rows).select("id");
  if (error) throw error;
  return data.length;
}

async function seedBoard() {
  const rows = [];
  for (let i = 0; i < 50; i++) {
    rows.push({
      title: `[시드] ${BOARD_TITLES[i % BOARD_TITLES.length]} (#${String(i + 1).padStart(2, "0")})`,
      content: BOARD_BODY(i),
      author_name: SAMPLE_AUTHORS[i % SAMPLE_AUTHORS.length],
      author_email: null,
      image_urls: [],
      views: Math.floor(Math.random() * 80),
      created_at: daysAgoIso(i, 50),
    });
  }
  const { error, data } = await sb.from("board_posts").insert(rows).select("id");
  if (error) throw error;
  return data.length;
}

async function seedNewMembers() {
  const rows = [];
  for (let i = 0; i < 50; i++) {
    const name = `시드_${SAMPLE_AUTHORS[i % SAMPLE_AUTHORS.length]}${String(i + 1).padStart(2, "0")}`;
    const phone = `010-${String(7000 + i).padStart(4, "0")}-${String(1000 + i).padStart(4, "0")}`;
    rows.push({
      name,
      phone,
      gender: i % 2 === 0 ? "M" : "F",
      birth_date: `19${70 + (i % 30)}-${String(((i % 12) + 1)).padStart(2, "0")}-${String(((i % 27) + 1)).padStart(2, "0")}`,
      address: `김포 한강신도시 운양동 (시드 ${i + 1})`,
      marital_status: i % 3 === 0 ? "single" : i % 3 === 1 ? "married" : "other",
      invited_by: SAMPLE_AUTHORS[(i + 3) % SAMPLE_AUTHORS.length],
      introduction: `${VISITED_FROM[i % VISITED_FROM.length]}로 처음 방문하게 되었습니다.`,
      prayer_request: i % 4 === 0 ? "가정의 평안과 자녀의 신앙 성장" : i % 4 === 1 ? "건강 회복" : i % 4 === 2 ? "직장에서의 사명 발견" : "교회에 잘 정착하기",
      visited_at: daysAgoIso(i, 50).slice(0, 10),
      created_at: daysAgoIso(i, 50),
    });
  }
  const { error, data } = await sb.from("new_members").insert(rows).select("id");
  if (error) throw error;
  return data.length;
}

const t0 = Date.now();
console.log("Clearing previous auto/seed rows ...");
await clearOldAuto();
console.log("Seeding notices ...");
const n = await seedNotices();
console.log(`  ✓ ${n} notices`);
console.log("Seeding board posts ...");
const b = await seedBoard();
console.log(`  ✓ ${b} board posts`);
console.log("Seeding new members ...");
const m = await seedNewMembers();
console.log(`  ✓ ${m} new members`);
console.log(`Done in ${Math.round((Date.now() - t0) / 1000)}s`);
