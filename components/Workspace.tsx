'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearHint, openHint, reportResult, saveCode, saveRecord, type ActionResult } from '@/lib/actions/progress';
import { LANGS, runCustom, runTests, type TestResult } from '@/lib/runner';
import { EMPTY_RECORD, STATUSES, STATUS_LABEL, parseDescription, paragraphs, topicVisible, type Lang, type Problem, type RecordView, type Status } from '@/lib/shared';
import { usePref } from '@/lib/use-pref';
import { StatusBadge } from './StatusBadge';

const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false, loading: () => <div className="h-[420px] animate-pulse bg-sunken" /> });

const TOPIC_META_KEYS = ['알고리즘 주제', '핵심 문법'];
const HINT_TITLES = ['1단계 · 어떤 도구를 쓸까', '2단계 · 핵심 아이디어', '3단계 · 놓치기 쉬운 점'];
const HINT_CONFIRM = "힌트를 보면 이 문제는 '다시 풀기'로 분류돼요. 계속할까요?";


const VERDICT: Record<string, { text: string; cls: string }> = {
  pass: { text: '통과', cls: 'bg-ok-soft text-ok' },
  fail: { text: '오답', cls: 'bg-bad-soft text-bad' },
  error: { text: '실행 오류', cls: 'bg-bad-soft text-bad' },
  compile: { text: '컴파일 오류', cls: 'bg-bad-soft text-bad' },
  timeout: { text: '시간 초과', cls: 'bg-warn-soft text-warn' },
  service: { text: '실행 서버 오류', cls: 'bg-warn-soft text-warn' },
  skipped: { text: '건너뜀', cls: 'bg-sunken text-muted' },
  pending: { text: '대기', cls: 'bg-sunken text-muted' },
  waiting: { text: '순서 대기', cls: 'bg-sunken text-muted' },
  running: { text: '실행 중', cls: 'bg-accent-soft text-accent' },
};

