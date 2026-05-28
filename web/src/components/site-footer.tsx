import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="foot-brand-row">
              <span className="cross-mini" aria-hidden />
              <div>
                <div className="name-ko">가까운교회</div>
                <span className="name-en">The Near Church · Gimpo</span>
              </div>
            </div>
            <p>
              예수 그리스도의 사랑 안에서<br />
              이웃과 가까이, 하나님과 가까이.<br />
              김포 한강신도시 운양동의 작은 공동체입니다.
            </p>
          </div>

          <div className="foot-col">
            <h4>예배 안내</h4>
            <ul>
              <li className="row"><span>주일 1부</span><span className="t">09:00</span></li>
              <li className="row"><span>주일 2부</span><span className="t">11:00</span></li>
              <li className="row"><span>수요예배</span><span className="t">19:30</span></li>
              <li className="row"><span>금요기도회</span><span className="t">20:00</span></li>
              <li className="row"><span>새벽예배</span><span className="t">05:30</span></li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>연락처</h4>
            <ul>
              <li>경기도 김포시 운양동</li>
              <li>(한강신도시)</li>
              <li>Tel. 031-999-9999</li>
              <li>office@nearchurch.kr</li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>바로가기</h4>
            <ul>
              <li><Link href="/about/greeting">인사말</Link></li>
              <li><Link href="/worship/sunday">예배안내</Link></li>
              <li><Link href="/media/sermon">설교말씀</Link></li>
              <li><Link href="/notices">공지사항</Link></li>
              <li><Link href="/new-member">새가족 등록</Link></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <div>© {new Date().getFullYear()} 가까운교회 · The Near Church. All rights reserved.</div>
          <div className="verse">
            “너희가 서로 사랑하면 이로써 모든 사람이 너희가 내 제자인 줄 알리라” — 요 13:35
          </div>
        </div>
      </div>
    </footer>
  );
}
