// Unsplash 고화질 이미지 URL — 모두 200 OK 검증 완료
const u = (id: string, w = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// 검증된 풀 — 분위기 분배에 사용
const POOL = {
  cathedralInterior: "photo-1438032005730-c779502df39b", // 큰 예배당 빛
  emptyPews: "photo-1507692049790-de58290a4334", // 빈 의자
  worshipHands: "photo-1545987796-200677ee1011", // 예배 손
  windowLight: "photo-1490127252417-7c393f993ee4", // 창 빛
  warmGroup: "photo-1529070538774-1843cb3265df", // 따뜻한 모임
  crossWall: "photo-1601121141461-9d6647bca1ed", // 십자가
  chapelOutside: "photo-1531058020387-3be344556be6", // 채플 외관
  kids: "photo-1503454537195-1dcabb73ffb9", // 아이들 책
  mission: "photo-1521295121783-8a321d551ad2", // 손 받침
  concertLight: "photo-1485579149621-3123dd979885", // 빛 공연
  coffeeChat: "photo-1543269865-cbf427effbad", // 카페 대화
  women: "photo-1573497019418-b400bb3ab074", // 여성 인물
  bibleHand: "photo-1473625247510-8ceb1760943f", // 성경
  candleSoft: "photo-1503676260728-1c00da094a0b", // 부드러운 빛
  praying: "photo-1564540583246-934409427776", // 기도
  dawnSky: "photo-1462536943532-57a629f6cc60", // 새벽
  fellowship: "photo-1480714378408-67cf0d13bc1b", // 친교
  reading: "photo-1542816417-0983c9c9ad53", // 책 읽기
  silhouette: "photo-1574680096145-d05b474e2155", // 실루엣
};

export const IMG = {
  // 메인 hero — 빛이 들어오는 차분한 예배당
  hero: u(POOL.cathedralInterior, 2880),
  // about 섹션 / 에디토리얼
  about1: u(POOL.emptyPews),
  about2: u(POOL.windowLight),
  about3: u(POOL.crossWall),
  about4: u(POOL.candleSoft),
  // 예배 섹션 배경
  worshipBg: u(POOL.worshipHands, 2880),
  // CTA — 따뜻한 모임/대화
  cta: u(POOL.warmGroup, 2400),
  // 페이지별 헤더
  greeting: u(POOL.emptyPews),
  vision: u(POOL.crossWall),
  history: u(POOL.cathedralInterior),
  location: u(POOL.chapelOutside),
  worship: u(POOL.windowLight),
  sunday: u(POOL.worshipHands),
  wednesday: u(POOL.praying),
  dawn: u(POOL.dawnSky),
  friday: u(POOL.silhouette),
  ministry: u(POOL.chapelOutside),
  children: u(POOL.kids),
  youth: u(POOL.warmGroup),
  mission: u(POOL.mission),
  praise: u(POOL.concertLight),
  community: u(POOL.fellowship),
  cell: u(POOL.coffeeChat),
  men: u(POOL.reading),
  women: u(POOL.women),
  media: u(POOL.concertLight),
  sermon: u(POOL.bibleHand),
  gallery: u(POOL.cathedralInterior),
  notice: u(POOL.bibleHand),
  board: u(POOL.fellowship),
  newMember: u(POOL.warmGroup),
  login: u(POOL.windowLight),
};
