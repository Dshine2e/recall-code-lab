# recall · 코딩테스트 복습실

> 틀린 문제는 실패가 아니라, 다음에 맞힐 문제입니다.

매일 새벽 3시(KST)에 새 문제 10개(입문 3 · 기본 5 · 도전 2 안팎)가 도착하는 코딩테스트 연습 사이트입니다.
Python과 C++로 브라우저에서 바로 코드를 쓰고 채점할 수 있고, 로그인하면 풀이 기록이 계정에 저장됩니다.

- 문제 열람·코드 실행·힌트·개념서는 로그인 없이 쓸 수 있어요.
- 로그인하면 문제마다 상태(안 풂 / 시도함 / 해결 / 다시 풀기), 해결 날짜, 걸린 시간, 메모, 내 코드를 저장하고 다른 기기에서도 볼 수 있어요.
- 코드 실행은 [Wandbox](https://wandbox.org) API를 브라우저에서 직접 호출합니다. 전송되는 것은 코드와 표준 입력뿐이에요.
- 비밀번호는 bcrypt 해시로만 저장합니다.

## 구성
| 경로 | 내용 |
|---|---|
| `app/`, `components/`, `lib/` | Next.js(App Router) 사이트 |
| `lib/db/schema.ts`, `drizzle/` | DB 스키마(users, progress, login_attempts)와 마이그레이션 |
| `problems/`, `concepts/` | 문제와 개념서(JSON, 사이트가 직접 읽음) |
| `.solutions/`, `tools/` | 검증용 정답과 검증·통계 도구 |
| `tests/e2e.cjs` | 화면 테스트(Playwright) |
| `.github/workflows/daily-problems.yml` | 매일 03:00 KST 문제 자동 생성 |
| `CLAUDE.md` | 데이터 형식과 일일 문제 생성 절차 |

## 로컬 실행
```sh
npm install
cp .env.example .env.local   # AUTH_SECRET 값을 채운다
npm run dev                  # http://localhost:3000
```
`DATABASE_URL` 을 비워 두면 `.data/` 폴더의 내장 DB를 씁니다.

## 배포
[docs/DEPLOY.md](docs/DEPLOY.md) 에 Vercel 배포 순서를 적어 두었습니다.

## 문제 검증
```sh
python3 tools/validate.py --require-solutions
python3 tools/stats.py            # 난이도 통계, --plan / --suggest 는 다음 날 계획
```
