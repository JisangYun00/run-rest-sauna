# GitHub Pages 배포 가이드

> `run-rest-sauna` 프로젝트를 GitHub Pages로 무료 호스팅하는 방법

---

## 1. GitHub에 repo 생성

1. https://github.com/new 접속
2. Repository name: `run-rest-sauna`
3. Public 선택 (Private도 Pages 가능하지만 Public이 무료+간단)
4. README 초기화는 **체크하지 않기** (이미 우리가 작성함)
5. **Create repository**

---

## 2. 로컬 코드를 GitHub에 push

터미널에서 아래 명령 실행. (이메일/이름은 본인 것으로 교체)

```bash
# 현재 폴더가 프로젝트 루트인지 확인
cd /Users/jsyun/git/01_project/run-rest-sauna

# Git 초기화 (아직 안 했으면)
git init

# 사용자 정보 설정 (첫 commit 전에 한 번만)
git config user.email "you@example.com"
git config user.name "Your Name"

# 모든 파일 추가
git add .

# 첫 commit
git commit -m "init: local mvp with kakao map"

# GitHub repo 주소 연결 (본인 username으로 교체)
git remote add origin https://github.com/YOUR_USERNAME/run-rest-sauna.git

# push
git push -u origin main
```

> 만약 기본 브랜치가 `master`로 생성됐다면:  
> `git branch -M main` 명령으로 `main`으로 바꾸고 push.

---

## 3. GitHub Pages 활성화

1. GitHub repo → **Settings** 탭
2. 왼쪽 메뉴 **Pages**
3. **Source**: `Deploy from a branch` 선택
4. **Branch**: `main` / `/(root)` 선택
5. **Save** 클릭
6. 잠시 후 위쪽에 초록색 배너로 주소 표시:  
   `https://YOUR_USERNAME.github.io/run-rest-sauna/`

---

## 4. 배포 확인

1. 1~2분 기다리기
2. 브라우저에서 `https://YOUR_USERNAME.github.io/run-rest-sauna/` 접속
3. 카카오맵이 보이려면 카카오 개발자 콘솔에 아래 도메인 추가 필요

---

## 5. 카카오맵 도메인 등록

1. https://developers.kakao.com 접속
2. 내 애플리케이션 → `RunRe` 선택
3. [앱 설정] → [플랫폼] → [Web] → **사이트 도메인**
4. 아래 추가:
   ```
   https://YOUR_USERNAME.github.io
   https://YOUR_USERNAME.github.io/run-rest-sauna
   ```
5. **저장** 후 GitHub Pages URL 새로고침

---

## 6. 카카오맵이 안 보일 때 체크리스트

| 원인 | 확인/해결 |
|---|---|
| API 키가 잘못됨 | `index.html`의 `appkey=` 뒤에 JavaScript 키가 맞는지 확인 |
| 도메인 미등록 | 위 단계 5 확인 |
| HTTPS/HTTP 불일치 | GitHub Pages는 HTTPS. 등록도 `https://`로 |
| 캐시 | 브라우저 캐시 비우거나 시크릿 모드로 테스트 |

---

## 7. 이후 수정 배포

```bash
git add .
git commit -m "update: ..."
git push origin main
```

push 후 30초~1분 뒤 GitHub Pages에 자동 반영.

---

## 다음 할 일

배포 후:
1. `data/saunas.json`에 실제 사우나 정보로 교체
2. Google Forms 만들어 `formUrl` 업데이트
3. 지인들에게 URL 공유해서 예약 플로우 테스트
