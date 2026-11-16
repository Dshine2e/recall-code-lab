import { boolean, date, index, integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const progressStatus = pgEnum('progress_status', ['untried', 'attempted', 'solved', 'retry']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  // 소문자로 저장한다(대소문자만 다른 아이디를 막는다).
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const progress = pgTable(
  'progress',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    // 문제의 고정 ID(daily-2026-11-13-1, seed-006, bfs …). 파일 이름과 무관하다.
    problemId: text('problem_id').notNull(),
    status: progressStatus('status').notNull().default('untried'),
    solvedOn: date('solved_on'),
    minutesSpent: integer('minutes_spent'),
    memo: text('memo').notNull().default(''),
    codePython: text('code_python'),
    codeCpp: text('code_cpp'),
    hintLevel: integer('hint_level').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.problemId] }), index('progress_user_updated').on(t.userId, t.updatedAt)],
);

export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: text('username').notNull(),
    ip: text('ip').notNull(),
    success: boolean('success').notNull(),
    attemptedAt: timestamp('attempted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('login_attempts_username').on(t.username, t.attemptedAt), index('login_attempts_ip').on(t.ip, t.attemptedAt)],
);

export type ProgressRow = typeof progress.$inferSelect;
export type Status = (typeof progressStatus.enumValues)[number];
