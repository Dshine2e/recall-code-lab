# recall · 코딩테스트 복습실

GitHub Pages(main / 루트)로 배포하는 빌드 없는 정적 사이트(HTML/CSS/JS). 주소가 `/recall-code-lab/` 하위라서 모든 경로는 상대경로로 쓴다.

## 구조
- `index.html`, `assets/css/style.css`, `assets/js/*.js` — 사이트(ES 모듈). `assets/vendor/codemirror/` — CodeMirror 5.65.16
- `problems/<YYYY-MM-DD>.json` — 그날 문제 3개(입문→기본→도전), `problems/seed-NN.json` — 한꺼번에 채운 문제(파일당 3~8개, 입문→기본→도전), `problems/base.json` — 기본기 8개, `problems/manifest.json` — `{"files":[...]}` (날짜 파일 최신 먼저 → seed 번호 순 → base.json 마지막). 사이트는 파일 순서가 아니라 addedOn 내림차순(null 맨 뒤)으로 보여 준다.
- `concepts/<slug>.json` — 개념서 항목, `concepts/manifest.json` — `{"concepts":[{slug,title,category,summary,topics}]}` (validate_concepts.py --build-manifest 가 만든다)
- `.solutions/<id>.py`, `.solutions/<id>.cpp` — 검증된 정답, `.solutions/<id>.gen.py` — 최대 크기 입력 생성기
- `tools/validate.py` — 스키마·힌트 검사 + 정답 실행 검증(표준 라이브러리만). `tools/validate_concepts.py` — 개념서 스키마 검사 + 예제 실제 실행. `tools/stats.py` — 난이도별 개수·비율(목표 50개 = 입문 15 / 기본 25 / 도전 10)
- `tests/e2e.cjs` — 로컬 Playwright 화면 테스트
- `.github/workflows/daily-problems.yml` — 매일 03:00 KST에 아래 절차를 실행

