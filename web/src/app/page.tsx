import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type Notice = { id: number; title: string; created_at: string; pinned: boolean };

async function getRecentNotices(): Promise<Notice[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("notices")
      .select("id, title, created_at, pinned")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6);
    return (data as Notice[]) ?? [];
  } catch {
    return [];
  }
}

const dummyNotices: Notice[] = [
  { id: 1, title: "2026년 상반기 전교인 수련회 안내", created_at: "2026-05-18", pinned: true },
  { id: 2, title: "어버이주일 — 부모님 점심 식사 초청", created_at: "2026-05-12", pinned: false },
  { id: 3, title: "새가족부 정기 모임 (매월 둘째 주일)", created_at: "2026-05-09", pinned: false },
  { id: 4, title: "교회력 5월호 발간 — 입구 데스크에서", created_at: "2026-05-04", pinned: true },
  { id: 5, title: "청년부 야외 예배 (자전거 라이딩 · 한강길)", created_at: "2026-04-28", pinned: false },
  { id: 6, title: "선교부 동남아 단기선교 보고회 안내", created_at: "2026-04-21", pinned: false },
];

const sermons = [
  { badge: "주일 2부", duration: "38:21", date: "2026. 05. 19 · 주일", title: "서로 사랑하라 — 새 계명의 자리", verse: "요한복음 13:34-35", preacher: "김요한 담임목사" },
  { badge: "수요 강해", duration: "42:07", date: "2026. 05. 15 · 수요일", title: "광야의 만나 — 오늘의 양식", verse: "출애굽기 16:1-21", preacher: "이은혜 부목사" },
  { badge: "주일 1부", duration: "35:54", date: "2026. 05. 12 · 주일", title: "여호와는 나의 목자시니", verse: "시편 23:1-6", preacher: "김요한 담임목사" },
];

const weekly = [
  { d: "21", w: "WED", title: "수요 강해예배", time: "저녁 7:30 · 본당" },
  { d: "23", w: "FRI", title: "금요 합심 기도회", time: "저녁 8:00 · 본당" },
  { d: "24", w: "SUN", title: "주일 1부 · 2부 예배", time: "오전 9:00 · 11:00" },
  { d: "24", w: "SUN", title: "새가족 환영 점심", time: "낮 12:30 · 친교실" },
  { d: "25", w: "MON", title: "여전도회 월례모임", time: "오전 10:30 · 2층" },
];

const galleryItems = [
  { cls: "t1", t: "주일 본당 — 봄 부활절 예배", d: "2026. 04. 05" },
  { cls: "t2", t: "찬양대 연습", d: "2026. 04. 12" },
  { cls: "t3", t: "주일학교 봄소풍", d: "2026. 04. 20" },
  { cls: "t4", t: "금요 합심기도회", d: "2026. 05. 02" },
  { cls: "t5", t: "어버이주일 점심 나눔", d: "2026. 05. 12" },
  { cls: "t6", t: "단기선교 보고회", d: "2026. 05. 18" },
];

