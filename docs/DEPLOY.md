# Vercel 배포 가이드

처음 한 번만 하면 됩니다. 그 뒤로는 main 브랜치에 푸시될 때마다(매일 새벽 문제 추가 포함) Vercel 이 알아서 다시 배포합니다.

## 1. Vercel 가입과 프로젝트 만들기
1. https://vercel.com 에서 **Sign Up** → **Continue with GitHub** 로 가입합니다(요금제는 Hobby, 무료).
2. 대시보드에서 **Add New… → Project** 를 누릅니다.
3. **Import Git Repository** 목록에서 `recall-code-lab` 옆의 **Import** 를 누릅니다. 목록에 없으면 **Adjust GitHub App Permissions** 를 눌러 이 저장소 접근을 허용합니다.
4. Framework Preset 이 **Next.js** 로 잡혔는지 확인합니다. 다른 설정은 건드리지 않습니다.
5. 아직 **Deploy** 를 누르지 말고, 같은 화면의 **Environment Variables** 를 펼쳐 2번을 먼저 합니다.

## 2. AUTH_SECRET 넣기
로그인 세션을 서명하는 비밀 값입니다. 아무에게도 보여 주면 안 됩니다.
1. 내 컴퓨터 터미널에서 아래 명령을 실행하면 긴 문자열이 한 줄 나옵니다.
   ```sh
   node -e "console.log(require('crypto').randomBytes(33).toString('base64'))"
   ```
2. Vercel 의 Environment Variables 에 Key `AUTH_SECRET`, Value 에 그 문자열을 붙여 넣고 **Add** 를 누릅니다.
3. **Deploy** 를 누릅니다. 이 첫 배포는 DB 가 없어서 **실패하는 것이 정상**입니다. 3번을 하고 다시 배포합니다.

## 3. Neon(Postgres) 연결
1. Vercel 프로젝트 화면 위쪽의 **Storage** 탭 → **Create Database** → **Neon** (Serverless Postgres) → **Continue**.
2. 처음이면 Neon 약관 동의 화면이 나옵니다. 동의하고, Region 은 가까운 곳(예: Singapore), Plan 은 **Free** 를 고릅니다.
3. 이름은 그대로 두고 **Create** → 이어서 나오는 **Connect Project** 화면에서 이 프로젝트를 고르고, Environments 는 Production · Preview · Development 모두 체크된 채로 **Connect** 를 누릅니다.
4. 이제 **Settings → Environment Variables** 에 `DATABASE_URL`, `DATABASE_URL_UNPOOLED` 등이 자동으로 들어가 있습니다. 직접 입력할 것은 없습니다.

## 4. 다시 배포(마이그레이션은 자동)
1. **Deployments** 탭 → 맨 위 배포의 **⋯ → Redeploy** → **Redeploy**.
2. 빌드 로그에 `마이그레이션 적용 완료` 가 보이면 테이블이 만들어진 것입니다. 빌드 때마다 `scripts/migrate.mjs` 가 실행되어, 아직 적용되지 않은 마이그레이션만 적용합니다.
3. 배포가 끝나면 **Visit** 로 사이트를 열고, 회원가입 → 문제 하나 채점 → 마이페이지 순서로 확인합니다.

마이그레이션을 내 컴퓨터에서 직접 돌리고 싶을 때(보통은 필요 없습니다):
```sh
npx vercel link            # 처음 한 번: 이 폴더를 Vercel 프로젝트와 연결
npx vercel env pull .env.local
npm run db:migrate
```
`.env.local` 은 `.gitignore` 에 들어 있어 커밋되지 않습니다.

## 5. 배포 브랜치
- 지금 사이트 코드는 `vercel` 브랜치에 있습니다. Vercel 은 기본으로 `main` 을 운영(Production)으로 배포하므로, 둘 중 하나를 합니다.
  - 추천: `vercel` 브랜치를 `main` 에 합칩니다(Pull Request → Merge). 그러면 매일 새벽 main 에 추가되는 문제가 그대로 사이트에 반영됩니다.
  - 합치기 전에 먼저 보고 싶다면: `vercel` 브랜치를 푸시하면 Vercel 이 미리보기(Preview) 주소를 만들어 줍니다.
- main 에 합친 뒤에는 GitHub 저장소 **Settings → Pages → Source 를 None** 으로 바꿔 예전 사이트(GitHub Pages)를 끕니다.

## 문제가 생겼을 때
| 증상 | 확인할 것 |
|---|---|
| 빌드가 `DATABASE_URL 이 없습니다` 로 실패 | 3번(Neon 연결)을 했는지, 연결할 때 Production 이 체크됐는지 |
| 로그인하면 오류 페이지 | `AUTH_SECRET` 이 Production 환경에 들어 있는지. 넣은 뒤에는 Redeploy 가 필요 |
| 로그인 시도가 너무 많다고 나옴 | 같은 아이디로 15분 안에 5번 틀리면 잠깁니다. 15분 뒤 다시 시도 |
| 비밀번호를 잊음 | 이메일을 받지 않아 복구 기능이 없습니다. Neon 콘솔(SQL Editor)에서 그 사용자를 지우고 다시 가입합니다 |
