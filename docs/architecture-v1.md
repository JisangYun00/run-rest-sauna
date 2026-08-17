# MVP 아키텍처 v1 — 근처 제휴 사우나 찾기

> 핵심 아이디어: 결제 없이, 러너가 뛰기 전 사우나를 예약하고, 뛰고 난 뒤 지도로 근처 제휴 사우나를 찾아간다.

---

## 1. 구조 한 줄 요약

**정적 랜딩 + 카카오맵 + 브라우저 위치 + 정적 사우나 데이터 + Google Forms 예약**

```
GitHub Pages (index.html + app.js + saunas.json)
        │
        ├──▶ 카카오맵 JavaScript API (지도 + 마커 + 길찾기)
        │
        ├──▶ 브라우저 Geolocation API (내 위치)
        │
        └──▶ Google Forms (예약 접수)
```

---

## 2. 사용 서비스

| 서비스 | 용도 | 비용 |
|---|---|---|
| GitHub Pages | 정적 페이지 호스팅 | ₩0 |
| 카카오맵 JavaScript API | 지도 + 마커 + 길찾기 연동 | ₩0 (키 발급 필요) |
| 브라우저 Geolocation API | 사용자 현재 위치 확인 | ₩0 |
| Google Forms | 사우나 예약 접수 | ₩0 |
| Google Sheets | 예약 데이터 저장 | ₩0 |

---

## 3. 핵심 사용자 흐름

### 러닝 전 (Pre-run)

1. 사용자가 랜딩 페이지 접속
2. 지도에서 **제휴 사우나 마커** 확인
3. 원하는 사우나 카드 선택
4. **예약하기** 버튼 → Google Form 열림 (사우나, 날짜, 시간, 이름, 연락처 입력)
5. 운영자가 Google Sheets에서 확인 후 문자/카톡으로 승인 안내

### 러닝 중 / 러닝 후 (During / Post-run)

1. 사용자가 뛰고 난 뒤 웹앱 다시 접속
2. **내 주변 사우나 찾기** 버튼 클릭
3. 브라우저가 현재 위치 수집
4. 가장 가까운 제휴 사우나 자동 선택 + 지도에 표시
5. **길찾기** 버튼 클릭 → 카카오맵 길찾기로 이동
6. 사우나 도착 → 샤워/사우나/환복

---

## 4. 데이터 구조 (정적 JSON)

`saunas.json`에 제휴 사우나 데이터를 하드코딩.

```json
[
  {
    "id": "sauna-a",
    "name": "OO 사우나",
    "address": "서울특별시 OO구 OO동 OO로 12",
    "lat": 37.5665,
    "lng": 126.9780,
    "hours": "05:00 - 22:00",
    "facilities": ["사우나", "냉탕", "샤워", "탈의실"],
    "wear": true,
    "courses": [
      { "name": "한강 5km", "distanceKm": 5, "mapUrl": "https://map.kakao.com/..." }
    ],
    "formUrl": "https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.123=OO%20%EC%82%AC%EC%9A%B4%EC%95%84"
  }
]
```

> `formUrl`에 사우나 ID를 미리 채워넣으면 사용자가 폼에서 사우나를 다시 선택하지 않아도 됨.

---

## 5. 화면 구성

| 화면 | 설명 |
|---|---|
| **랜딩** | 서비스 소개, CTA: "내 주변 사우나 찾기" |
| **지도 메인** | 카카오맵 + 전체 제휴 사우나 마커 + 내 위치 버튼 |
| **사우나 카드** | 이름, 주소, 거리, 시설, 예약하기/길찾기 버튼 |
| **예약 폼** | Google Forms 임베드 또는 새 탭 |

---

## 6. 지도 기능 상세

### 필요한 API

- **카카오맵 JavaScript API**: 지도 렌더링, 마커, 인포윈도우
- **브라우저 Geolocation API**: `navigator.geolocation.getCurrentPosition(...)`

### 동작

1. 페이지 로드 시 `saunas.json` 불러오기
2. 카카오맵 초기화 (서울 시청 기준 줌)
3. 제휴 사우나 마커 추가
4. 사용자가 "내 위치 찾기" 클릭
5. 현재 위치 받아서 지도 중심 이동 + 마커 추가
6. 가장 가까운 사우나 계산 (Haversine 거리)
7. 해당 사우나 카드 강조 + "길찾기" 버튼 활성화

### 길찾기

- 카카오맵 길찾기 URL 형식:
  ```
  https://map.kakao.com/link/to/목적지명,위도,경도
  ```
- 예시: `https://map.kakao.com/link/to/OO사우나,37.5665,126.9780`

---

## 7. 예약 흐름

```
지도에서 사우나 선택
        │
        ▼
사우나 카드 → "예약하기"
        │
        ▼
Google Forms (사우나 미리 채워짐)
        │
        ▼
Google Sheets에 자동 저장
        │
        ▼
운영자가 확인 후 안내 연락
```

---

## 8. 파일 구조

```
.
├── index.html          # 랜딩 + 지도 + 사우나 카드
├── css/
│   └── style.css       # 추가 스타일 (선택)
├── js/
│   └── app.js          # 지도 초기화, 위치, 거리 계산, 폼 연결
├── data/
│   └── saunas.json     # 제휴 사우나 데이터
└── docs/
    └── architecture-v1.md
```

---

## 9. 구현 단계

| 단계 | 작업 | 산출물 |
|---|---|---|
| 1 | GitHub repo + Pages 설정 | 배포 URL |
| 2 | 카카오 개발자 계정 + JavaScript 키 발급 | API 키 |
| 3 | `saunas.json` 샘플 데이터 작성 | JSON 파일 |
| 4 | `index.html` 랜딩/지도 UI 작성 | 정적 페이지 |
| 5 | `app.js` 카카오맵 + 위치 + 길찾기 연동 | JS 파일 |
| 6 | Google Forms 예약 폼 생성 | 폼 링크 |
| 7 | 사우나별로 formUrl 파라미터 채워넣기 | 완성된 JSON |
| 8 | 지인 2~3명으로 테스트 | 피드백 |

---

## 10. 비용 요약

| 항목 | 비용 |
|---|---|
| GitHub Pages | ₩0 |
| 카카오맵 API | ₩0 (일일 호출 한도 내) |
| Google Forms/Sheets | ₩0 |
| 도메인 | 선택 |

---

## 11. 향후 확장

- 사우나 데이터를 Google Sheets에서 동적으로 읽어오기
- 실시간 예약 가능 시간/잔여 Wear 재고 표시
- 사업자 등록 후 Toss Payments 결제 연동
- 사용자 계정 + 예약 내역 조회
