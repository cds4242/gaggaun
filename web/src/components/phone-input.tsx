"use client";

import { useState } from "react";

function format(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length < 11) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

export function PhoneInput({ id, name, required, defaultValue }: { id?: string; name: string; required?: boolean; defaultValue?: string }) {
  const [v, setV] = useState(defaultValue ? format(defaultValue) : "");
  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      placeholder="010-0000-0000"
      value={v}
      onChange={(e) => setV(format(e.target.value))}
      required={required}
      maxLength={13}
    />
  );
}
