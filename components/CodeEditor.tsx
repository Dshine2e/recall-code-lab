'use client';

import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { indentUnit } from '@codemirror/language';
import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '@/lib/shared';

function useDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => setDark(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return dark;
}

export default function CodeEditor({ lang, value, onChange }: { lang: Lang; value: string; onChange: (v: string) => void }) {
  const dark = useDark();
  const extensions = useMemo(() => [lang === 'python' ? python() : cpp(), indentUnit.of('    ')], [lang]);
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={dark ? 'dark' : 'light'}
      height="420px"
      basicSetup={{ tabSize: 4 }}
      aria-label="코드 편집기"
    />
  );
}
