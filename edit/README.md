# 가까운교회 홈페이지 피드백 도구

교회 관리자가 직접 사이트를 보면서 "여기 이 글자는 이렇게, 이 사진은 이걸로" 같은 피드백을 정확하게 전달하기 위한 도구입니다.

## 관리자용 — 사용법

1. `edit/index.html` 을 더블클릭해서 브라우저(Chrome, Edge, 사파리)로 엽니다.
   - 인터넷이 안 되어도 동작합니다. PC에 파일만 있으면 됩니다.
2. 왼쪽 메뉴에서 편집하실 페이지를 고릅니다.
   - **상단 메뉴** — 사이트 위쪽의 네비게이션 메뉴
   - **홈(메인) 페이지** — 사이트 첫 화면
   - **교회소개 / 인사말 / 비전 / 연혁 / 오시는 길** — 정적 페이지
3. 각 항목마다:
   - **현재 사이트 내용**: 지금 사이트에 나오고 있는 글자/사진
   - **바꾸려는 내용**: 새 글자(그대로 둘 항목은 비워두세요)
   - **코멘트**: "좀 더 따뜻하게", "이 단어 빼주세요" 같이 자유롭게 적습니다.
   - **사진**: 영역에 새 사진 파일을 끌어다 놓거나 클릭해서 고릅니다.
4. 다 하셨으면 왼쪽 아래 **"내보내기 (JSON 저장)"** 버튼을 누릅니다.
   - `church-edits-YYYY-MM-DD.json` 파일이 다운로드됩니다.
5. 그 파일을 담당자(개발자)에게 이메일/카톡 등으로 전달해주세요.

## 자주 묻는 것

- **중간에 닫으면 작업한 내용이 날아가나요?**
  아니요. 브라우저에 자동 저장됩니다. 같은 PC, 같은 브라우저로 다시 열면 이어서 작업할 수 있습니다.
- **다른 PC에서 이어서 하고 싶어요.**
  먼저 PC에서 "내보내기"로 JSON 파일을 저장한 뒤, 다른 PC에서 "불러오기" 버튼으로 그 JSON 내용을 붙여넣으면 됩니다.
- **사진 용량이 큰데 괜찮나요?**
  너무 크면 저장이 안 될 수 있어요. 한 장당 2~3MB 이내가 좋습니다. 그보다 크면 진행 여부를 다시 물어봅니다.
- **변경한 게 바로 사이트에 반영되나요?**
  아니요. 이 도구는 피드백을 정리해서 담당자에게 보내는 용도입니다. 실제 반영은 담당자가 코드를 수정한 뒤 배포해야 합니다.

---

## 담당자용 — Claude Code에 전달하는 방법

관리자가 보내준 `church-edits-YYYY-MM-DD.json` 파일을 받으면:

1. 그 JSON을 프로젝트 루트(또는 어디든)에 저장합니다.
2. Claude Code 세션에서 이렇게 부탁하면 됩니다:

   > `church-edits-2026-05-28.json` 파일에 적힌 대로 사이트를 수정해줘.

3. Claude Code는 이 파일 구조를 알고 있어서:
   - `pages.{pageId}.edits[].id` 로 코드 내 위치를 찾고
   - `newValue` 가 있으면 텍스트를 교체
   - `newImage.dataUrl` (base64) 이 있으면 `web/public/uploads/` 같은 위치에 저장하고 `SITE_PHOTOS` 등 참조처를 갱신
   - `comment` 는 작업 판단에 참고
   - `menu` 가 null이 아니면 `web/src/lib/nav.ts` 와 `web/src/components/site-header.tsx` 의 브랜드/CTA를 통째로 교체

## JSON 구조

```json
{
  "version": 1,
  "generatedAt": "2026-05-28T...",
  "summary": { "textChanges": 5, "imageChanges": 2, "comments": 3, "menuChanged": false },
  "pages": {
    "home": {
      "title": "홈(메인) 페이지",
      "file": "web/src/app/page.tsx",
      "edits": [
        {
          "id": "home.hero.title.line1",
          "section": "히어로 (최상단 배너)",
          "label": "큰 제목 1행",
          "type": "text",
          "original": "가깝게, 따뜻하게",
          "newValue": "가까이서, 따뜻하게",
          "comment": "어감 살짝 부드럽게"
        },
        {
          "id": "home.hero.bg",
          "type": "image",
          "label": "히어로 배경 사진",
          "newImage": {
            "name": "new-hero.jpg",
            "type": "image/jpeg",
            "size": 1842031,
            "dataUrl": "data:image/jpeg;base64,..."
          },
          "comment": "지난 부활절 때 찍은 사진"
        }
      ]
    }
  },
  "menu": null
}
```

### id 네이밍 규칙

- `{page}.{section}.{element}` 형태 (예: `home.hero.title.line1`, `greeting.body.p2`)
- 카탈로그는 `edit/index.html` 안의 `const CATALOG = {...}` 에 있음
- **이 id는 변경하지 마세요** — Claude Code가 코드 위치를 찾는 키가 됩니다. 새 항목을 추가할 때는 새 id를 부여하세요.

### 이미지 처리

- `newImage.dataUrl` 은 `data:image/...;base64,...` 형태
- 디코드 후 `web/public/uploads/` 또는 적절한 위치에 저장
- 히어로 배경(`home.hero.bg`), 갤러리(`home.gallery.photo.N`), 담임목사(`home.pastor.photo`) 등은 참조 코드 위치가 다르므로 id별로 매핑 필요

## 새 편집 항목 추가하기

사이트에 새 섹션이 생겨서 편집 가능 항목을 늘리고 싶다면:

1. `edit/index.html` 의 `CATALOG.pages` 를 찾습니다.
2. 해당 페이지의 `sections` 배열에 새 항목 추가:
   ```js
   { id: "home.newsection.title", type: "text", label: "새 섹션 제목", original: "현재 사이트의 글자" }
   ```
3. 끝. UI는 자동으로 그 항목을 카드로 렌더합니다.

type은 `text`(짧은 글), `longtext`(긴 글), `image`(이미지) 셋 중 하나.

## 알려진 한계

- 자유게시판/공지사항 등 **DB에서 오는 동적 컨텐츠**는 편집 대상이 아닙니다 — 어드민 페이지에서 관리해야 합니다.
- 갤러리 페이지(`/media/gallery`) 의 사진들도 DB에 들어있어서 어드민에서 관리. 이 도구에서는 페이지 제목/카테고리 라벨 같은 정적 텍스트만 편집합니다.
- 색상/폰트/레이아웃 변경은 이 도구로는 불가능 — 코멘트에 적어서 담당자에게 전달하세요.
- 이미지는 base64로 JSON 안에 들어가므로 JSON 파일이 커질 수 있습니다(이미지 1장당 약 30% 부풀음). 대용량이라면 압축 후 보내주세요.
