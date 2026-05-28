// site_settings 테이블에서 site-wide 설정을 읽는다.
// DB가 없거나 키가 비어있으면 DEFAULTS로 fallback — 사이트가 무조건 뜨도록.
//
// 사용처:
//   - 홈 히어로 띠 (this_week 그룹)
//   - 어드민 /admin/this-week 편집 폼
//
// 갱신은 어드민 액션에서 처리 후 revalidatePath('/') 로 즉시 반영.

import { createPublicClient } from "@/lib/supabase/public";

export type SettingKey =
  | "home.strip.date"
  | "home.strip.worship"
  | "home.strip.text"
  | "home.strip.preacher";

const DEFAULTS: Record<SettingKey, string> = {
  "home.strip.date": "2026. 5. 24 (주일)",
  "home.strip.worship": "오전 9:00 · 11:00",
  "home.strip.text": "요한복음 13:34-36",
  "home.strip.preacher": "김요한 담임목사",
};

export type SettingRow = {
  key: string;
  value: string;
  label: string;
  description: string | null;
  group_key: string;
  sort_order: number;
  updated_at: string;
};

export async function getThisWeekSettings(): Promise<Record<SettingKey, string>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .eq("group_key", "this_week");
    if (error || !data) return { ...DEFAULTS };
    const map: Record<string, string> = { ...DEFAULTS };
    for (const row of data as { key: string; value: string }[]) {
      map[row.key] = row.value;
    }
    return map as Record<SettingKey, string>;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function getSettingsByGroup(group: string): Promise<SettingRow[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("group_key", group)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as SettingRow[];
  } catch {
    return [];
  }
}
