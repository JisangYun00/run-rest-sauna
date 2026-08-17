# MVP 웹앱 설계안

> 목표: 돈 안 들이고, 사우나 1곳 + 러너 소수로 검증할 수 있는 최소 웹앱

---

## 1. 결론: 어떤 조합으로 시작할까?

| 우선순위 | 조합 | 장점 | 단점 | 추천 |
|---|---|---|---|---|
| 1 | **GitHub Pages + Airtable** | 완전 무료, 코드 거의 안 써도 됨, 관리자 UI 제공 | 커스텀 UI/로직 한계 | ⭐ **첫 MVP 추천** |
| 2 | GitHub Pages + Google Sheets | 완전 무료, 익숙함 | UI/자동화 직접 만들어야 함 | 예약 폼이 단순할 때 |
| 3 | **Next.js + Vercel + Supabase** | 진짜 웹앱, 확장성 좋음 | 학습/설정 시간 듦 | 검증 후 확장 단계 |
| 4 | GitHub Pages만 | 호스팅 무료 | 예약/DB/관리자 불가 | ❌ 부족 |

**첫 MVP 추천: A안 (GitHub Pages + Airtable)**
- 랜딩 페이지는 GitHub Pages로 정적 배포
- 예약 신청은 Airtable Form을 iframe 또는 링크로 연결
- 관리자는 Airtable에서 바로 확인/필터링
- 지도는 카카오맵/네이버맵 **공유 링크** 또는 **OpenStreetMap** 사용

---

## 2. GitHub Pages로 할 수 있는 것과 없는 것

| 할 수 있는 것 | 없는 것 |
|---|---|
| HTML/CSS/JS로 된 정적 페이지 | 서버에서 실행되는 API |
| React/Vue/Next.js 정적보내기(`next export`) | 데이터베이스 직접 연결 |
| 외부 서비스(Airtable/Google Forms) 임베드 | 백엔드 로직(결제, 알림, 인증 등) |
| Git push로 자동 배포 | 서버리스 함수 실행 |

> 즉, GitHub Pages는 **보여주기용 랜딩 + 예약 폼 링크**까지.  
> 예약 데이터를 저장하고 관리하려면 Airtable 같은 외부 서비스가 필요.

---

## 3. A안: 가장 게으르고 빠른 설계

### 3-1. 구성도

```
사용자 ──▶ GitHub Pages (정적 랜딩)
              │
              ├──▶ 코스/사우나 안내 (이미지 + 지도 링크)
              │
              └──▶ "참가 신청" 버튼 ──▶ Airtable Form
                                            │
운영자 ─────▶ Airtable (신청자 목록, 입금 확인, 러닝복 사이즈)
```

### 3-2. 필요한 서비스/계정

| 서비스 | 용도 | 비용 | 비고 |
|---|---|---|---|
| GitHub | 코드 저장 + GitHub Pages 배포 | 무료 | public repo |
| Airtable | 예약 데이터베이스 + 관리자 UI | 무료 티어 | 1,000개 레코드/월 |
| Google Analytics | 랜딩 방문/전환 측정 | 무료 | 선택 |
| Kakao/Naver 지도 | 코스 지도 공유/임베드 | 무료 | 공유 링크 방식 |

### 3-3. 페이지 구성

```
/
├── index.html          # 랜딩 + 서비스 소개 + CTA
├── course.html         # 러닝 코스 + 사우나 정보 (또는 index 내 섹션)
├── faq.html            # 자주 묻는 질문
└── apply.html          # Airtable Form 리다이렉트 (선택)
```

### 3-4. 예약 흐름

1. 랜딩에서 "참가 신청" 클릭
2. Airtable Form 열림
3. 신청자가 이름/연락처/날짜/사이즈 입력
4. Airtable에 자동 저장
5. 운영자가 Airtable에서 입금 확인 후 `status` 필드 변경
6. 당일 사우나에서 체크인

### 3-5. Airtable 테이블 설계

| 필드 | 타입 | 설명 |
|---|---|---|
| name | Single line text | 이름 |
| phone | Phone | 연락처 |
| run_date | Date | 러닝 날짜 |
| run_time | Single select | 07:00 / 08:00 / 18:00 / 19:00 |
| wear_size | Single select | S / M / L / XL / 필요없음 |
| status | Single select | 신청 → 입금확인 → 체크인 → 완료 |
| paid_amount | Number | 입금액 |
| feedback_link | URL | 피드백 폼 링크 (완료 후 발송) |
| notes | Long text | 관리용 메모 |

---

## 4. B안: 진짜 웹앱으로 확장할 때

검증이 끝나고 멤버십/결제/실시간 재고를 붙일 때 추천.

### 4-1. 구성도

