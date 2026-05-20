import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { IMG } from "@/lib/images";
export const metadata = { title: "사진갤러리 | 가까운교회" };

export default function Page() {
  // 원본 19장 + 인덱스 보조용
  const photos = Array.from({ length: 19 }, (_, i) => String(i + 1).padStart(2, "0"));
  return (
    <div className="bg-paper">
      <PageHeader title="사진갤러리" eyebrow="— Gallery" subtitle="교회의 추억" image={IMG.gallery} />
      <div className="container-wide section">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <figure key={p} className="space-y-2">
              <div className={`relative zoom ${i % 7 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image src={`/church_${p}.jpg`} alt="" fill sizes="25vw" className="object-cover grayscale-[0.15]" />
              </div>
              <figcaption className="text-[10px] tracking-[0.25em] text-muted">N°{p}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
