import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export type Db = NeonHttpDatabase<typeof schema>;

const g = globalThis as unknown as { __recallDb?: Promise<Db> };

async function open(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) return drizzle(neon(url), { schema });
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL 환경변수가 없습니다. Vercel 프로젝트에 Neon(Postgres)을 연결해 주세요.');
  }
  // 로컬 개발: DATABASE_URL 이 없으면 .data/ 폴더의 내장 Postgres(PGlite)를 쓰고, 마이그레이션도 바로 적용한다.
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle: pgliteDrizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const { mkdirSync } = await import('node:fs');
  const dir = process.env.PGLITE_DIR || '.data/pglite';
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  const db = pgliteDrizzle(client, { schema });
  await migrate(db, { migrationsFolder: 'drizzle' });
  return db as unknown as Db;
}

/** DB 연결. 서버에서만 쓴다. */
export function getDb(): Promise<Db> {
  g.__recallDb ??= open().catch((err) => {
    g.__recallDb = undefined;
    throw err;
  });
  return g.__recallDb;
}

export { schema };
