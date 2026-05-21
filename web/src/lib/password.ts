import bcrypt from "bcryptjs";

const PASSWORD_PATTERN = /^\d{4}$/;

export function validatePassword(raw: string): string {
  const v = (raw ?? "").trim();
  if (!PASSWORD_PATTERN.test(v)) {
    throw new Error("비밀번호는 숫자 4자리로 입력해 주세요.");
  }
  return v;
}

export async function hashPassword(raw: string): Promise<string> {
  const v = validatePassword(raw);
  return bcrypt.hash(v, 10);
}

export async function verifyPassword(raw: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) return false;
  const v = (raw ?? "").trim();
  if (!PASSWORD_PATTERN.test(v)) return false;
  return bcrypt.compare(v, hash);
}
