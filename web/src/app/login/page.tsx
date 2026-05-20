import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "./login-form";
import { IMG } from "@/lib/images";

export const metadata = { title: "관리자 로그인 | 가까운교회" };

export default function Page() {
  return (
    <div className="bg-paper min-h-screen grid lg:grid-cols-2 -mt-20 pt-20">
      <div className="hidden lg:block relative">
        <Image src={IMG.login} alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-white">
          <div className="eyebrow text-white/80 mb-6">— Admin</div>
          <h1 className="h-display text-white text-5xl">관리자 로그인.</h1>
          <p className="mt-6 text-white/70 max-w-sm leading-relaxed text-[14px]">
            교회의 공지사항, 게시판, 새가족 등록 정보를 관리할 수 있습니다.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <div className="eyebrow mb-3">— Sign in</div>
          <h2 className="h-display text-4xl text-ink mb-12">로그인</h2>
          <Suspense fallback={<div className="text-[14px] text-muted">로딩 중...</div>}>
            <LoginForm />
          </Suspense>
          <p className="mt-10 text-[11px] tracking-[0.15em] text-muted leading-relaxed">
            ※ Supabase Auth로 가입된 이메일이면서 admins 테이블에 등록된 사용자만<br />
            관리자 권한이 부여됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