const fmtMs = (ms: number | null) => (ms == null ? '' : ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}초`);
const clip = (s: string, max = 4000) => (s.length > max ? `${s.slice(0, max)}\n…(${(s.length - max).toLocaleString()}자 생략)` : s);
const draftKey = (id: string, lang: Lang) => `recall-draft:${id}:${lang}`;

function readDraft(id: string, lang: Lang): string | null {
  try { return localStorage.getItem(draftKey(id, lang)); } catch { return null; }
}

function Statement({ problem, showTopic }: { problem: Problem; showTopic: boolean }) {
  const d = useMemo(() => parseDescription(problem.description), [problem.description]);
  let meta = d.meta.length
    ? d.meta
    : [
        { key: '유형', value: problem.category },
        { key: '알고리즘 주제', value: problem.topic },
        { key: '핵심 문법', value: problem.syntax },
        { key: '난이도', value: problem.difficulty },
        { key: '예상 풀이 시간', value: `${problem.minutes}분` },
      ];
  if (!showTopic) {
    let placed = false;
    meta = meta.flatMap((m) => {
      if (!TOPIC_META_KEYS.includes(m.key)) return [m];
      if (placed) return [];
      placed = true;
      return [{ key: '알고리즘 주제', value: '숨김' }];
    });
  }
  const para = (text: string) => paragraphs(text).map((t, i) => <p key={i} className="whitespace-pre-line leading-relaxed">{t}</p>);
  const example = problem.tests[0];
  return (
    <div className="space-y-4 text-[15px]">
      <div className="flex flex-wrap gap-1.5" id="meta-chips">
        {meta.map((m) => (
          <span key={m.key} className="chip"><b className="font-semibold text-ink">{m.key}</b>{m.value}</span>
        ))}
      </div>
      <div className="space-y-3">{para(d.body)}</div>
      {d.sections.map((s) => {
        const lines = s.text.split('\n').filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*[-•]\s+/.test(l));
        return (
          <section key={s.title}>
            <h2 className="mb-1.5 text-sm font-bold">{s.title}</h2>
            {isList ? (
              <ul className="list-disc space-y-1 pl-5 leading-relaxed">{lines.map((l, i) => <li key={i}>{l.replace(/^\s*[-•]\s+/, '')}</li>)}</ul>
            ) : (
              <div className="space-y-2">{para(s.text)}</div>
            )}
          </section>
        );
      })}
      {example && (
        <section>
          <h2 className="mb-1.5 text-sm font-bold">예제</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div><div className="label">예제 입력</div><pre className="code-block">{example.input}</pre></div>
            <div><div className="label">예제 출력</div><pre className="code-block">{example.output}</pre></div>
          </div>
          <p className="mt-2 text-xs text-muted">테스트 {problem.tests.length}개로 확인해요. 첫 번째 테스트가 위 예제예요.</p>
        </section>
      )}
    </div>
  );
}

export function Workspace({ problem, initialRecord, loggedIn, concepts }: { problem: Problem; initialRecord: RecordView | null; loggedIn: boolean; concepts: { slug: string; title: string }[] }) {
  const [record, setRecord] = useState<RecordView>(initialRecord ?? EMPTY_RECORD);
  const [lang, setLang] = usePref<Lang>('recall-lang', 'python');
  const [showTopics] = usePref<'on' | 'off'>('recall-show-topics', 'off');
  const [code, setCode] = useState<Record<Lang, string>>({
    python: initialRecord?.codePython ?? problem.python,
    cpp: initialRecord?.codeCpp ?? problem.cpp,
  });
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // 로그인하지 않은 경우: 이 브라우저에 적어 둔 초안을 불러온다.
  useEffect(() => {
    if (loggedIn) return;
    const py = readDraft(problem.id, 'python');
    const cp = readDraft(problem.id, 'cpp');
    if (py != null || cp != null) setCode((c) => ({ python: py ?? c.python, cpp: cp ?? c.cpp }));
  }, [loggedIn, problem.id]);

  const apply = useCallback((res: ActionResult): boolean => {
    if (res.ok) {
      setRecord(res.record);
      setError('');
      return true;
    }
    setError(res.error);
    return false;
  }, []);

  // ---- 코드 자동 저장(로그인: 서버 / 비로그인: 이 브라우저)
  const timers = useRef<Partial<Record<Lang, ReturnType<typeof setTimeout>>>>({});
  const pending = useRef<Partial<Record<Lang, string>>>({});
  const flush = useCallback(async (l: Lang) => {
    const value = pending.current[l];
    if (value === undefined) return;
    delete pending.current[l];
    clearTimeout(timers.current[l]);
    if (!loggedIn) {
      try { localStorage.setItem(draftKey(problem.id, l), value); } catch { /* 무시 */ }
      return;
    }
    setSaveState('saving');
    try {
      const res = await saveCode({ problemId: problem.id, lang: l, code: value });
      setSaveState(res.ok ? 'saved' : 'error');
      if (res.ok) setRecord((r) => ({ ...r, codePython: res.record.codePython, codeCpp: res.record.codeCpp, updatedAt: res.record.updatedAt }));
    } catch {
      setSaveState('error');
    }
  }, [loggedIn, problem.id]);

  const onCode = useCallback((value: string) => {
    setCode((c) => ({ ...c, [lang]: value }));
    pending.current[lang] = value;
    clearTimeout(timers.current[lang]);
    timers.current[lang] = setTimeout(() => void flush(lang), loggedIn ? 1500 : 400);
  }, [lang, flush, loggedIn]);

  useEffect(() => {
    const onHide = () => { void flush('python'); void flush('cpp'); };
    window.addEventListener('pagehide', onHide);
    return () => { window.removeEventListener('pagehide', onHide); onHide(); };
  }, [flush]);

  // ---- 실행·채점
  const [busy, setBusy] = useState<'' | 'tests' | 'custom'>('');
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [compileError, setCompileError] = useState('');
  const [summary, setSummary] = useState('');
  const [stdin, setStdin] = useState(problem.tests[0]?.input ?? '');
  const [custom, setCustom] = useState<{ text: string; kind: 'ok' | 'bad' | 'info' } | null>(null);

  async function grade() {
    setBusy('tests');
    setSummary('');
    setNotice('');
    setCompileError('');
    await flush(lang);
    try {
      const out = await runTests(lang, code[lang], problem.tests, (rs, ce) => { setResults(rs); setCompileError(ce); });
      setResults(out.results);
      setCompileError(out.compileError);
      if (out.serviceErrors > 0) {
        setSummary(`실행 서버 문제로 ${out.serviceErrors}개를 확인하지 못했어요. 잠시 뒤 다시 채점해 주세요.`);
        return;
      }
      const allPassed = out.passed === out.total;
      setSummary(allPassed ? `${out.total}개 모두 통과했어요.` : `${out.total}개 중 ${out.passed}개 통과했어요.`);
      if (loggedIn) {
        const res = await reportResult({ problemId: problem.id, allPassed });
        if (apply(res) && res.ok && allPassed) {
          setNotice(res.record.status === 'retry' ? "힌트를 사용해서 '다시 풀기'로 분류했어요. 나중에 힌트 없이 다시 풀어 보세요." : "'해결'로 기록했어요.");
        }
      } else if (allPassed) {
        setNotice('로그인하면 풀이 기록이 저장돼요.');
      }
    } finally {
      setBusy('');
    }
  }

  async function runOnce() {
    setBusy('custom');
    setCustom({ text: '실행 중…', kind: 'info' });
    try {
      const r = await runCustom(lang, code[lang], stdin, { onWait: (sec) => setCustom({ text: `요청 순서를 기다리는 중… (${sec}초)`, kind: 'info' }) });
      if (r.kind === 'service') setCustom({ text: `실행 서버 오류: ${r.message}`, kind: 'bad' });
      else if (r.kind === 'timeout') setCustom({ text: '시간 초과(25초 안에 끝나지 않았어요)', kind: 'bad' });
      else if (r.type === 'compile') setCustom({ text: clip(r.compileError), kind: 'bad' });
      else if (r.type === 'error') setCustom({ text: clip(`${r.stdout}${r.stdout && !r.stdout.endsWith('\n') ? '\n' : ''}${r.stderr}\n[${r.exitInfo}]`), kind: 'bad' });
      else setCustom({ text: clip(r.stdout || '(출력 없음)') + (r.stderr ? `\n[표준 오류]\n${clip(r.stderr)}` : ''), kind: 'ok' });
    } finally {
      setBusy('');
    }
  }

  // ---- 힌트
  const [localHint, setLocalHint] = useState(0);
  const hintLevel = loggedIn ? record.hintLevel : localHint;
  const [confirming, setConfirming] = useState(false);
  // 해결한 문제는 힌트를 모두 볼 수 있다(기록에는 영향을 주지 않는다).
  const [peek, setPeek] = useState(0);
  const shownHints = Math.max(hintLevel, peek);
  const nextLevel = shownHints + 1;
  const hasMore = nextLevel <= problem.hints.length;

  async function revealNext() {
    setConfirming(false);
    if (!loggedIn) { setLocalHint(nextLevel); return; }
    if (record.status === 'solved') { setPeek(nextLevel); return; }
    apply(await openHint({ problemId: problem.id, level: nextLevel }));
  }
  function askHint() {
    if (loggedIn && record.status !== 'solved' && record.hintLevel === 0) setConfirming(true);
    else void revealNext();
  }

  // ---- 기록 양식
  const [form, setForm] = useState({ status: record.status, solvedOn: record.solvedOn ?? '', minutes: record.minutesSpent?.toString() ?? '', memo: record.memo });
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordMsg, setRecordMsg] = useState('');
  // 서버에서 상태가 바뀌면(채점·힌트) 양식에도 반영한다.
  useEffect(() => {
    setForm((f) => ({ ...f, status: record.status, solvedOn: record.solvedOn ?? '' }));
  }, [record.status, record.solvedOn]);

  async function submitRecord(e: React.FormEvent) {
    e.preventDefault();
    setSavingRecord(true);
    setRecordMsg('');
    const minutes = form.minutes.trim() === '' ? null : Number(form.minutes);
    if (minutes !== null && (!Number.isInteger(minutes) || minutes < 0)) {
      setRecordMsg('걸린 시간은 0 이상의 정수(분)로 적어 주세요.');
      setSavingRecord(false);
      return;
    }
    try {
      const ok = apply(await saveRecord({ problemId: problem.id, status: form.status, solvedOn: form.solvedOn || null, minutesSpent: minutes, memo: form.memo }));
      setRecordMsg(ok ? '저장했어요.' : '');
    } finally {
      setSavingRecord(false);
    }
  }

  const showTopic = topicVisible(showTopics === 'on', { status: record.status, hintLevel: shownHints });
  const showConcepts = concepts.length > 0 && (shownHints > 0 || record.status === 'solved');
  const loginHref = `/login?next=${encodeURIComponent(`/problems/${problem.id}`)}`;

  return (
    <div className="mt-3">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{problem.title}</h1>
        {loggedIn && <span id="current-status"><StatusBadge status={record.status} /></span>}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="card p-5"><Statement problem={problem} showTopic={showTopic} /></div>

          {problem.hints.length > 0 && (
            <div className="card p-5" id="hints">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold">힌트 <span className="font-normal text-muted">{shownHints}/{problem.hints.length}</span></h2>
                {hasMore && !confirming && <button id="hint-next" type="button" className="btn btn-sm" onClick={askHint}>힌트 {nextLevel}단계 보기</button>}
              </div>
              {confirming && (
                <div id="hint-confirm" className="mt-3 rounded-lg bg-warn-soft p-3 text-sm text-warn">
                  <p id="hint-confirm-text">{HINT_CONFIRM}</p>
                  <div className="mt-2 flex gap-2">
                    <button id="hint-yes" type="button" className="btn btn-sm btn-primary" onClick={() => void revealNext()}>힌트 보기</button>
                    <button id="hint-no" type="button" className="btn btn-sm" onClick={() => setConfirming(false)}>취소</button>
                  </div>
                </div>
              )}
              {shownHints === 0 && !confirming && <p className="mt-2 text-sm text-muted">막히면 한 단계씩 열어 보세요. 정답 코드는 나오지 않아요.</p>}
              <ol className="mt-3 space-y-3">
                {problem.hints.slice(0, shownHints).map((h, i) => (
                  <li key={i} className="hint-item rounded-lg bg-sunken p-3 text-sm leading-relaxed">
                    <div className="mb-1 text-xs font-semibold text-muted">{HINT_TITLES[i] ?? `${i + 1}단계`}</div>
                    {h}
                  </li>
                ))}
              </ol>
              {loggedIn && record.hintLevel > 0 && record.status === 'retry' && (
                <button id="hint-clear" type="button" className="btn btn-sm mt-3" onClick={async () => { if (apply(await clearHint({ problemId: problem.id }))) setNotice("'해결'로 기록했어요."); }}>
                  힌트 없이 다시 풀었어요
                </button>
              )}
              {showConcepts && (
                <div id="related-concepts" className="mt-4 border-t border-line pt-3">
                  <div className="label">관련 개념</div>
                  <div className="flex flex-wrap gap-1.5">
                    {concepts.map((c) => <Link key={c.slug} href={`/concepts/${c.slug}`} className="concept-chip chip chip-on">{c.title}</Link>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
              <div className="flex gap-1" role="tablist" aria-label="언어">
                {(['python', 'cpp'] as Lang[]).map((l) => (
                  <button key={l} type="button" role="tab" data-lang={l} aria-selected={lang === l} className={`chip ${lang === l ? 'chip-on' : ''}`} onClick={() => setLang(l)}>{LANGS[l].label}</button>
                ))}
              </div>
              <span className="text-xs text-muted">{LANGS[lang].info}</span>
              <span className="ml-auto text-xs text-muted" id="save-state">
                {loggedIn ? { idle: '', saving: '저장 중…', saved: '코드 저장됨', error: '코드 저장 실패' }[saveState] : '이 브라우저에만 임시 저장'}
              </span>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => { if (window.confirm('처음 코드로 되돌릴까요? 지금 코드는 사라져요.')) onCode(lang === 'python' ? problem.python : problem.cpp); }}>처음 코드로</button>
            </div>
            <CodeEditor key={lang} lang={lang} value={code[lang]} onChange={onCode} />
            <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2">
              <button id="run-tests" type="button" className="btn btn-primary" disabled={busy !== ''} onClick={() => void grade()}>{busy === 'tests' ? '채점 중…' : '채점하기'}</button>
              <button id="run-custom" type="button" className="btn" disabled={busy !== ''} onClick={() => void runOnce()}>{busy === 'custom' ? '실행 중…' : '직접 입력으로 실행'}</button>
              <span className="text-xs text-muted">코드는 Wandbox 에서 실행돼요.</span>
            </div>
          </div>

          {(summary || notice || error) && (
            <div className="space-y-2 text-sm" aria-live="polite">
              {summary && <p id="summary" className="font-semibold">{summary}</p>}
              {notice && <p id="notice" className="rounded-lg bg-accent-soft px-3 py-2 text-accent">{notice}</p>}
              {error && <p id="action-error" className="rounded-lg bg-bad-soft px-3 py-2 text-bad">{error}</p>}
            </div>
          )}

          {compileError && <pre className="code-block text-bad" id="compile-error">{clip(compileError)}</pre>}

          {results && (
            <ul className="card divide-y divide-line" id="results">
              {results.map((r, i) => {
                const v = VERDICT[r.verdict] ?? VERDICT.pending;
                const t = problem.tests[i];
                const detail = ['fail', 'error', 'timeout', 'service'].includes(r.verdict);
                return (
                  <li key={i} className="px-3 py-2 text-sm" data-verdict={r.verdict}>
                    <details>
                      <summary className={`flex items-center gap-2 ${detail ? 'cursor-pointer' : 'pointer-events-none list-none'}`}>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.cls}`}>{r.verdict === 'waiting' && r.waitSec ? `순서 대기 ${r.waitSec}초` : v.text}</span>
                        <span className="min-w-0 flex-1 truncate">{r.label}</span>
                        <span className="text-xs text-muted">{fmtMs(r.ms)}</span>
                      </summary>
                      {detail && (
                        <div className="mt-2 space-y-2">
                          {r.message && <p className="text-xs text-warn">{r.message}</p>}
                          {r.exitInfo && <p className="text-xs text-bad">{r.exitInfo}</p>}
                          <div><div className="label">입력</div><pre className="code-block max-h-40">{clip(t.input, 1500)}</pre></div>
                          {r.verdict === 'fail' && <div><div className="label">기대 출력</div><pre className="code-block max-h-40">{clip(t.output, 1500)}</pre></div>}
                          {(r.stdout || r.verdict === 'fail') && <div><div className="label">내 출력</div><pre className="code-block max-h-40">{clip(r.stdout || '(출력 없음)', 1500)}</pre></div>}
                          {r.stderr && <div><div className="label">표준 오류</div><pre className="code-block max-h-40">{clip(r.stderr, 1500)}</pre></div>}
                        </div>
                      )}
                    </details>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="card p-4">
            <label className="label" htmlFor="custom-stdin">직접 입력(표준 입력)</label>
            <textarea id="custom-stdin" className="input h-24 font-mono text-[13px]" spellCheck={false} value={stdin} onChange={(e) => setStdin(e.target.value)} />
            {custom && <pre id="custom-output" className={`code-block mt-2 max-h-60 ${custom.kind === 'bad' ? 'text-bad' : custom.kind === 'info' ? 'text-muted' : ''}`}>{custom.text}</pre>}
          </div>

          <div className="card p-4" id="record">
            <h2 className="mb-3 text-sm font-bold">내 풀이 기록</h2>
            {loggedIn ? (
              <form className="space-y-3" onSubmit={submitRecord}>
                <div>
                  <span className="label">상태</span>
                  <div className="flex flex-wrap gap-1.5" id="status-switch" role="group" aria-label="상태">
                    {STATUSES.map((s: Status) => (
                      <button key={s} type="button" data-status={s} aria-pressed={form.status === s} className={`chip ${form.status === s ? 'chip-on' : ''}`} onClick={() => setForm((f) => ({ ...f, status: s }))}>{STATUS_LABEL[s]}</button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="solved-on">해결 날짜</label>
                    <input id="solved-on" type="date" className="input" value={form.solvedOn} onChange={(e) => setForm((f) => ({ ...f, solvedOn: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label" htmlFor="minutes">걸린 시간(분, 선택)</label>
                    <input id="minutes" type="number" min={0} step={1} inputMode="numeric" className="input" placeholder={`예상 ${problem.minutes}분`} value={form.minutes} onChange={(e) => setForm((f) => ({ ...f, minutes: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="memo">메모</label>
                  <textarea id="memo" className="input h-24" maxLength={5000} placeholder="막힌 지점, 다음에 볼 것" value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3">
                  <button id="save-record" type="submit" className="btn btn-primary" disabled={savingRecord}>{savingRecord ? '저장 중…' : '기록 저장'}</button>
                  <span className="text-xs text-muted" id="record-msg" aria-live="polite">{recordMsg}</span>
                </div>
                <p className="text-xs text-muted">코드는 입력하는 대로 자동 저장돼요. 채점을 모두 통과하면 상태가 자동으로 바뀌어요.</p>
              </form>
            ) : (
              <p className="text-sm text-muted">
                <Link href={loginHref} className="text-accent underline">로그인</Link>하면 상태, 해결 날짜, 걸린 시간, 메모, 내 코드를 저장하고 다른 기기에서도 볼 수 있어요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
