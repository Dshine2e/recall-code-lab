import { defineConfig } from 'drizzle-kit';

// 스키마(lib/db/schema.ts)를 바꾼 뒤 `npm run db:generate` 로 drizzle/ 에 마이그레이션 SQL 을 만든다.
export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './drizzle',
});
