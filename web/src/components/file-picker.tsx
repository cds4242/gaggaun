"use client";

import { useRef } from "react";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
};

export function FilePicker({ onChange, accept = "image/*", multiple = false, disabled, label = "파일 선택", hint }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="file-picker">
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={disabled}
        className="btn-outline"
      >
        <span className="ic" aria-hidden>📎</span>
        <span>{label}</span>
      </button>
      {hint && <span style={{ marginLeft: 10, fontSize: 12, color: "var(--mute)" }}>{hint}</span>}
    </div>
  );
}
