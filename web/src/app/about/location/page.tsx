import Image from "next/image";
import { MapPin, Phone, Mail, Train } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { IMG } from "@/lib/images";

export const metadata = { title: "오시는 길 | 가까운교회" };

export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="오시는 길" eyebrow="— Location" subtitle="김포 한강신도시 운양동" image={IMG.location} />
      <div className="container-wide section grid gap-20 lg:grid-cols-2 items-start">
        <div className="space-y-12">
          <Row icon={<MapPin className="h-4 w-4" />} label="ADDRESS">
            <p className="text-[18px] text-ink">경기도 김포시 운양동 (한강신도시)</p>
          </Row>
          <Row icon={<Phone className="h-4 w-4" />} label="TEL">
            <p className="text-[18px] text-ink">031-000-0000</p>
          </Row>
          <Row icon={<Mail className="h-4 w-4" />} label="EMAIL">
            <p className="text-[18px] text-ink">office@nearchurch.kr</p>
          </Row>
          <Row icon={<Train className="h-4 w-4" />} label="TRANSIT">
            <ul className="space-y-1 text-ink/85 text-[15px]">
              <li>김포골드라인 운양역 도보 10분</li>
              <li>버스 정류장 도보 5분</li>
            </ul>
          </Row>
        </div>
        <div className="relative aspect-[4/5] zoom">
          <Image src={IMG.about4} alt="" fill sizes="50vw" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-ink text-[11px] tracking-[0.3em] mb-3">
        {icon} {label}
      </div>
      {children}
    </div>
  );
}
