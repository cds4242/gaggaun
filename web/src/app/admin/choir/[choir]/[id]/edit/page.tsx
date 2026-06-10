import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SermonForm } from "@/app/admin/sermons/sermon-form";
import { updateChoirVideo } from "@/app/admin/sermons/actions";

const CHOIR_META: Record<string, { label: string; eyebrow: string }> = {
  hallelujah: { label: "할렐루야 성가대", eyebrow: "Edit Hallelujah Video" },
  hosanna:    { label: "호산나 성가대",    eyebrow: "Edit Hosanna Video" },
};

export async function generateMetadata({ params }: { params: Promise<{ choir: string }> }) {
  const { choir } = await params;
  const meta = CHOIR_META[choir];
  return { title: meta ? `${meta.label} 영상 수정 | 가까운 서광교회` : "영상 수정" };
}

export default async function Page({ params }: { params: Promise<{ choir: string; id: string }> }) {
  const { choir, id: rawId } = await params;
  const meta = CHOIR_META[choir];
  if (!meta) notFound();
  const id = parseInt(rawId, 10);
  if (!Number.isFinite(id)) notFound();
  await requireAdmin(`/admin/choir/${choir}/${rawId}/edit`);

  const supabase = await createClient();
  const { data: video } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .eq("category", choir)
    .maybeSingle();
  if (!video) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateChoirVideo(choir, id, formData);
  }

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>{meta.label} 영상 수정</h1>
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
            submitLabel="저장"
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
            initial={{
              title: video.title,
              preacher: video.preacher,
              verse: video.verse ?? "",
              badge: video.badge ?? "",
              youtube_id: video.youtube_id,
              duration: video.duration ?? "",
              summary: video.summary ?? "",
              preached_at: video.preached_at ?? "",
            }}
          />
        </div>
      </div>
    </>
  );
}
