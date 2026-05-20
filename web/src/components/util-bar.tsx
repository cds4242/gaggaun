import Link from "next/link";

export function UtilBar({ userEmail }: { userEmail?: string | null }) {
  return (
    <div className="bg-[var(--navy-deep)] text-white/80 font-sans text-[13px]">
      <div className="max-w-[1240px] mx-auto px-8 h-[38px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-[var(--gold-2)] font-serif hidden md:inline">
            “여호와는 나의 목자시니 내게 부족함이 없으리로다” &nbsp;— 시편 23:1
          </span>
        </div>
        <div className="flex items-center gap-2">
          {userEmail ? (
            <>
              <Link href="/admin" className="px-3 py-1.5 hover:text-[var(--gold-2)] transition-colors">관리자</Link>
              <span className="text-white/25">|</span>
              <Link href="/logout" className="px-3 py-1.5 hover:text-[var(--gold-2)]">로그아웃</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1.5 hover:text-[var(--gold-2)] transition-colors">로그인</Link>
              <span className="text-white/25">|</span>
            </>
          )}
          <Link href="/new-member" className="px-3 py-1.5 hover:text-[var(--gold-2)] transition-colors">새가족등록</Link>
          <span className="text-white/25 hidden sm:inline">|</span>
          <Link href="/notices" className="px-3 py-1.5 hover:text-[var(--gold-2)] hidden sm:inline">교회소식</Link>
          <span className="text-white/25 hidden sm:inline">|</span>
          <Link href="/board" className="px-3 py-1.5 hover:text-[var(--gold-2)] hidden sm:inline">게시판</Link>
        </div>
      </div>
    </div>
  );
}
