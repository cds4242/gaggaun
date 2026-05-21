import React from "react";

// URL 자동 감지: http(s):// 또는 www. 로 시작하는 패턴
const URL_RE = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/g;

/**
 * 게시판/공지 본문 등 사용자 입력 텍스트를 안전하게 렌더.
 * - HTML 태그는 모두 텍스트로 처리 (React가 자동 escape)
 * - URL은 자동으로 a 태그로 변환 (target=_blank, rel=noopener)
 * - 줄바꿈은 \n → <br>
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts: React.ReactNode[] = [];
  const lines = text.split("\n");

  lines.forEach((line, lineIdx) => {
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    URL_RE.lastIndex = 0;
    while ((match = URL_RE.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      const url = match[0];
      const href = url.startsWith("www.") ? `https://${url}` : url;
      parts.push(
        <a
          key={`${lineIdx}-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="rt-link"
        >
          {url}
        </a>,
      );
      lastIndex = match.index + url.length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));
    if (lineIdx < lines.length - 1) parts.push(<br key={`br-${lineIdx}`} />);
  });

  return <div className={className}>{parts}</div>;
}