```
사용자 ──▶ Next.js (Vercel)
              │
              ├──▶ Server Action / API Route
              │         │
              ▼         ▼
           Supabase Postgres  (DB)
```

### 4-2. 기술 스택

| 영역 | 선택 | 비용 |
|---|---|---|
| 프레임워크 | Next.js 14 App Router | 무료 |
| 배포 | Vercel | 무료 티어 |
| DB | Supabase Postgres | 무료 티어 (500MB) |
| 스타일 | Tailwind CSS | 무료 |
| 지도 | Kakao Maps JS API | 무료 |
| 결제 | 초기 수동 입금 / 추후 Toss Payments | 수동: 무료 |

### 4-3. API 목록

```
GET  /api/saunas          # 사우나 목록
GET  /api/courses         # 코스 목록
POST /api/bookings        # 예약 신청
GET  /api/admin/bookings  # 관리자용 예약 목록
POST /api/admin/checkin   # 체크인 처리
POST /api/feedback        # 피드백 저장
```

---

## 5. 지도 API 선택

러닝 코스를 보여주는 방법은 **동적 지도 API**가 아니라도 충분함.

| 방식 | 추천도 | 비용 | 사용처 |
|---|---|---|---|
| **카카오맵 공유 링크** | ⭐⭐⭐ | 무료 | 코스 공유, 버튼 하나로 이동 |
| **네이버지도 공유 링크** | ⭐⭐⭐ | 무료 | 코스 공유 |
| OpenStreetMap + Leaflet | ⭐⭐ | 무료 | 홈페이지에 직접 임베드 |
| Kakao Maps JS API | ⭐⭐ | 무료 (키 발급) | 커스텀 핀, 폴리라인 |
| Naver Maps API | ⭐ | 무료 티어 있음 (신용카드 등록 필요) | 고급 기능 |

> ponytail: MVP에서는 코스 1개를 카카오맵으로 검색해서 **공유 링크**만 걸어도 충분. 동적 지도는 검증 후에 붙여라.

---

## 6. 필요한 API/서비스 요약

### 반드시 필요
- GitHub 계정 (배포)
- Airtable 계정 (데이터 + 관리자)
- 카카오맵/네이버지도 공유 링크 (코스 안내)

### 추가하면 좋음
- Google Analytics 4 (방문 추적)
- Cloudinary 무료 티어 (사진 호스팅, 대역폭 제한 있음)

### 나중에 추가
- Toss Payments / Kakao Pay (사업자 등록 후)
- Supabase / Vercel (진짜 웹앱으로 전환)

---

## 7. 사용자 흐름 (A안 기준)

```
[랜딩 페이지]
   │
   ▼
[코스 + 사우나 소개]
   │
   ▼
[참가 신청 버튼] ──▶ Airtable Form
   │
   ▼
[입금 안내 문자/카톡]
   │
   ▼
[운영자: Airtable에서 입금 확인]
   │
   ▼
[당일 사우나 체크인 + 러닝복 대여]
   │
   ▼
[러닝 → 사우나/샤워 → 환복]
   │
   ▼
[피드백 폼] ──▶ Airtable 또는 Google Forms
```

---

## 8. 개발 단계 (A안 기준)

| 단계 | 작업 | 산출물 |
|---|---|---|
| 1 | GitHub repo 생성 + Pages 설정 | `username.github.io/run-recover-repeat` |
| 2 | HTML 랜딩 페이지 작성 | `index.html` |
| 3 | Airtable Base 생성 + Form 생성 | 예약 링크 |
| 4 | 랜딩에 지도/코스/신청 버튼 추가 | 배포된 페이지 |
| 5 | 지인 2~3명으로 예약 흐름 테스트 | 피드백 |
| 6 | 실제 러너 10~30명 모집 + 운영 | Airtable 데이터 |
| 7 | Go/No-Go 기준 수치 확인 | 결정 |

---

## 9. 비용 요약

| 항목 | A안 비용 | B안 비용 |
|---|---|---|
| 호스팅 | ₩0 (GitHub Pages) | ₩0 (Vercel) |
| DB/관리자 | ₩0 (Airtable) | ₩0 (Supabase) |
| 지도 | ₩0 (공유 링크) | ₩0 (Kakao API) |
| 결제 | ₩0 (수동 입금) | ₩0 (수동 입금) |
| 도메인 | 선택 (약 ₩15,000/년) | 선택 |

---

## 10. 다음 할 일

1. **A안 vs B안 중 하나 확정**
2. GitHub repo 만들고 Pages 활성화
3. 사우나 1곳 + 코스 1개 정하기
4. Airtable Base 만들고 예약 Form 생성
5. 랜딩 페이지 1장 작성

> 가장 추천: **A안으로 일주일 안에 랜딩 + 예약 받아보고,反응 좋으면 B안으로 전환.**
