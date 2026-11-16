// lib/runner.js 의 타입(구현은 기존 사이트에서 그대로 옮겨 온 JS)
import type { Lang, TestCase } from './shared';

export const LANGS: Record<Lang, { label: string; compiler: string; options: string; info: string }>;

export interface TestResult {
  label: string;
  verdict: 'pass' | 'fail' | 'error' | 'compile' | 'timeout' | 'service' | 'skipped' | 'pending' | 'waiting' | 'running';
  ms: number | null;
  stdout: string;
  stderr: string;
  message?: string;
  exitInfo?: string;
  waitSec?: number;
}

export function runTests(
  lang: Lang,
  code: string,
  tests: TestCase[],
  onUpdate?: (results: TestResult[], compileError: string) => void,
): Promise<{ lang: Lang; passed: number; total: number; serviceErrors: number; compileError: string; results: TestResult[] }>;

export type CustomResult =
  | { kind: 'service'; message: string }
  | { kind: 'timeout'; ms: number }
  | { kind: 'ok'; ms: number; type: 'compile'; compileError: string; stdout: string; stderr: string }
  | { kind: 'ok'; ms: number; type: 'error'; stdout: string; stderr: string; exitInfo: string }
  | { kind: 'ok'; ms: number; type: 'ok'; stdout: string; stderr: string };

export function runCustom(lang: Lang, code: string, stdin: string, hooks?: { onWait?: (sec: number) => void; onSend?: () => void }): Promise<CustomResult>;
export function sameOutput(expected: string, actual: string): boolean;
