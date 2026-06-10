import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { SermonForm } from "@/app/admin/sermons/sermon-form";
import { createChoirVideo } from "@/app/admin/sermons/actions";

const CHOIR_META: Record<string, { label: string; eyebrow: string }> = {
  hallelujah: { label: "할렐루야 성가대", eyebrow: "New Hallelujah Video" },
  hosanna:    { label: "호산나 성가대",    eyebrow: "New Hosanna Video" },
};

export async function generateMetadata({ params }: { params: Promise<{ choir: string }> }) {
  const { choir } = await params;
  const meta = CHOIR_META[choir];
  return { title: meta ? `${meta.label} 영상 등록 | 가까운 서광교회` : "영상 등록" };
}

export default async function Page({ params }: { params: Promise<{ choir: string }> }) {
  const { choir } = await params;
  const meta = CHOIR_META[choir];
  if (!meta) notFound();
  await requireAdmin(`/admin/choir/${choir}/new`);

  async function action(formData: FormData) {
    "use server";
    await createChoirVideo(choir, formData);
  }

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>새 {meta.label} 영상 등록</h1>
        </div>
        <Link href={`/admin/choir/${choir}`} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 목록으로
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>영상 정보</h3></div>
        <div className="ac-body">
          <SermonForm
            action={action}
            submitLabel="등록"
            cancelHref={`/admin/choir/${choir}`}
            labels={{
              preacher: "지휘자",
              preacherPlaceholder: "예) 김OO 권사",
              verse: "곡목 / 본문 (선택)",
              versePlaceholder: "예) 주 하나님 지으신 모든 세계",
              badge: "유형 (선택)",
              badgePlaceholder: "예) 주일 1부 / 부활절 칸타타",
              badgeOptions: ["주일 1부", "주일 2부", "부활절 칸타타", "성탄 칸타타", "특별 찬양"],
              preached_at: "공연일 (선택)",
              summaryPlaceholder: "곡 소개나 가사 의미를 짧게 적어 주세요.",
            }}
          />
        </div>
      </div>
    </>
  );
}
