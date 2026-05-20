import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type RecentNotice = { id: number; title: string; created_at: string; pinned: boolean };

async function getRecentNotices(): Promise<RecentNotice[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("notices")
      .select("id, title, created_at, pinned")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6);
    return (data as RecentNotice[]) ?? [];
  } catch {
    return [];
  }
}

const galleryTiles = [
  { src: "/church_01.jpg", t: "주일 본당 — 봄 부활절 예배", d: "2026. 04. 05", cls: "lg:col-span-6 lg:row-span-3" },
  { src: "/church_02.jpg", t: "찬양대 연습", d: "2026. 04. 12", cls: "lg:col-span-3 lg:row-span-3" },
  { src: "/church_03.jpg", t: "주일학교 봄소풍", d: "2026. 04. 20", cls: "lg:col-span-3 lg:row-span-3" },
  { src: "/church_04.jpg", t: "금요 합심기도회", d: "2026. 05. 02", cls: "lg:col-span-4 lg:row-span-2" },
  { src: "/church_05.jpg", t: "어버이주일 점심 나눔", d: "2026. 05. 12", cls: "lg:col-span-4 lg:row-span-2" },
  { src: "/church_06.jpg", t: "단기선교 보고회", d: "2026. 05. 18", cls: "lg:col-span-4 lg:row-span-2" },
];

const sermons = [
  { thumb: "/church_15.jpg", badge: "주일 2부", duration: "38:21", date: "2026. 05. 19 · 주일", title: "서로 사랑하라 — 새 계명의 자리", verse: "요한복음 13:34-35", preacher: "김요한 담임목사" },
  { thumb: "/church_17.jpg", badge: "수요 강해", duration: "42:07", date: "2026. 05. 15 · 수요일", title: "광야의 만나 — 오늘의 양식", verse: "출애굽기 16:1-21", preacher: "이은혜 부목사" },
  { thumb: "/church_18.jpg", badge: "주일 1부", duration: "35:54", date: "2026. 05. 12 · 주일", title: "여호와는 나의 목자시니", verse: "시편 23:1-6", preacher: "김요한 담임목사" },
];

const weekly = [
  { d: "21", w: "WED", title: "수요 강해예배", time: "저녁 7:30 · 본당" },
  { d: "23", w: "FRI", title: "금요 합심 기도회", time: "저녁 8:00 · 본당" },
  { d: "24", w: "SUN", title: "주일 1부 · 2부 예배", time: "오전 9:00 · 11:00" },
  { d: "24", w: "SUN", title: "새가족 환영 점심", time: "낮 12:30 · 친교실" },
  { d: "25", w: "MON", title: "여전도회 월례모임", time: "오전 10:30 · 2층" },
];

