# RUN · RECOVER · REPEAT — Local MVP

사우나 예약 + 러닝 후 근처 제휴 사우나 찾기.

## 스택

- HTML + Tailwind CSS + Vanilla JS
- KakaoMap JavaScript API
- GitHub Pages (향후 배포)
- Google Forms (예약 접수)

## 로컬 실행

```bash
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 열기.

> 파일을 브라우저에서 직접 열면 fetch로 saunas.json을 불러올 수 없으니, 반드시 로컬 서버를 사용해야 함.

## 파일 구조

```
.
├── index.html          # 랜딩 + 지도 + 사우나 카드
├── js/
│   └── app.js          # 카카오맵, 위치, 거리 계산, 모달
├── data/
│   └── saunas.json     # 제휴 사우나 데이터
├── docs/
│   ├── mvp-design.md
│   ├── mvp-implementation-guide.md
│   └── architecture-v1.md
├── kakaomap_api.md     # JavaScript API 키
└── README.md
```

## 설정

1. `data/saunas.json`에 실제 사우나 정보로 교체
2. `formUrl`에 실제 Google Forms 링크로 교체
3. (선택) 사우나별 form prefill 파라미터 조정

## 예약 흐름

1. 지도에서 사우나 선택
2. "예약하기" 클릭
3. 모달의 계좌(카카오뱅크 3333-06-5300868)로 1,000원 입금
4. Google Forms로 예약 폼 작성
5. 운영자가 입금 확인 후 예약 확정
6. 현장에서 웰컴드링크(식혜) 제공
