import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--navy-deep)] text-white/80 pt-20 mt-24">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid gap-12 md:gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] pb-12 border-b border-[rgba(199,158,95,0.20)]">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5">
              <span className="brand-cross brand-cross-sm" aria-hidden />
              <div>
                <div className="font-serif font-bold text-[24px] text-white tracking-[-0.03em]">가까운교회</div>
                <span className="font-display italic text-[var(--gold-2)] text-[16px] mt-0.5 block">
                  The Near Church · Gimpo
                </span>
              </div>
            </div>
            <p className="font-serif text-[14px] leading-[1.9] max-w-[360px] mt-1.5">
              예수 그리스도의 사랑 안에서<br />
              이웃과 가까이, 하나님과 가까이.<br />
              김포 한강신도시 운양동의 작은 공동체입니다.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[17px] text-[var(--gold-2)] tracking-[-0.02em] pb-3 border-b border-[rgba(199,158,95,0.20)] mb-5">
              예배 안내
            </h4>
            <ul className="grid gap-3 font-serif text-[15px] text-white/80">
              <li className="flex justify-between gap-4"><span>주일 1부</span><span className="font-display italic text-[var(--gold-2)]">09:00</span></li>
              <li className="flex justify-between gap-4"><span>주일 2부</span><span className="font-display italic text-[var(--gold-2)]">11:00</span></li>
              <li className="flex justify-between gap-4"><span>수요예배</span><span className="font-display italic text-[var(--gold-2)]">19:30</span></li>
              <li className="flex justify-between gap-4"><span>금요기도회</span><span className="font-display italic text-[var(--gold-2)]">20:00</span></li>
              <li className="flex justify-between gap-4"><span>새벽예배</span><span className="font-display italic text-[var(--gold-2)]">05:30</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[17px] text-[var(--gold-2)] pb-3 border-b border-[rgba(199,158,95,0.20)] mb-5">
              연락처
            </h4>
            <ul className="grid gap-3 font-serif text-[15px] text-white/80">
              <li>경기도 김포시 운양동</li>
              <li>(한강신도시)</li>
              <li>Tel. 031-000-0000</li>
              <li>office@nearchurch.kr</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[17px] text-[var(--gold-2)] pb-3 border-b border-[rgba(199,158,95,0.20)] mb-5">
              바로가기
            </h4>
            <ul className="grid gap-3 font-serif text-[15px] text-white/80">
              <li><Link href="/about/greeting" className="hover:text-[var(--gold-2)]">인사말</Link></li>
              <li><Link href="/worship/sunday" className="hover:text-[var(--gold-2)]">예배안내</Link></li>
              <li><Link href="/media/sermon" className="hover:text-[var(--gold-2)]">설교말씀</Link></li>
              <li><Link href="/notices" className="hover:text-[var(--gold-2)]">공지사항</Link></li>
              <li><Link href="/new-member" className="hover:text-[var(--gold-2)]">새가족 등록</Link></li>
            </ul>
          </div>
        </div>

        <div className="py-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13.5px] text-white/60">
          <div>© {new Date().getFullYear()} 가까운교회 · The Near Church. All rights reserved.</div>
          <div className="font-serif text-[14.5px] text-[var(--gold-2)]">
            “너희가 서로 사랑하면 이로써 모든 사람이 너희가 내 제자인 줄 알리라” — 요 13:35
          </div>
        </div>
      </div>
    </footer>
  );
}
