// 네이버 장소(가까운 서광교회)에 등록된 사진을 Supabase Storage 'site' 버킷에 복제한 결과.
// 출처: https://map.naver.com/p/search/.../place/1580416066 (장소 등록 사진)
// 변경 가능 — 실제 사진을 사용하려면 src/lib/site-photos.json을 다시 시드하거나 여기를 직접 수정.

import urls from "./site-photos.json";

export const SITE_PHOTOS = urls as string[];

// 의미별 alias (어떤 사진이 어디에 더 어울리는지 운영하면서 조정)
export const PHOTO_BUILDING_EXTERIOR = SITE_PHOTOS[0] ?? "";
export const PHOTO_LOBBY = SITE_PHOTOS[1] ?? "";
export const PHOTO_INTERIOR_1 = SITE_PHOTOS[2] ?? "";
export const PHOTO_INTERIOR_2 = SITE_PHOTOS[3] ?? "";
export const PHOTO_SANCTUARY_1 = SITE_PHOTOS[4] ?? "";
export const PHOTO_SANCTUARY_2 = SITE_PHOTOS[5] ?? "";
export const PHOTO_DETAIL_1 = SITE_PHOTOS[6] ?? "";
export const PHOTO_DETAIL_2 = SITE_PHOTOS[7] ?? "";
