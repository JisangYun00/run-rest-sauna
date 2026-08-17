# A안 MVP 실행 가이드

GitHub Pages로 랜딩 페이지를 띄우고, Airtable로 예약을 받는 전 과정.

---

## 1. GitHub Pages 활성화

1. 이 프로젝트를 GitHub repo로 push
2. GitHub repo → **Settings** → **Pages**
3. **Source**: `Deploy from a branch` 선택
4. **Branch**: `main` / `/(root)` 선택 → **Save**
5. 잠시 후 `https://username.github.io/run-rest-sauna`에서 랜딩 확인

---

## 2. Airtable Base 만들기

### 2-1. 새 Base 생성

- [airtable.com](https://airtable.com) 로그인
- "Create a base" → 이름: `Run Recover Repeat - Bookings`

### 2-2. 테이블 필드 설정

기본 `Table 1` 이름을 `Bookings`로 변경.

| 필드명 | 타입 | 옵션/설명 |
|---|---|---|
| `Name` | Single line text | 이름 |
| `Phone` | Phone | 연락처 |
| `Run Date` | Date | 러닝 날짜 (Date only) |
| `Run Time` | Single select | `07:00`, `08:00`, `18:00`, `19:00` |
| `Wear Size` | Single select | `S`, `M`, `L`, `XL`, `필요없음` |
| `Status` | Single select | `신청`, `입금확인`, `체크인`, `완료` |
| `Paid Amount` | Number | 입금액 (원) |
| `Notes` | Long text | 운영자 메모 |
| `Submitted At` | Created time | 자동 생성 |

### 2-3. Form view 만들기

1. 왼쪽 하단 **+ Add view** → **Form**
2. 필드 순서 정리: `Name` → `Phone` → `Run Date` → `Run Time` → `Wear Size`
3. 각 필드에 설명 추가:
   - `Run Date`: 참가를 원하는 날짜를 선택해주세요.
   - `Wear Time`: 러닝 시작 시간을 선택해주세요.
   - `Wear Size`: 사우나 후 갈아입을 Recovery Wear 사이즈를 선택해주세요.
4. **Share form** 클릭 → **Create a shareable form link** 복사
5. 또는 **Embed this form** → iframe URL 복사

### 2-4. index.html에 Form URL 삽입

`index.html`의 이 부분을 찾아 바꿈:

```html
<iframe
  class="airtable-embed"
  src="https://airtable.com/embed/YOUR_FORM_ID"
  ...
>
</iframe>
```

`YOUR_FORM_ID`를 복사한 embed URL로 교체.

---

## 3. index.html 커스텀

### 3-1. 브랜드/사우나 정보 수정

수정해야 할 항목:

| 위치 | 항목 | 현재 값 |
|---|---|---|
| Hero | 서비스명 | RUN · RECOVER · REPEAT |
| Hero | 부제 | "뛰기 전에는 가볍게, 뛰고 난 뒤에는 깨끗하게" |
| 코스 카드 | 사우나 이름 | `사우나 이름` |
| 코스 카드 | 주소 | `OO구 OO동 OO로` |
| 코스 카드 | 거리/시간 | `5km / 약 30분` |
| 코스 카드 | 지도 링크 | `https://map.kakao.com/...` |

### 3-2. 이미지 교체 (선택)

현재는 이모지 + 그라데이션으로 구성. 사진을 넣으려면 `img` 태그 추가.

---

## 4. 예약 관리 흐름

1. 사용자가 랜딩 페이지에서 "참가 신청" 클릭
2. Airtable Form 제출
3. Airtable `Bookings` 테이블에 자동 저장
4. 운영자가 `Status`를 `신청` → `입금확인`으로 변경
5. 당일 사우나에서 `Status`를 `체크인`으로 변경
6. 러닝/사우나/환복 완료 후 `Status`를 `완료`로 변경
7. 운영자가 피드백 폼(별도 Google Forms 또는 Airtable Form) 링크 발송

---

## 5. 도메인 연결 (선택)

GitHub Pages에 커스텀 도메인을 연결하려면:

1. 도메인 구매 (가비아, Cloudflare 등)
2. DNS에 CNAME 레코드 추가: `run-recover-repeat.example.com` → `username.github.io`
3. repo Settings → Pages → Custom domain 입력
4. `CNAME` 파일에 도메인 추가 (GitHub가 자동 생성)

---

## 6. 비용 요약

| 항목 | 비용 |
|---|---|
| GitHub Pages | ₩0 |
| Airtable 무료 티어 | ₩0 (1,000 레코드/월) |
| 지도 공유 링크 | ₩0 |
| 도메인 | 선택 (약 ₩15,000/년) |

---

## 7. 검증 후 확장

Airtable 한계에 부딪히면 B안으로 전환:

- Next.js + Vercel + Supabase
- Toss Payments 연동
- 카카오맵 JS API로 동적 지도
