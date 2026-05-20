import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { IMG } from "@/lib/images";

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
      .limit(4);
    return (data as RecentNotice[]) ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const notices = await getRecentNotices();

  return (
    <div className="bg-paper">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden -mt-20">
        <Image src={IMG.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 container-wide flex flex-col">
          <div className="flex-1" />
          <div className="pb-24 text-white max-w-3xl reveal">
            <div className="eyebrow text-white/80 mb-10">EST. 2015 · GIMPO</div>
            <h1 className="h-display text-white text-6xl sm:text-8xl leading-[1.02]">
              가까이,<br />
              <em>조용히,</em><br />
              함께.
            </h1>
            <p className="mt-12 max-w-md text-white/75 text-[15px] leading-relaxed">
              김포 한강신도시 운양동의 작은 공동체.
              매주 같은 자리에서 같은 사람들과 함께 예배합니다.
            </p>
          </div>
          {/* bottom meta */}
          <div className="pb-10 flex items-end justify-between text-white/75 text-[11px] tracking-[0.3em]">
            <div className="flex items-center gap-4">
              <span className="block h-px w-12 bg-white/50" />
              <span>SCROLL</span>
            </div>
            <div className="hidden sm:flex items-center gap-12">
              <div>
                <div className="opacity-60">LOCATION</div>
                <div className="mt-1 tracking-wider">김포 운양동</div>
              </div>
              <div>
                <div className="opacity-60">WORSHIP</div>
                <div className="mt-1 tracking-wider">SUN 09 · 11</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── INTRO ───────────────────────── */}
      <section className="section">
        <div className="container-wide grid gap-20 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="eyebrow mb-8">— Introduction</div>
            <div className="numeral mb-2 text-muted">01 / 04</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="h-display text-5xl sm:text-7xl text-ink leading-[1.05] max-w-3xl">
              우리는 <em>작은</em> 교회입니다.
              한 사람의 이름을<br />부르며 기도하고,
              같은 자리에서<br />같은 시간을 함께 지나갑니다.
            </h2>
            <div className="mt-16 grid gap-12 sm:grid-cols-2 max-w-2xl">
              <p className="text-[14px] leading-[1.95] text-muted">
                화려한 프로그램보다 한 영혼의 깊이를 더 귀하게 여깁니다.
                매주 예배 안에서 하나님과 가까이, 이웃과 가까이 살아가는 길을 천천히 걷습니다.
              </p>
              <p className="text-[14px] leading-[1.95] text-muted">
                처음 오신 분도, 오래 오신 분도 모두 같은 마음으로 환영받는 자리.
                그것이 가까운교회가 추구하는 작은 공동체의 모습입니다.
              </p>
            </div>
            <Link href="/about/greeting" className="mt-16 inline-flex items-center gap-3 text-[12px] tracking-[0.25em] text-ink link-line">
              READ MORE <span className="block h-px w-10 bg-ink" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── EDITORIAL IMAGE ───────────────────────── */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <Image src={IMG.about1} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 container-wide flex items-end pb-20">
          <div className="text-white max-w-md">
            <div className="eyebrow text-white/80 mb-6">— A still moment</div>
            <p className="font-display italic text-3xl leading-tight text-white">
              “수고하고 무거운 짐 진 자들아<br /> 다 내게로 오라.”
            </p>
            <p className="mt-4 text-[12px] tracking-[0.2em] text-white/70">— 마태복음 11:28</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── WORSHIP ───────────────────────── */}
      <section className="section bg-ink text-white">
        <div className="container-wide">
          <div className="grid gap-20 lg:grid-cols-12 items-start">
            <div className="lg:col-span-4">
              <div className="eyebrow text-white/80 mb-8">— Worship</div>
              <div className="numeral mb-2 text-white/60">02 / 04</div>
              <h2 className="h-display text-white text-5xl sm:text-6xl mt-10 leading-tight">
                예배의 자리로.
              </h2>
              <p className="mt-8 text-white/65 text-[14px] leading-[1.95] max-w-sm">
                예배는 우리의 한 주를 시작하는 자리이며,
                같은 마음을 품은 사람들과 만나는 시간입니다.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="divide-y divide-white/15 border-y border-white/15">
                {[
                  { title: "주일 1부 예배", time: "오전 09:00", desc: "조용히 시작하는 예배", place: "본당" },
                  { title: "주일 2부 예배", time: "오전 11:00", desc: "온 가족이 함께 드리는 예배", place: "본당" },
                  { title: "수요 예배",     time: "수요일 19:30", desc: "말씀과 기도의 자리",       place: "본당" },
                  { title: "새벽 예배",     time: "평일 05:30",   desc: "하루를 주님과 함께",       place: "본당" },
                ].map((w, i) => (
                  <li key={w.title} className="py-8 grid grid-cols-12 gap-6 items-baseline">
                    <div className="col-span-1 numeral text-white/40">0{i + 1}</div>
                    <div className="col-span-4">
                      <div className="text-white font-display text-2xl">{w.title}</div>
                      <div className="text-white/55 text-[12px] tracking-[0.15em] mt-2">{w.desc}</div>
                    </div>
                    <div className="col-span-4 font-display text-2xl text-white">{w.time}</div>
                    <div className="col-span-3 text-right text-[12px] tracking-[0.2em] text-white/55">{w.place}</div>
                  </li>
                ))}
              </ul>
              <Link href="/worship/sunday" className="mt-12 inline-flex items-center gap-3 text-[12px] tracking-[0.25em] text-white link-line">
                ALL WORSHIP <span className="block h-px w-10 bg-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── NEWS + GALLERY ───────────────────────── */}
      <section className="section">
        <div className="container-wide grid gap-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-8">— News</div>
            <div className="numeral mb-2 text-muted">03 / 04</div>
            <h2 className="h-display text-5xl text-ink mt-10">
              교회의<br />소식.
            </h2>
            <ul className="mt-16 divide-y divide-[var(--line-soft)] border-y border-[var(--line-soft)]">
              {notices.length === 0 ? (
                <li className="py-8 text-[14px] text-muted">아직 등록된 공지가 없습니다.</li>
              ) : (
                notices.map((n) => (
                  <li key={n.id}>
                    <Link href={`/notices/${n.id}`} className="group py-6 flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        {n.pinned && (
                          <div className="text-[10px] tracking-[0.25em] text-ink mb-2">PINNED</div>
                        )}
                        <div className="text-[15px] text-ink line-clamp-2 leading-relaxed group-hover:translate-x-1 transition-transform">
                          {n.title}
                        </div>
                      </div>
                      <div className="text-[11px] tracking-[0.15em] text-muted shrink-0 pt-1">{formatDate(n.created_at)}</div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
            <Link href="/notices" className="mt-12 inline-flex items-center gap-3 text-[12px] tracking-[0.25em] text-ink link-line">
              ALL NEWS <span className="block h-px w-10 bg-ink" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 zoom relative h-[480px]">
                <Image src={IMG.about1} alt="" fill sizes="60vw" className="object-cover" />
              </div>
              <div className="col-span-3 zoom relative h-[260px]">
                <Image src={IMG.about4} alt="" fill sizes="30vw" className="object-cover" />
              </div>
              <div className="col-span-3 zoom relative h-[260px]">
                <Image src={IMG.about3} alt="" fill sizes="30vw" className="object-cover" />
              </div>
            </div>
            <Link href="/media/gallery" className="mt-8 inline-flex items-center gap-3 text-[12px] tracking-[0.25em] text-ink link-line">
              GALLERY <span className="block h-px w-10 bg-ink" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA (New family) ───────────────────────── */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <Image src={IMG.cta} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 container-wide flex items-center">
          <div className="text-white max-w-2xl">
            <div className="eyebrow text-white/80 mb-8">— New family</div>
            <div className="numeral mb-2 text-white/55">04 / 04</div>
            <h2 className="h-display text-white text-5xl sm:text-7xl mt-10 leading-[1.05]">
              처음 오신 분들을<br /> <em>진심으로</em> 환영합니다.
            </h2>
            <p className="mt-10 max-w-md text-white/75 text-[15px] leading-relaxed">
              새가족 카드를 작성해주시면 담당자가 부드럽게 안내해 드립니다.
              편안한 마음으로 한 발 가까이 오세요.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link href="/new-member" className="btn-ink-on-dark">
                새가족 등록
              </Link>
              <Link href="/about/location" className="text-[12px] tracking-[0.25em] text-white/80 link-line ml-2">
                오시는 길
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── LOCATION BAR ───────────────────────── */}
      <section className="border-t border-[var(--line-soft)]">
        <div className="container-wide py-16 grid gap-8 md:grid-cols-12 items-center">
          <div className="md:col-span-4">
            <div className="eyebrow mb-3">— Visit</div>
            <h3 className="h-display text-3xl text-ink">오시는 길</h3>
          </div>
          <div className="md:col-span-4 text-[14px] text-ink/80 leading-relaxed">
            <p className="text-ink">경기도 김포시 운양동 (한강신도시)</p>
            <p className="text-muted mt-1">김포골드라인 운양역 도보 10분</p>
          </div>
          <div className="md:col-span-4 text-[14px] text-ink/80 leading-relaxed">
            <p>Tel. 031-000-0000</p>
            <p className="text-muted mt-1">office@nearchurch.kr</p>
            <Link href="/about/location" className="mt-4 inline-flex items-center gap-3 text-[11px] tracking-[0.25em] text-ink link-line">
              VIEW MAP <span className="block h-px w-10 bg-ink" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