export default async function Home() {
  const notices = await getRecentNotices();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative h-[640px] overflow-hidden bg-[var(--navy-deep)]">
        <Image
          src="/church_01.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,27,52,0.62) 0%, rgba(18,27,52,0.86) 100%)",
          }}
        />

        {/* Stained glass ornament */}
        <div
          className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[380px] h-[520px] opacity-70 pointer-events-none hidden lg:block"
          aria-hidden
        >
          <svg viewBox="0 0 380 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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

        <div className="relative h-full max-w-[1240px] mx-auto px-8 flex items-center">
          <div className="max-w-[680px] text-white">
            <div className="inline-flex items-center gap-3.5 mb-7 text-[var(--gold-2)] font-sans text-[14px] font-medium tracking-[0.18em]">
              <span className="block w-12 h-px bg-[var(--gold)]" />
              <span>WELCOME · 김포 한강신도시 운양동</span>
            </div>
            <h1 className="font-serif font-bold text-[44px] sm:text-[64px] leading-[1.25] tracking-[-0.045em] mb-7 text-white">
              가깝게, 따뜻하게<br />
              <span className="text-[var(--gold-2)] font-semibold">함께 걸어가는 교회</span>
            </h1>
            <blockquote className="border-l-[3px] border-[var(--gold)] pl-5 mb-9 font-serif text-[19px] leading-[1.85] text-white/90 max-w-[560px]">
              “수고하고 무거운 짐 진 자들아 다 내게로 오라<br />내가 너희를 쉬게 하리라.”
              <cite className="block mt-2.5 font-display italic text-[var(--gold-2)] text-[15px] tracking-[0.04em]">
                — 마태복음 11:28
              </cite>
            </blockquote>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/worship/sunday" className="btn-gold">예배 시간 안내</Link>
              <Link href="/new-member" className="btn-line">처음 오시는 분</Link>
            </div>
          </div>
        </div>

        {/* Hero bottom strip */}
        <div className="absolute left-0 right-0 bottom-0 bg-[rgba(18,27,52,0.92)] border-t border-[rgba(199,158,95,0.30)] backdrop-blur-sm">
          <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 text-white/90">
            {[
              { k: "금주 주일", v: "2026. 5. 24 (주일)" },
              { k: "주일 예배", v: "오전 9:00 · 11:00" },
              { k: "설교 본문", v: "요한복음 13:34-35" },
              { k: "설교자", v: "김요한 담임목사" },
            ].map((c, i) => (
              <div
                key={c.k}
                className={`px-6 py-5 flex flex-col gap-1 ${i > 0 ? "border-l border-[rgba(199,158,95,0.18)]" : ""}`}
              >
                <span className="font-sans text-[13px] text-[var(--gold-2)] tracking-[0.05em]">{c.k}</span>
                <span className="font-serif text-[18px] font-semibold tracking-[-0.02em]">{c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Quick access ============ */}
      <section className="bg-[var(--paper)] py-20">
        <div className="max-w-[1240px] mx-auto px-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/worship/sunday", title: "예배안내", desc: "주일·수요·새벽예배 시간과 본당 안내를 확인하세요.", svg: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></> },
            { href: "/media/sermon", title: "설교말씀", desc: "매주 선포된 말씀을 영상과 글로 다시 들으실 수 있습니다.", svg: <><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4Z"/><path d="M4 4v12a4 4 0 0 0 4 4"/><path d="M8 8h8M8 12h8"/></> },
            { href: "/notices", title: "교회소식", desc: "공지사항, 주간 일정, 행사 소식을 한눈에 확인하세요.", svg: <><path d="M4 5h16v14H4z"/><path d="M4 9h16"/><path d="M8 13h8M8 16h5"/></> },
            { href: "/new-member", title: "새가족등록", desc: "처음 오신 분, 등록하실 분은 이곳에서 안내받으세요.", svg: <><circle cx="9" cy="9" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M17 7v6M14 10h6"/></> },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group relative bg-white border border-[var(--line)] px-7 pt-9 pb-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] hover:border-[var(--gold-soft)] flex flex-col items-start gap-4"
            >
              <span className="absolute left-0 top-0 right-0 h-[3px] bg-[var(--gold)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              <div className="w-[60px] h-[60px] bg-[var(--paper-2)] text-[var(--navy)] flex items-center justify-center rounded-full">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[30px] h-[30px]">
                  {q.svg}
                </svg>
              </div>
              <h3 className="font-serif font-bold text-[22px] text-[var(--navy)] tracking-[-0.03em]">{q.title}</h3>
              <p className="text-[15px] text-[var(--mute)] leading-[1.7]">{q.desc}</p>
              <span className="mt-auto pt-2 font-serif text-[14px] text-[var(--gold)] font-semibold inline-flex gap-1.5 items-center">
                바로가기 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Worship schedule ============ */}
      <section className="bg-[var(--ivory)] py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Worship Service</span>
            <h2>한 주의 예배를 안내해 드립니다</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
            <p>예배는 한 주의 가장 깊은 자리에 놓이는 시간입니다.<br />온 가족이 한 자리에 모여 주님 앞에 나아갑니다.</p>
          </div>

          <div className="bg-white border border-[var(--line)] overflow-hidden card-shadow">
            <div className="hidden md:grid grid-cols-[140px_1.4fr_1fr_1.4fr_140px] items-center bg-[var(--navy)] text-[var(--gold-2)]">
              {["요일", "예배명", "시간", "설교 · 장소", "안내"].map((h, i) => (
                <div key={h} className={`px-6 py-4 font-serif text-[15px] font-semibold tracking-[0.05em] ${i < 4 ? "border-r border-[rgba(199,158,95,0.18)]" : ""} ${i === 0 || i === 2 || i === 4 ? "text-center" : ""}`}>
                  {h}
                </div>
              ))}
            </div>

            {[
              { day: "주일", en: "Sunday · 1부", name: "주일 1부 예배", sub: "조용히 시작하는 이른 아침 예배", time: "09 : 00", dur: "약 70분", pastor: "김요한 담임목사", place: "본당 · 2층", href: "/worship/sunday" },
              { day: "주일", en: "Sunday · 2부", name: "주일 2부 예배", sub: "온 가족이 함께 드리는 본 예배", time: "11 : 00", dur: "약 80분", pastor: "김요한 담임목사", place: "본당 · 2층 / 영상 송출 · 3층", href: "/worship/sunday" },
              { day: "수요일", en: "Wednesday", name: "수요 강해예배", sub: "말씀과 기도의 자리", time: "19 : 30", dur: "약 60분", pastor: "이은혜 부목사", place: "본당 · 2층", href: "/worship/wednesday" },
              { day: "금요일", en: "Friday", name: "금요 기도회", sub: "한 주를 정돈하는 합심 기도", time: "20 : 00", dur: "약 90분", pastor: "교역자 순번", place: "본당 · 2층", href: "/worship/friday" },
              { day: "평일", en: "Weekday", name: "새벽 기도회", sub: "하루를 주님과 함께 여는 자리", time: "05 : 30", dur: "약 60분", pastor: "담임 · 부목사", place: "본당 · 2층", href: "/worship/dawn" },
            ].map((r, idx, arr) => (
              <div
                key={r.name}
                className={`grid md:grid-cols-[140px_1.4fr_1fr_1.4fr_140px] grid-cols-1 items-center bg-white hover:bg-[var(--paper)] transition-colors ${idx < arr.length - 1 ? "border-b border-[var(--line)]" : ""}`}
              >
                <div className="md:text-center px-6 py-5 md:py-7 bg-[var(--paper)] md:border-r border-[var(--line)]">
                  <span className="block font-serif font-bold text-[24px] text-[var(--navy)] tracking-[-0.03em]">{r.day}</span>
                  <span className="block font-display italic text-[13px] text-[var(--gold)] mt-1">{r.en}</span>
                </div>
                <div className="px-6 py-5 md:py-7 md:border-r border-[var(--line)]">
                  <div className="font-serif font-semibold text-[20px] text-[var(--ink)] tracking-[-0.025em]">{r.name}</div>
                  <small className="block font-serif text-[13px] text-[var(--mute)] mt-1">{r.sub}</small>
                </div>
                <div className="md:text-center px-6 py-5 md:py-7 md:border-r border-[var(--line)]">
                  <div className="font-serif font-bold text-[24px] text-[var(--burgundy)] tracking-[-0.02em]">{r.time}</div>
                  <small className="block text-[13px] text-[var(--mute)] mt-1">{r.dur}</small>
                </div>
                <div className="px-6 py-5 md:py-7 md:border-r border-[var(--line)]">
                  <div className="text-[16px] text-[var(--body)]">{r.pastor}</div>
                  <small className="block text-[13px] text-[var(--mute)] mt-1">{r.place}</small>
                </div>
                <div className="px-6 py-5 md:py-7 md:text-center">
                  <Link href={r.href} className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[var(--navy)] text-[var(--navy)] font-serif text-[14px] font-medium hover:bg-[var(--navy)] hover:text-white transition-all">
                    자세히 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Pastor greeting ============ */}
      <section className="bg-[var(--paper)] py-24">
        <div className="max-w-[1240px] mx-auto px-8 grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] border-8 border-white card-shadow-lg bg-[var(--paper-2)] overflow-hidden mx-auto lg:mx-0 max-w-[380px]">
            <Image src="/church_09.jpg" alt="담임목사" fill sizes="380px" className="object-cover" />
            <span className="absolute -left-[18px] -top-[18px] w-20 h-20 border border-[var(--gold)] -z-10" />
            <span className="absolute -right-[18px] -bottom-[18px] w-20 h-20 bg-[var(--navy)] -z-10" />
          </div>
          <div>
            <span className="font-display italic text-[18px] text-[var(--gold)] tracking-[0.08em] block mb-4">
              Pastor&apos;s Greeting
            </span>
            <h2 className="font-serif font-bold text-[32px] sm:text-[40px] text-[var(--navy)] tracking-[-0.045em] leading-[1.3] mb-7">
              인사말 — 한 분, 한 분을<br />마음 다해 환영합니다.
            </h2>
            <p className="font-serif text-[19px] text-[var(--ink)] leading-[1.95] mb-5 font-medium">
              “우리 교회는 큰 교회가 되기를 구하지 않습니다.<br />
              다만, 우리 동네에서 가장 ‘가까운’ 교회가 되기를 기도합니다.”
            </p>
            <p className="text-[16.5px] leading-[1.95] text-[var(--body)] mb-4">
              가까운교회는 2015년, 김포 한강신도시 운양동의 작은 상가 한 칸에서 일곱 가정으로 시작되었습니다. 화려한 무대보다 한 사람의 영혼을 더 귀하게 여기며, 매주 예배 안에서 하나님과 가까이, 이웃과 가까이 살아가는 길을 함께 걷고자 합니다.
            </p>
            <p className="text-[16.5px] leading-[1.95] text-[var(--body)] mb-4">
              지친 마음, 무거운 짐을 안고 오시는 분께 따뜻한 차 한 잔과 함께 자리를 내어 드리는 교회 — 그것이 저희가 바라는 작고 분명한 모습입니다. 언제든 편안한 마음으로 한 발 가까이 와 주십시오.
            </p>
            <div className="flex items-center gap-5 mt-8 pt-8 border-t border-[var(--line)]">
              <div>
                <div className="font-sans text-[14px] text-[var(--mute)] mb-1">담임목사 · Senior Pastor</div>
                <div className="font-serif font-bold text-[22px] text-[var(--navy)] tracking-[-0.02em]">김 요 한 목사</div>
              </div>
              <div className="ml-auto w-[74px] h-[74px] border-2 border-[var(--burgundy)] text-[var(--burgundy)] flex items-center justify-center font-serif font-bold text-[22px] rounded-lg bg-white/50">
                印
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Sermons ============ */}
      <section className="bg-[var(--ivory)] py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-5">
            <div>
              <span className="font-display italic text-[18px] text-[var(--gold)] tracking-[0.08em] block mb-2">
                Recent Sermons
              </span>
              <h2 className="font-serif font-bold text-[28px] sm:text-[36px] text-[var(--navy)] tracking-[-0.04em]">
                최근 설교말씀
              </h2>
            </div>
            <Link href="/media/sermon" className="more-link">전체 설교 보기</Link>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((s) => (
              <article key={s.title} className="group bg-white border border-[var(--line)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] bg-[var(--navy-deep)] overflow-hidden">
                  <Image src={s.thumb} alt="" fill sizes="33vw" className="object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(28,42,74,0.4)] to-[rgba(18,27,52,0.85)]" />
                  <span className="absolute left-3.5 top-3.5 bg-[var(--gold)] text-[var(--navy-deep)] font-sans text-[12px] font-bold px-3 py-1.5 tracking-[0.05em]">
                    {s.badge}
                  </span>
                  <span className="absolute right-3.5 bottom-3.5 bg-[rgba(18,27,52,0.85)] text-white font-sans text-[12px] px-2.5 py-1">
                    {s.duration}
                  </span>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/95 text-[var(--navy)] flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-[var(--gold)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="font-display italic text-[15px] text-[var(--gold)] tracking-[0.04em] mb-2.5">{s.date}</div>
                  <h3 className="font-serif font-bold text-[21px] text-[var(--ink)] tracking-[-0.03em] leading-[1.4] mb-2.5">{s.title}</h3>
                  <div className="font-serif text-[15px] text-[var(--burgundy)] mb-3.5">{s.verse}</div>
                  <div className="text-[14px] text-[var(--mute)] pt-3.5 border-t border-dashed border-[var(--line)]">{s.preacher}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Notice + Weekly ============ */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-white border border-[var(--line)] card-shadow">
            <div className="flex justify-between items-center px-7 py-6 bg-[var(--navy)] text-white">
              <h3 className="font-serif font-bold text-[22px] text-[var(--gold-2)] tracking-[-0.02em] flex items-center gap-3">
                <span className="w-3.5 h-3.5 bg-[var(--gold)] rotate-45 inline-block" />
                교회 공지사항
              </h3>
              <Link href="/notices" className="font-sans text-[13px] text-white/80 hover:text-[var(--gold-2)]">전체보기 →</Link>
            </div>
            <ul>
              {notices.length === 0 ? (
                <li className="px-7 py-10 text-center text-[var(--mute)]">등록된 공지가 없습니다.</li>
              ) : notices.map((n, i, arr) => {
                const isNew = (Date.now() - new Date(n.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
                return (
                  <li key={n.id} className={`grid grid-cols-[88px_1fr_110px] items-center gap-4 px-7 py-5 hover:bg-[var(--paper)] transition-colors ${i < arr.length - 1 ? "border-b border-[var(--line)]" : ""}`}>
                    <span className={`inline-block px-2.5 py-1 font-sans text-[12px] font-bold text-center rounded-sm ${
                      n.pinned ? "bg-[var(--burgundy)] text-[var(--gold-2)]" : "bg-[var(--paper-2)] text-[var(--navy)]"
                    }`}>
                      {n.pinned ? "공지" : "소식"}
                    </span>
                    <Link href={`/notices/${n.id}`} className="font-serif text-[16px] text-[var(--ink)] font-medium tracking-[-0.02em] line-clamp-1 hover:text-[var(--navy)]">
                      {n.title}
                      {isNew && <span className="inline-block ml-2 bg-[var(--burgundy)] text-white font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm align-middle">N</span>}
                    </Link>
                    <span className="font-display italic text-[var(--mute)] text-[15px] text-right">{formatDate(n.created_at).replace(/^\d{4}\.\s/, "")}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-white border border-[var(--line)] card-shadow">
            <div className="flex justify-between items-center px-7 py-6 bg-[var(--navy)] text-white">
              <h3 className="font-serif font-bold text-[22px] text-[var(--gold-2)] tracking-[-0.02em] flex items-center gap-3">
                <span className="w-3.5 h-3.5 bg-[var(--gold)] rotate-45 inline-block" />
                이번 주 일정
              </h3>
              <Link href="/notices" className="font-sans text-[13px] text-white/80 hover:text-[var(--gold-2)]">교회력 →</Link>
            </div>
            <ul>
              {weekly.map((w, i, arr) => (
                <li key={i} className={`grid grid-cols-[88px_1fr] gap-4 px-7 py-5 items-center ${i < arr.length - 1 ? "border-b border-[var(--line)]" : ""}`}>
                  <div className="text-center bg-[var(--paper)] px-2 py-2.5 border border-[var(--line)]">
                    <div className="font-serif font-bold text-[22px] text-[var(--navy)] leading-none tracking-[-0.02em]">{w.d}</div>
                    <div className="font-sans text-[12px] text-[var(--gold)] mt-1.5 tracking-[0.1em]">{w.w}</div>
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-[17px] text-[var(--ink)] tracking-[-0.02em] mb-1">{w.title}</div>
                    <div className="font-display italic text-[var(--burgundy)] text-[15px]">{w.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ Gallery ============ */}
      <section className="bg-[var(--paper)] py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Photo Gallery</span>
            <h2>가까운교회의 순간들</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
            <p>함께 드린 예배, 함께 나눈 식탁, 함께 걸은 골목.<br />우리 교회의 작은 이야기를 담았습니다.</p>
          </div>

          <div className="grid lg:grid-cols-12 lg:grid-rows-5 grid-cols-2 grid-rows-none gap-3.5 auto-rows-[120px]">
            {galleryTiles.map((g, i) => (
              <Link
                key={i}
                href="/media/gallery"
                className={`group relative overflow-hidden bg-[var(--paper-2)] border border-[var(--line)] hover:scale-[1.01] transition-transform ${g.cls} col-span-2 lg:col-span-auto ${i === 0 ? "row-span-2" : ""}`}
              >
                <Image src={g.src} alt={g.t} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                <div className="absolute left-0 right-0 bottom-0 px-5 py-4 bg-gradient-to-t from-[rgba(18,27,52,0.92)] to-transparent text-white">
                  <div className="font-serif font-semibold text-[16px] tracking-[-0.02em]">{g.t}</div>
                  <div className="font-display italic text-[13px] text-[var(--gold-2)] mt-0.5">{g.d}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Location ============ */}
      <section className="bg-[var(--ivory)] py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Visit Us</span>
            <h2>오시는 길</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 border border-[var(--line)] bg-white card-shadow overflow-hidden">
            <div className="relative aspect-[5/4] bg-[var(--paper-2)] overflow-hidden">
              <Image src="/church_14.jpg" alt="교회 외관" fill sizes="50vw" className="object-cover" />
              <span className="absolute left-[48%] top-[46%] w-5 h-5 bg-[var(--burgundy)] rounded-full" style={{ boxShadow: "0 0 0 8px rgba(107,31,42,0.25), 0 0 0 18px rgba(107,31,42,0.10)" }} />
              <span className="absolute left-[48%] top-[46%] translate-x-7 -translate-y-8 font-serif font-semibold text-[17px] text-[var(--navy)] bg-white px-3.5 py-2 border border-[var(--gold)] card-shadow">
                가까운교회
              </span>
            </div>
            <div className="p-10 lg:p-14 flex flex-col gap-2">
              <span className="font-display italic text-[17px] text-[var(--gold)] tracking-[0.08em] mb-2.5">
                Address &amp; Contact
              </span>
              <h3 className="font-serif font-bold text-[34px] text-[var(--navy)] tracking-[-0.04em] mb-2.5">가까운교회</h3>
              <div className="text-[15px] text-[var(--mute)] mb-8">경기도 김포시 운양동 · 한강신도시</div>
              <dl className="grid grid-cols-[96px_1fr] gap-x-6 gap-y-5">
                <dt className="font-sans text-[13px] font-bold text-[var(--navy)] border-l-[3px] border-[var(--gold)] pl-2.5 pt-1">주소</dt>
                <dd className="font-serif text-[16.5px] text-[var(--ink)] font-medium tracking-[-0.02em]">
                  경기도 김포시 운양동 0000-0
                  <span className="block text-[13.5px] text-[var(--mute)] font-normal mt-1">한강신도시 운양로 인근</span>
                </dd>
                <dt className="font-sans text-[13px] font-bold text-[var(--navy)] border-l-[3px] border-[var(--gold)] pl-2.5 pt-1">전화</dt>
                <dd className="font-serif text-[16.5px] text-[var(--ink)] font-medium">
                  031 — 000 — 0000
                  <span className="block text-[13.5px] text-[var(--mute)] font-normal mt-1">평일 오전 9:00 – 오후 6:00</span>
                </dd>
                <dt className="font-sans text-[13px] font-bold text-[var(--navy)] border-l-[3px] border-[var(--gold)] pl-2.5 pt-1">이메일</dt>
                <dd className="font-serif text-[16.5px] text-[var(--ink)] font-medium">office@nearchurch.kr</dd>
                <dt className="font-sans text-[13px] font-bold text-[var(--navy)] border-l-[3px] border-[var(--gold)] pl-2.5 pt-1">대중교통</dt>
                <dd className="font-serif text-[16.5px] text-[var(--ink)] font-medium">
                  김포골드라인 운양역
                  <span className="block text-[13.5px] text-[var(--mute)] font-normal mt-1">3번 출구 · 도보 약 10분</span>
                </dd>
                <dt className="font-sans text-[13px] font-bold text-[var(--navy)] border-l-[3px] border-[var(--gold)] pl-2.5 pt-1">주차</dt>
                <dd className="font-serif text-[16.5px] text-[var(--ink)] font-medium">
                  교회 지하 주차장
                  <span className="block text-[13.5px] text-[var(--mute)] font-normal mt-1">주일 예배 시 인근 공영주차장 무료</span>
                </dd>
              </dl>
              <div className="flex gap-3 flex-wrap mt-8">
                <Link href="/about/location" className="btn-primary">길찾기 안내</Link>
                <Link href="/about/location" className="more-link">지도 크게 보기</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
