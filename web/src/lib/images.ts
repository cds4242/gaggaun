// 원본 사진 19장을 각 페이지/섹션에 분배
const ch = (n: string) => `/church_${n}.jpg`;

export const IMG = {
  hero: ch("01"),
  about1: ch("02"),
  about2: ch("06"),
  about3: ch("09"),
  about4: ch("10"),

  cta: ch("14"),

  greeting: ch("09"),
  vision: ch("11"),
  history: ch("12"),
  location: ch("13"),

  worship: ch("15"),
  sunday: ch("16"),
  wednesday: ch("17"),
  dawn: ch("18"),
  friday: ch("19"),

  ministry: ch("06"),
  children: ch("03"),
  youth: ch("04"),
  mission: ch("05"),
  praise: ch("07"),

  community: ch("02"),
  cell: ch("08"),
  men: ch("09"),
  women: ch("10"),

  media: ch("11"),
  sermon: ch("12"),
  gallery: ch("01"),

  notice: ch("04"),
  board: ch("06"),
  newMember: ch("05"),
  login: ch("18"),
};