export default async function Home() {
  const fetched = await getRecentNotices();
  const notices = fetched.length > 0 ? fetched : dummyNotices;

  return (
    <>
      {/* ============ Hero ============ */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-glass" aria-hidden>
          <svg viewBox="0 0 380 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#c79e5f" stopOpacity=".55" />
                <stop offset="1" stopColor="#b08648" stopOpacity=".15" />
              </linearGradient>
            </defs>
            <path d="M40 520 V200 a150 150 0 0 1 300 0 V520 Z" fill="none" stroke="url(#gg)" strokeWidth="1.5" />
            <path d="M70 520 V215 a120 120 0 0 1 240 0 V520 Z" fill="none" stroke="url(#gg)" strokeWidth="1" />
            <path d="M100 520 V230 a90 90 0 0 1 180 0 V520 Z" fill="none" stroke="url(#gg)" strokeWidth="1" />
            <g stroke="url(#gg)" strokeWidth="2" fill="none">
              <line x1="190" y1="240" x2="190" y2="380" />
              <line x1="150" y1="280" x2="230" y2="280" />
            </g>
            <g stroke="url(#gg)" strokeWidth="0.6" opacity=".7">
              <line x1="190" y1="100" x2="190" y2="180" />
              <line x1="110" y1="160" x2="160" y2="200" />
              <line x1="270" y1="160" x2="220" y2="200" />
            </g>
            <g stroke="url(#gg)" strokeWidth="0.5" opacity=".5">
              <line x1="100" y1="320" x2="280" y2="320" />
              <line x1="100" y1="400" x2="280" y2="400" />
              <line x1="100" y1="460" x2="280" y2="460" />
            </g>
          </svg>
        </div>

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="line" />
              <span>WELCOME · 김포 한강신도시 운양동</span>
            </div>
            <h1>
              가깝게, 따뜻하게<br />
              <span className="gold">함께 걸어가는 교회</span>
            </h1>
            <blockquote className="verse">
              “수고하고 무거운 짐 진 자들아 다 내게로 오라<br />내가 너희를 쉬게 하리라.”
              <cite>— 마태복음 11:28</cite>
            </blockquote>
            <div className="hero-ctas">
              <Link className="btn-gold" href="/worship/sunday">예배 시간 안내</Link>
              <Link className="btn-line" href="/new-member">처음 오시는 분</Link>
            </div>
          </div>
        </div>

        <div className="hero-strip">
          <div className="hero-strip-inner">
            <div className="col"><span className="k">금주 주일</span><span className="v">2026. 5. 24 (주일)</span></div>
            <div className="col"><span className="k">주일 예배</span><span className="v">오전 9:00 · 11:00</span></div>
            <div className="col"><span className="k">설교 본문</span><span className="v">요한복음 13:34-35</span></div>
            <div className="col"><span className="k">설교자</span><span className="v">김요한 담임목사</span></div>
          </div>
        </div>
      </section>

      {/* ============ Quick access ============ */}
      <section className="quick">
        <div className="wrap">
          <div className="quick-grid">
            <Link className="quick-card" href="/worship/sunday">
              <div className="quick-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>예배안내</h3>
              <p>주일·수요·새벽예배 시간과 본당 안내를 확인하세요.</p>
              <span className="more">바로가기</span>
            </Link>
            <Link className="quick-card" href="/media/sermon">
              <div className="quick-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4Z"/><path d="M4 4v12a4 4 0 0 0 4 4"/><path d="M8 8h8M8 12h8"/></svg>
              </div>
              <h3>설교말씀</h3>
              <p>매주 선포된 말씀을 영상과 글로 다시 들으실 수 있습니다.</p>
              <span className="more">바로가기</span>
            </Link>
            <Link className="quick-card" href="/notices">
              <div className="quick-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v14H4z"/><path d="M4 9h16"/><path d="M8 13h8M8 16h5"/></svg>
              </div>
              <h3>교회소식</h3>
              <p>공지사항, 주간 일정, 행사 소식을 한눈에 확인하세요.</p>
              <span className="more">바로가기</span>
            </Link>
            <Link className="quick-card" href="/new-member">
              <div className="quick-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M17 7v6M14 10h6"/></svg>
              </div>
              <h3>새가족등록</h3>
              <p>처음 오신 분, 등록하실 분은 이곳에서 안내받으세요.</p>
              <span className="more">바로가기</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Worship schedule ============ */}
      <section className="block worship-block">
        <div className="wrap">
          <div className="sec-title">
            <span className="eyebrow">Worship Service</span>
            <h2>한 주의 예배를 안내해 드립니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>예배는 한 주의 가장 깊은 자리에 놓이는 시간입니다.<br />온 가족이 한 자리에 모여 주님 앞에 나아갑니다.</p>
          </div>

          <div className="schedule" role="table">
            <div className="sched-row head" role="row">
              <div className="cell c-day">요일</div>
              <div className="cell c-name">예배명</div>
              <div className="cell c-time">시간</div>
              <div className="cell c-pastor">설교 · 장소</div>
              <div className="cell c-act">안내</div>
            </div>

            {[
              { day: "주일", en: "Sunday · 1부", name: "주일 1부 예배", sub: "조용히 시작하는 이른 아침 예배", time: "09 : 00", dur: "약 70분", pastor: "김요한 담임목사", place: "본당 · 2층", href: "/worship/sunday" },
              { day: "주일", en: "Sunday · 2부", name: "주일 2부 예배", sub: "온 가족이 함께 드리는 본 예배", time: "11 : 00", dur: "약 80분", pastor: "김요한 담임목사", place: "본당 · 2층 / 영상 송출 · 3층", href: "/worship/sunday" },
              { day: "수요일", en: "Wednesday", name: "수요 강해예배", sub: "말씀과 기도의 자리", time: "19 : 30", dur: "약 60분", pastor: "이은혜 부목사", place: "본당 · 2층", href: "/worship/wednesday" },
              { day: "금요일", en: "Friday", name: "금요 기도회", sub: "한 주를 정돈하는 합심 기도", time: "20 : 00", dur: "약 90분", pastor: "교역자 순번", place: "본당 · 2층", href: "/worship/friday" },
              { day: "평일", en: "Weekday", name: "새벽 기도회", sub: "하루를 주님과 함께 여는 자리", time: "05 : 30", dur: "약 60분", pastor: "담임 · 부목사", place: "본당 · 2층", href: "/worship/dawn" },
            ].map((r) => (
              <div key={r.name} className="sched-row body" role="row">
                <div className="cell c-day"><span className="ko">{r.day}</span><span className="en">{r.en}</span></div>
                <div className="cell c-name">{r.name}<small>{r.sub}</small></div>
                <div className="cell c-time">{r.time}<small>{r.dur}</small></div>
                <div className="cell c-pastor">{r.pastor}<small>{r.place}</small></div>
                <div className="cell c-act"><Link href={r.href}>자세히</Link></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Pastor greeting ============ */}
      <section className="pastor-block">
        <div className="wrap">
          <div className="pastor-grid">
            <div className="pastor-photo">
              <div className="ph" />
              <span className="ph-label">담임목사 · PORTRAIT</span>
            </div>
            <div className="pastor-info">
              <span className="eyebrow">Pastor&apos;s Greeting</span>
              <h2>인사말 — 한 분, 한 분을<br />마음 다해 환영합니다.</h2>
              <p className="lead">
                “우리 교회는 큰 교회가 되기를 구하지 않습니다.<br />
                다만, 우리 동네에서 가장 ‘가까운’ 교회가 되기를 기도합니다.”
              </p>
              <p>
                가까운교회는 2015년, 김포 한강신도시 운양동의 작은 상가 한 칸에서 일곱 가정으로 시작되었습니다.
                화려한 무대보다 한 사람의 영혼을 더 귀하게 여기며, 매주 예배 안에서 하나님과 가까이, 이웃과 가까이 살아가는 길을 함께 걷고자 합니다.
              </p>
              <p>
                지친 마음, 무거운 짐을 안고 오시는 분께 따뜻한 차 한 잔과 함께 자리를 내어 드리는 교회 — 그것이 저희가 바라는 작고 분명한 모습입니다.
                언제든 편안한 마음으로 한 발 가까이 와 주십시오.
              </p>
              <div className="pastor-sign">
                <div className="name-block">
                  <div className="role">담임목사 · Senior Pastor</div>
                  <div className="name">김 요 한 목사</div>
                </div>
                <div className="seal">印</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Sermons ============ */}
      <section className="block sermons-block">
        <div className="wrap">
          <div className="sermons-head">
            <div className="title-side">
              <span className="eyebrow">Recent Sermons</span>
              <h2>최근 설교말씀</h2>
            </div>
            <Link className="more-link" href="/media/sermon">전체 설교 보기</Link>
          </div>

          <div className="sermons-grid">
            {sermons.map((s) => (
              <article key={s.title} className="sermon-card">
                <div className="sermon-thumb">
                  <div className="ph" />
                  <span className="badge">{s.badge}</span>
                  <span className="duration">{s.duration}</span>
                  <div className="play">
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                  </div>
                </div>
                <div className="sermon-body">
                  <div className="date">{s.date}</div>
                  <h3>{s.title}</h3>
                  <div className="verse">{s.verse}</div>
                  <div className="preacher">{s.preacher}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Notices + Weekly ============ */}
      <section className="block">
        <div className="wrap">
          <div className="info-grid">
            <div className="panel">
              <div className="panel-head">
                <h3>교회 공지사항</h3>
                <Link className="all" href="/notices">전체보기 →</Link>
              </div>
              <ul className="notice-list">
                {notices.map((n) => {
                  const isNew = (Date.now() - new Date(n.created_at).getTime()) < 14 * 24 * 60 * 60 * 1000;
                  const dateShort = formatDate(n.created_at).replace(/^\d{4}\.\s/, "");
                  return (
                    <li key={n.id}>
                      <span className={"tag " + (n.pinned ? "notice" : "news")}>{n.pinned ? "공지" : "소식"}</span>
                      <span className="ttl">
                        <Link href={`/notices/${n.id}`}>{n.title}</Link>
                        {isNew && <span className="new">N</span>}
                      </span>
                      <span className="date">{dateShort}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>이번 주 일정</h3>
                <Link className="all" href="/notices">교회력 →</Link>
              </div>
              <ul className="week-list">
                {weekly.map((w, i) => (
                  <li key={i} className="item">
                    <div className="day"><div className="d">{w.d}</div><div className="w">{w.w}</div></div>
                    <div className="info"><div className="title">{w.title}</div><div className="time">{w.time}</div></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Gallery ============ */}
      <section className="block gallery-block">
        <div className="wrap">
          <div className="sec-title">
            <span className="eyebrow">Photo Gallery</span>
            <h2>가까운교회의 순간들</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>함께 드린 예배, 함께 나눈 식탁, 함께 걸은 골목.<br />우리 교회의 작은 이야기를 담았습니다.</p>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((g, i) => (
              <div key={i} className={`gtile ${g.cls}`}>
                <div className="ph" />
                <div className="ovl">
                  <div className="t">{g.t}</div>
                  <div className="d">{g.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Location ============ */}
      <section className="block loc-block">
        <div className="wrap">
          <div className="sec-title">
            <span className="eyebrow">Visit Us</span>
            <h2>오시는 길</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
          </div>

          <div className="loc-grid">
            <div className="map-box">
              <div className="ph" />
              <div className="road" />
              <span className="pin" />
              <span className="pin-label">가까운교회</span>
            </div>
            <div className="loc-info">
              <span className="eyebrow">Address &amp; Contact</span>
              <h3>가까운교회</h3>
              <div className="sub">경기도 김포시 운양동 · 한강신도시</div>
              <dl>
                <dt>주소</dt>
                <dd>경기도 김포시 운양동 0000-0<span className="small">한강신도시 운양로 인근</span></dd>
                <dt>전화</dt>
                <dd>031 — 000 — 0000<span className="small">평일 오전 9:00 – 오후 6:00</span></dd>
                <dt>이메일</dt>
                <dd>office@nearchurch.kr</dd>
                <dt>대중교통</dt>
                <dd>김포골드라인 운양역<span className="small">3번 출구 · 도보 약 10분</span></dd>
                <dt>주차</dt>
                <dd>교회 지하 주차장<span className="small">주일 예배 시 인근 공영주차장 무료</span></dd>
              </dl>
              <div className="actions">
                <Link className="btn-primary" href="/about/location">길찾기 안내</Link>
                <Link className="more-link" href="/about/location">지도 크게 보기</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
