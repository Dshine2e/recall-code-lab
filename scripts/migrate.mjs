// drizzle/ 폴더의 마이그레이션을 DATABASE_URL 의 DB 에 적용한다.
// Vercel 에서는 빌드 때 자동으로 실행된다(package.json 의 vercel-build). 직접 실행: npm run db:migrate
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

config({ path: ['.env.local', '.env'], quiet: true });

// 마이그레이션은 풀러를 거치지 않는 직접 연결이 있으면 그쪽을 쓴다.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  if (process.env.VERCEL) {
    console.error('DATABASE_URL 이 없습니다. Vercel 프로젝트의 Storage 탭에서 Neon 을 연결한 뒤 다시 배포해 주세요.');
    process.exit(1);
  }
  console.log('DATABASE_URL 이 없어 건너뜁니다(로컬 개발은 내장 DB 에 자동 적용됩니다).');
  process.exit(0);
}
await migrate(drizzle(neon(url)), { migrationsFolder: 'drizzle' });
console.log('마이그레이션 적용 완료');
