import type { NextConfig } from 'next';

const config: NextConfig = {
  // 문제·개념서 JSON 은 실행 중에 파일로 읽는다. Vercel 서버 함수에도 함께 실리도록 알려 준다.
  outputFileTracingIncludes: {
    '/**': ['./problems/*.json', './concepts/*.json'],
  },
  agentRules: false,
  // 로컬 개발용 DB(PGlite)는 번들에 넣지 않는다.
  serverExternalPackages: ['@electric-sql/pglite'],
};

export default config;