## 문제 데이터 형식
문제 객체: `{ id, title, category, topic, syntax, difficulty, minutes, addedOn, description, tests:[{label,input,output}], python, cpp, hints:[3개] }`
- `id` = `daily-YYYY-MM-DD-N` (N=1~3). `addedOn` = 파일 날짜.
- seed 문제: `id` = `seed-NNN`(seed-001부터 이어서), `addedOn` = 만든 날짜(KST). 그 밖의 규칙(엄격 규칙 포함)은 일일 문제와 같다.
- `hints` = 정확히 3개의 한국어 문자열(각 2~4문장, 600자 이하). 1) 어떤 알고리즘/자료구조를 쓰는지와 왜 맞는지 2) 핵심 아이디어와 처리 순서를 말로 3) 놓치기 쉬운 점과 목표 시간 복잡도. 코드·의사코드·정답에 가까운 구체적인 식은 쓰지 않는다(함수 이름 언급은 괜찮다). validate.py 가 개수·길이·코드 흔적(``` , `def `, `#include`, `for (`, `print(` 등)을 검사한다.
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

## 개념서 형식
`concepts/<slug>.json`:
```
{ "slug": "binary-search", "title": "이분 탐색", "category": "탐색", "order": 1,
  "summary": "한 줄 요약", "when": ["이럴 때 써요", ...],
  "topics": ["이분 탐색", "=정렬", ...],   // 문제 topic 에 이 문자열이 들어 있으면 관련 문제로 연결(대소문자 무시). '='로 시작하면 topic 이 정확히 같을 때만
  "python": { "items": [{ "name", "signature", "does", "when", "complexity" }],
              "examples": [{ "title", "code"(완전한 프로그램), "stdin"(선택), "output" }],
              "pitfalls": [{ "wrong", "right", "why" }] },
  "cpp": { 같은 구조 },
  "decision": [{ "situation": "A일 때", "use": "이것" }],
  "checklist": ["시험장에서 확인할 것", ...] }
```
- category: 기초 문법 | 자료구조 | 탐색 | 알고리즘 | 그래프 | 수학 | 실전 팁. order 는 카테고리 안 순서.
- 예제 output 은 손으로 쓰지 말고 실제 실행 결과를 적는다. `python3 tools/validate_concepts.py` 가 Python(`-I -X utf8`)과 C++(`g++ -O2 -std=c++17`)로 실행해 비교한다. pitfalls 의 코드 조각과 복잡도도 직접 실행·확인한 것만 적는다.
- 도구 사용법과 선택 기준만 다룬다. 특정 문제의 정답이나 풀이는 쓰지 않는다.
- 두 언어 차이가 흔한 실수가 되는 곳(heapq 최소 힙 / priority_queue 최대 힙, heapify 반환값 없음, sort()와 sorted(), map 의 [] 가 원소를 만듦, size()-1 언더플로, 음수 나눗셈·나머지 등)은 해당 항목의 pitfalls 에 짚는다.

## 일일 문제 생성 절차

1. 날짜는 `TZ=Asia/Seoul date +%F`. problems/<날짜>.json이 이미 있으면 아무것도 하지 않고 종료한다(멱등).
2. manifest와 최근 14일 문제의 title/topic을 읽고, 같은 주제·비슷한 설정을 반복하지 않는다. 오래 안 다룬 주제를 우선한다.
3. 3문제를 입문→기본→도전 순으로 만든다.
   - 입문 / 기초 문법 / 10~15분: 조건문, 반복문, 문자열, 리스트, 입출력, 간단한 구현. N ≤ 100.
   - 기본 / 알고리즘 / 20~30분: 정렬, 이분 탐색, 투 포인터, 스택·큐·덱, 해시, 누적 합, 그리디, BFS/DFS. N이 커서(약 2×10^5) 정해 복잡도가 필요하다.
   - 도전 / 백준형 / 40~60분: DP, 최단 경로, 유니온 파인드, 세그먼트 트리/펜윅, 비트마스크, 복합 구현 중 하나. 짧은 이야기 + 엄밀한 제약.
   - 문제마다 `hints` 3개는 필수다(형식은 위 "문제 데이터 형식"). 힌트는 정답 코드를 다 쓴 뒤, 정답을 그대로 드러내지 않는 선에서 쓴다.
4. 직접 만든 창작 문제로 한다(백준·프로그래머스 문제 본문을 가져오지 말 것). 정답은 입력당 하나로 유일해야 하고(스페셜 저지 불필요), 제약·입출력 형식·경계 값을 빠짐없이 적는다. Python과 C++ 모두로 풀 수 있어야 하고, C++에서 long long이 필요하면 제약에 명시한다. `syntax`에는 두 언어에서 자주 틀리는 포인트(long long, 1-based 인덱스, append 인자 등)를 적는다.
5. 테스트는 입문·기본 4~5개, 도전 5~6개. label은 "기본:", "경계:", "반례:"로 시작한다. 경계·반례는 흔한 실수(off-by-one, 오버플로, 같은 값, 빈/최소 입력)를 겨냥한다. 기대 출력은 손으로 쓰지 말고 검증된 정답 코드를 실행해서 만든다.
6. 정답을 Python과 C++로 각각 독립적으로 작성해 .solutions/<id>.py / .cpp 에 저장한다. 기본·도전은 최대 크기 입력 생성기 .solutions/<id>.gen.py 도 만든다. 도전은 브루트포스로 작은 무작위 입력 수십 개를 교차 검증한다.
7. `python3 tools/validate.py --only <새 id들> --require-solutions` 가 통과할 때까지 고친다. 한 문제가 3번 시도해도 통과하지 못하면 다른 문제로 교체한다. 검증을 통과하지 못한 문제는 절대 커밋하지 않는다. 3문제를 못 채우면 아무것도 커밋하지 않고 실패로 종료한다.
8. problems/<날짜>.json 저장 후 `python3 tools/validate.py --build-manifest` 를 실행하고, `python3 tools/stats.py` 결과를 마지막 메시지(로그)에 남긴다. 변경은 problems/ 와 .solutions/ (그리고 9번의 concepts/) 안에서만 하고, 커밋 메시지 "daily: <날짜> 문제 3개 추가 (입문/기본/도전)" 로 main에 푸시한다.
9. 새 문제의 topic 과 이어지는 개념서 항목이 없으면(`python3 tools/validate_concepts.py --coverage --schema-only` 로 확인) 기존 항목의 topics 에 문자열을 더하거나 새 항목을 concepts/ 에 추가한다. 추가했다면 `python3 tools/validate_concepts.py --build-manifest` 가 통과해야 커밋에 넣는다. 개념서 추가가 실패하면 concepts/ 변경을 되돌리고 문제만 커밋한다(문제 커밋을 막지 않는다).

### 절차 실행 참고
- 기대 출력 생성, 브루트포스 비교 같은 임시 스크립트는 저장소 밖(`/tmp` 등)에 둔다. 저장소에는 problems/ 와 .solutions/ (개념서를 추가했다면 concepts/) 변경만 남긴다.
- 생성기(`.gen.py`)는 시드를 고정해 항상 같은 입력을 출력하게 하고, 입력 크기는 제약의 최댓값으로 맞춘다. 검증 시간 제한은 Python 5초, C++ 2초다.
- 스케줄러(GitHub Actions)에서 실행될 때 main 푸시가 막히면 커밋까지만 하고 끝내도 된다. 워크플로 후처리 단계가 경로 제한과 전체 검증을 다시 확인한 뒤 main에 푸시한다.
- 실패로 끝낼 때는 마지막 메시지에 이유(어느 문제가 어떤 검증에서 막혔는지)를 적는다.

## 로컬 개발
- 검증: `python3 tools/validate.py --require-solutions` (Windows에서는 MSYS2 `C:\msys64\ucrt64\bin\python3.exe`)
- 화면 테스트: `npm i --no-save playwright-core` 후 `node tests/e2e.cjs` (Chrome 필요, Wandbox는 로컬 python3/g++ 목으로 대체)
- Windows Git Bash에는 tz 데이터가 없어 `TZ=Asia/Seoul date +%F`가 UTC 날짜를 낸다. 로컬에서는 `C:\msys64\usr\bin\date.exe`나 `python3 -c "import datetime,zoneinfo;print(datetime.datetime.now(zoneinfo.ZoneInfo('Asia/Seoul')).date())"`로 확인한다.
- 사이트 수정 시 상대경로 유지, 외부 의존은 Pretendard(jsDelivr)와 Wandbox API뿐이다.
