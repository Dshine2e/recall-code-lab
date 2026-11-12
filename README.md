# recall · 코딩테스트 복습실

> 틀린 문제는 실패가 아니라, 다음에 맞힐 문제입니다.

매일 새벽 3시(KST)에 새 문제 3개(입문/기본/도전)가 도착하는 코딩테스트 연습 사이트입니다.
Python과 C++로 브라우저에서 바로 코드를 쓰고, 테스트를 실행해 통과 여부를 확인할 수 있어요.

- 사이트: https://dshine2e.github.io/recall-code-lab/
- 코드 실행: [Wandbox](https://wandbox.org) API를 브라우저에서 직접 호출합니다. 전송되는 것은 코드와 표준 입력뿐이에요.
- 테스트는 학습용이며 공식 채점기가 아닙니다. 채점은 줄 끝 공백과 마지막 빈 줄을 무시하고 비교해요.
- 풀이 상태·코드 초안·실행 결과는 이 브라우저의 localStorage(`recall-state-v1`)에만 저장돼요.

## 구성
| 경로 | 내용 |
|---|---|
| `index.html`, `assets/` | 빌드 없는 정적 사이트 (CodeMirror 5.65.16 포함) |
| `problems/` | 날짜별 문제(`YYYY-MM-DD.json`), 기본기(`base.json`), `manifest.json` |
| `.solutions/` | 검증용 정답 코드(Python/C++)와 최대 입력 생성기 |
| `tools/validate.py` | 스키마 검사 + 정답 실행 검증 |
| `tests/e2e.cjs` | 로컬 화면 테스트(Playwright) |
| `.github/workflows/daily-problems.yml` | 매일 03:00 KST 문제 자동 생성 |
| `CLAUDE.md` | 일일 문제 생성 절차 |

## 검증
```sh
python3 tools/validate.py --require-solutions      # 전체
python3 tools/validate.py --only daily-2026-11-12-1 --require-solutions
python3 tools/validate.py --build-manifest
```

## 자동 생성 설정
저장소 Settings → Secrets and variables → Actions → New repository secret 에서 `ANTHROPIC_API_KEY` 를 등록하면
매일 18:00 UTC(03:00 KST)에 워크플로가 `CLAUDE.md`의 절차를 수행해 문제를 커밋합니다. 실패하면 이슈가 열려요.
