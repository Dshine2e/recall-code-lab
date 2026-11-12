# recall · 코딩테스트 복습실

GitHub Pages(main / 루트)로 배포하는 빌드 없는 정적 사이트(HTML/CSS/JS). 주소가 `/recall-code-lab/` 하위라서 모든 경로는 상대경로로 쓴다.

## 구조
- `index.html`, `assets/css/style.css`, `assets/js/*.js` — 사이트(ES 모듈). `assets/vendor/codemirror/` — CodeMirror 5.65.16
- `problems/<YYYY-MM-DD>.json` — 그날 문제 3개(입문→기본→도전), `problems/base.json` — 기본기 8개, `problems/manifest.json` — `{"files":[...]}` (최신 날짜 먼저, base.json 마지막)
- `.solutions/<id>.py`, `.solutions/<id>.cpp` — 검증된 정답, `.solutions/<id>.gen.py` — 최대 크기 입력 생성기
- `tools/validate.py` — 스키마 검사 + 정답 실행 검증(표준 라이브러리만). `tests/e2e.cjs` — 로컬 Playwright 화면 테스트
- `.github/workflows/daily-problems.yml` — 매일 03:00 KST에 아래 절차를 실행

## 문제 데이터 형식
문제 객체: `{ id, title, category, topic, syntax, difficulty, minutes, addedOn, description, tests:[{label,input,output}], python, cpp }`
- `id` = `daily-YYYY-MM-DD-N` (N=1~3). `addedOn` = 파일 날짜.
- `difficulty` = 입문 | 기본 | 도전, `category` = 기초 문법(입문) | 알고리즘(기본) | 백준형(도전) | 기본기
- `description` 템플릿:
  ```
  [유형] …
  [알고리즘 주제] …
  [핵심 문법] …
  [난이도] …
  [예상 풀이 시간] N분

  (문제 본문)

  [제약]
  - …

  [입력 형식]
  …

  [출력 형식]
  …
  ```
- `python` = `"# 표준 입력을 읽고 결과를 출력하세요.\n"`
- `cpp` = `"#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // 표준 입력을 읽고 결과를 출력하세요.\n    return 0;\n}\n"`
- 채점 규칙(사이트와 validate.py 공통): 각 줄 오른쪽 공백 제거, 끝의 빈 줄 무시 후 비교.
- 이전 사이트에서 옮겨 온 14문제(기본기 8개 + 2026-11-10, 11-11)는 옛 형식 그대로 둔다. 기본기 시작 코드의 버그는 일부러 심어 둔 것이니 고치지 않는다.

## 일일 문제 생성 절차

1. 날짜는 `TZ=Asia/Seoul date +%F`. problems/<날짜>.json이 이미 있으면 아무것도 하지 않고 종료한다(멱등).
2. manifest와 최근 14일 문제의 title/topic을 읽고, 같은 주제·비슷한 설정을 반복하지 않는다. 오래 안 다룬 주제를 우선한다.
3. 3문제를 입문→기본→도전 순으로 만든다.
   - 입문 / 기초 문법 / 10~15분: 조건문, 반복문, 문자열, 리스트, 입출력, 간단한 구현. N ≤ 100.
   - 기본 / 알고리즘 / 20~30분: 정렬, 이분 탐색, 투 포인터, 스택·큐·덱, 해시, 누적 합, 그리디, BFS/DFS. N이 커서(약 2×10^5) 정해 복잡도가 필요하다.
   - 도전 / 백준형 / 40~60분: DP, 최단 경로, 유니온 파인드, 세그먼트 트리/펜윅, 비트마스크, 복합 구현 중 하나. 짧은 이야기 + 엄밀한 제약.
4. 직접 만든 창작 문제로 한다(백준·프로그래머스 문제 본문을 가져오지 말 것). 정답은 입력당 하나로 유일해야 하고(스페셜 저지 불필요), 제약·입출력 형식·경계 값을 빠짐없이 적는다. Python과 C++ 모두로 풀 수 있어야 하고, C++에서 long long이 필요하면 제약에 명시한다. `syntax`에는 두 언어에서 자주 틀리는 포인트(long long, 1-based 인덱스, append 인자 등)를 적는다.
5. 테스트는 입문·기본 4~5개, 도전 5~6개. label은 "기본:", "경계:", "반례:"로 시작한다. 경계·반례는 흔한 실수(off-by-one, 오버플로, 같은 값, 빈/최소 입력)를 겨냥한다. 기대 출력은 손으로 쓰지 말고 검증된 정답 코드를 실행해서 만든다.
6. 정답을 Python과 C++로 각각 독립적으로 작성해 .solutions/<id>.py / .cpp 에 저장한다. 기본·도전은 최대 크기 입력 생성기 .solutions/<id>.gen.py 도 만든다. 도전은 브루트포스로 작은 무작위 입력 수십 개를 교차 검증한다.
7. `python3 tools/validate.py --only <새 id들> --require-solutions` 가 통과할 때까지 고친다. 한 문제가 3번 시도해도 통과하지 못하면 다른 문제로 교체한다. 검증을 통과하지 못한 문제는 절대 커밋하지 않는다. 3문제를 못 채우면 아무것도 커밋하지 않고 실패로 종료한다.
8. problems/<날짜>.json 저장 후 `python3 tools/validate.py --build-manifest` 를 실행한다. 변경은 problems/ 와 .solutions/ 안에서만 하고, 커밋 메시지 "daily: <날짜> 문제 3개 추가 (입문/기본/도전)" 로 main에 푸시한다.

### 절차 실행 참고
- 기대 출력 생성, 브루트포스 비교 같은 임시 스크립트는 저장소 밖(`/tmp` 등)에 둔다. 저장소에는 problems/ 와 .solutions/ 변경만 남긴다.
- 생성기(`.gen.py`)는 시드를 고정해 항상 같은 입력을 출력하게 하고, 입력 크기는 제약의 최댓값으로 맞춘다. 검증 시간 제한은 Python 5초, C++ 2초다.
- 스케줄러(GitHub Actions)에서 실행될 때 main 푸시가 막히면 커밋까지만 하고 끝내도 된다. 워크플로 후처리 단계가 경로 제한과 전체 검증을 다시 확인한 뒤 main에 푸시한다.
- 실패로 끝낼 때는 마지막 메시지에 이유(어느 문제가 어떤 검증에서 막혔는지)를 적는다.

## 로컬 개발
- 검증: `python3 tools/validate.py --require-solutions` (Windows에서는 MSYS2 `C:\msys64\ucrt64\bin\python3.exe`)
- 화면 테스트: `npm i --no-save playwright-core` 후 `node tests/e2e.cjs` (Chrome 필요, Wandbox는 로컬 python3/g++ 목으로 대체)
- Windows Git Bash에는 tz 데이터가 없어 `TZ=Asia/Seoul date +%F`가 UTC 날짜를 낸다. 로컬에서는 `C:\msys64\usr\bin\date.exe`나 `python3 -c "import datetime,zoneinfo;print(datetime.datetime.now(zoneinfo.ZoneInfo('Asia/Seoul')).date())"`로 확인한다.
- 사이트 수정 시 상대경로 유지, 외부 의존은 Pretendard(jsDelivr)와 Wandbox API뿐이다.
