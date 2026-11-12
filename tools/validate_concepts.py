#!/usr/bin/env python3
"""개념서(concepts/) 검증 도구 (표준 라이브러리만 사용).

사용법:
  python3 tools/validate_concepts.py                   # 전체 스키마 검사 + 예제 코드 실제 실행
  python3 tools/validate_concepts.py --only SLUG ...    # 지정한 개념만 검사(스키마·실행)
  python3 tools/validate_concepts.py --build-manifest   # concepts/manifest.json 다시 만들기
  python3 tools/validate_concepts.py --schema-only      # 예제 실행 생략
  python3 tools/validate_concepts.py --coverage         # 어떤 개념과도 연결되지 않은 문제 topic 목록

예제(examples)는 완전한 프로그램이어야 한다. Python 은 `python3 -I -X utf8`, C++ 은
`g++ -O2 -std=c++17` 로 실행해 stdin 을 넣고, 적어 둔 output 과 비교한다(줄 끝 공백·끝 빈 줄 무시).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONCEPTS = ROOT / "concepts"
MANIFEST = CONCEPTS / "manifest.json"
PROBLEMS = ROOT / "problems"

CATEGORIES = ["기초 문법", "자료구조", "탐색", "알고리즘", "그래프", "수학", "실전 팁"]
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
LANGS = {"python": "Python", "cpp": "C++"}
ITEM_KEYS = ["name", "signature", "does", "when", "complexity"]
RUN_LIMIT = 10.0
COMPILE_LIMIT = 120.0


def normalize(text: str) -> list[str]:
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return lines


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)
        print(f"  ✗ {msg}")

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)
        print(f"  ! {msg}")


def concept_files() -> list[Path]:
    return sorted(p for p in CONCEPTS.glob("*.json") if p.name != "manifest.json")


def load_concepts(rep: Report) -> list[dict]:
    out = []
    for path in concept_files():
        try:
            c = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            rep.error(f"{path.name}: JSON 을 읽을 수 없습니다 ({exc})")
            continue
        if not isinstance(c, dict):
            rep.error(f"{path.name}: 최상위는 객체여야 합니다")
            continue
        c["_file"] = path.name
        out.append(c)
    return out


def sort_key(c: dict):
    cat = c.get("category")
    return (CATEGORIES.index(cat) if cat in CATEGORIES else 99,
            c.get("order", 999) if isinstance(c.get("order"), int) else 999, str(c.get("slug")))


def manifest_entries(concepts: list[dict]) -> list[dict]:
    return [{"slug": c.get("slug"), "title": c.get("title"), "category": c.get("category"),
             "summary": c.get("summary"), "topics": c.get("topics", [])}
            for c in sorted(concepts, key=sort_key)]


def build_manifest(concepts: list[dict]) -> None:
    CONCEPTS.mkdir(exist_ok=True)
    MANIFEST.write_text(json.dumps({"concepts": manifest_entries(concepts)}, ensure_ascii=False, indent=2) + "\n",
                        encoding="utf-8", newline="\n")


def check_manifest(rep: Report, concepts: list[dict]) -> None:
    try:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except FileNotFoundError:
        rep.error("concepts/manifest.json 이 없습니다 (--build-manifest 로 만드세요)")
        return
    except Exception as exc:  # noqa: BLE001
        rep.error(f"concepts/manifest.json 을 읽을 수 없습니다 ({exc})")
        return
    if data.get("concepts") != manifest_entries(concepts):
        rep.error("concepts/manifest.json 이 개념 파일과 다릅니다 (--build-manifest 로 다시 만드세요)")


def nonempty_str(v) -> bool:
    return isinstance(v, str) and bool(v.strip())


def str_list(rep: Report, where: str, key: str, v, min_len: int = 1) -> None:
    if not isinstance(v, list) or len(v) < min_len or not all(nonempty_str(x) for x in v):
        rep.error(f"{where}: '{key}' 는 비어 있지 않은 문자열 {min_len}개 이상의 배열이어야 합니다")


def check_schema(rep: Report, c: dict) -> None:
    where = f"{c.get('slug', '?')} ({c['_file']})"
    slug = c.get("slug")
    if not (isinstance(slug, str) and SLUG.match(slug)):
        rep.error(f"{where}: slug 는 영문 소문자·숫자·하이픈이어야 합니다")
    elif c["_file"] != f"{slug}.json":
        rep.error(f"{where}: 파일 이름은 {slug}.json 이어야 합니다")
    for key in ("title", "summary"):
        if not nonempty_str(c.get(key)):
            rep.error(f"{where}: '{key}' 는 비어 있지 않은 문자열이어야 합니다")
    if c.get("category") not in CATEGORIES:
        rep.error(f"{where}: category 는 {CATEGORIES} 중 하나여야 합니다 (현재 {c.get('category')!r})")
    if not isinstance(c.get("order"), int) or isinstance(c.get("order"), bool):
        rep.error(f"{where}: order(카테고리 안 순서)는 정수여야 합니다")
    str_list(rep, where, "when", c.get("when"))
    str_list(rep, where, "checklist", c.get("checklist"))
    topics = c.get("topics")
    if not isinstance(topics, list) or not all(nonempty_str(t) for t in topics):
        rep.error(f"{where}: 'topics' 는 문자열 배열이어야 합니다(없으면 빈 배열)")
    dec = c.get("decision")
    if not isinstance(dec, list) or not dec or not all(
            isinstance(d, dict) and nonempty_str(d.get("situation")) and nonempty_str(d.get("use")) for d in dec):
        rep.error(f"{where}: 'decision' 은 {{situation, use}} 1개 이상의 배열이어야 합니다")
    for lang, label in LANGS.items():
        block = c.get(lang)
        if not isinstance(block, dict):
            rep.error(f"{where}: '{lang}' 블록이 없습니다")
            continue
        items = block.get("items")
        if not isinstance(items, list) or not items:
            rep.error(f"{where} [{label}]: items 가 1개 이상 있어야 합니다")
        else:
            for i, it in enumerate(items, 1):
                if not isinstance(it, dict) or not all(nonempty_str(it.get(k)) for k in ITEM_KEYS):
                    rep.error(f"{where} [{label}]: items {i}번에 {ITEM_KEYS} 가 모두 있어야 합니다")
        exs = block.get("examples")
        if not isinstance(exs, list) or not exs:
            rep.error(f"{where} [{label}]: examples 가 1개 이상 있어야 합니다")
        else:
            for i, ex in enumerate(exs, 1):
                if not isinstance(ex, dict) or not nonempty_str(ex.get("title")) or not nonempty_str(ex.get("code")) \
                        or not isinstance(ex.get("output"), str):
                    rep.error(f"{where} [{label}]: examples {i}번은 title/code/output 이 필요합니다")
                elif "stdin" in ex and not isinstance(ex["stdin"], str):
                    rep.error(f"{where} [{label}]: examples {i}번 stdin 은 문자열이어야 합니다")
        pits = block.get("pitfalls")
        if not isinstance(pits, list) or not pits:
            rep.error(f"{where} [{label}]: pitfalls 가 1개 이상 있어야 합니다")
        else:
            for i, pt in enumerate(pits, 1):
                if not isinstance(pt, dict) or not all(nonempty_str(pt.get(k)) for k in ("wrong", "right", "why")):
                    rep.error(f"{where} [{label}]: pitfalls {i}번은 wrong/right/why 가 필요합니다")


class Runner:
    def __init__(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="recall-concepts-"))
        self.gxx = shutil.which("g++")
        self.env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")
        self.n = 0

    def close(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def run(self, lang: str, code: str, stdin: str) -> tuple[str, str | None]:
        """(stdout, 실패사유|None)"""
        self.n += 1
        if lang == "python":
            src = self.tmp / f"ex{self.n}.py"
            src.write_text(code, encoding="utf-8")
            cmd = [sys.executable, "-I", "-X", "utf8", str(src)]
        else:
            if not self.gxx:
                return "", "g++ 를 찾을 수 없습니다"
            src = self.tmp / f"ex{self.n}.cpp"
            src.write_text(code, encoding="utf-8")
            exe = self.tmp / (f"ex{self.n}" + (".exe" if os.name == "nt" else ""))
            try:
                r = subprocess.run([self.gxx, "-O2", "-std=c++17", "-o", str(exe), str(src)],
                                   capture_output=True, text=True, timeout=COMPILE_LIMIT)
            except subprocess.TimeoutExpired:
                return "", "컴파일 시간 초과"
            if r.returncode != 0:
                return "", "컴파일 실패: " + r.stderr.strip()[:1500]
            cmd = [str(exe)]
        try:
            r = subprocess.run(cmd, input=stdin.encode("utf-8"), capture_output=True, timeout=RUN_LIMIT, env=self.env)
        except subprocess.TimeoutExpired:
            return "", f"시간 초과(>{RUN_LIMIT:g}초)"
        out = r.stdout.decode("utf-8", "replace")
        if r.returncode != 0:
            return out, f"종료 코드 {r.returncode}: {r.stderr.decode('utf-8', 'replace').strip()[:800]}"
        return out, None


def short(text: str, n: int = 200) -> str:
    text = text if len(text) <= n else text[:n] + "…"
    return text.replace("\n", "⏎")


def check_examples(rep: Report, runner: Runner, c: dict) -> None:
    slug = c.get("slug", "?")
    for lang, label in LANGS.items():
        exs = (c.get(lang) or {}).get("examples") or []
        ok = 0
        for i, ex in enumerate(exs, 1):
            if not isinstance(ex, dict) or not isinstance(ex.get("code"), str):
                continue
            out, fail = runner.run(lang, ex["code"], ex.get("stdin", ""))
            if fail:
                rep.error(f"{slug} [{label}] 예제 {i} '{ex.get('title')}': {fail}")
            elif normalize(out) != normalize(ex.get("output", "")):
                rep.error(f"{slug} [{label}] 예제 {i} '{ex.get('title')}': 출력이 다릅니다 "
                          f"적힌 값={short(ex.get('output', ''))} 실제={short(out)}")
            else:
                ok += 1
        print(f"  {label:6} 예제 {ok}/{len(exs)} 일치")


def load_problem_topics() -> list[tuple[str, str]]:
    try:
        files = json.loads((PROBLEMS / "manifest.json").read_text(encoding="utf-8")).get("files", [])
    except Exception:  # noqa: BLE001
        return []
    out = []
    for name in files:
        try:
            for p in json.loads((PROBLEMS / name).read_text(encoding="utf-8")):
                out.append((p.get("id"), p.get("topic") or ""))
        except Exception:  # noqa: BLE001
            pass
    return out


def related(topic: str, concept_topics: list[str]) -> bool:
    """사이트와 같은 규칙: 개념의 topics 문자열 중 하나가 문제 topic 안에 들어 있으면 관련 문제다(대소문자 무시)."""
    t = topic.lower()
    return any(ct.lower() in t for ct in concept_topics if isinstance(ct, str) and ct.strip())


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="recall 개념서 검증")
    ap.add_argument("--only", nargs="+", metavar="SLUG")
    ap.add_argument("--build-manifest", action="store_true")
    ap.add_argument("--schema-only", action="store_true")
    ap.add_argument("--coverage", action="store_true", help="개념과 연결되지 않은 문제 topic 출력")
    args = ap.parse_args()

    rep = Report()
    print("== 스키마 검사")
    concepts = load_concepts(rep)
    if args.build_manifest:
        build_manifest(concepts)
        print(f"concepts/manifest.json 갱신: {len(concepts)}개")
    check_manifest(rep, concepts)
    seen: dict[str, str] = {}
    for c in concepts:
        s = c.get("slug")
        if s in seen:
            rep.error(f"slug 중복: {s} ({seen[s]}, {c['_file']})")
        elif isinstance(s, str):
            seen[s] = c["_file"]
    targets = concepts
    if args.only:
        for s in args.only:
            if s not in seen:
                rep.error(f"--only: '{s}' 개념을 찾을 수 없습니다")
        targets = [c for c in concepts if c.get("slug") in args.only]
    for c in targets:
        check_schema(rep, c)

    problems = load_problem_topics()
    for c in targets:
        for t in c.get("topics") or []:
            if isinstance(t, str) and not any(related(pt, [t]) for _, pt in problems):
                rep.warn(f"{c.get('slug')}: topics '{t}' 와 이어지는 문제가 아직 없습니다")
    print(f"  개념 {len(concepts)}개")

    if args.coverage:
        print("== 개념과 연결되지 않은 문제")
        missing = [(pid, t) for pid, t in problems
                   if not any(related(t, c.get("topics") or []) for c in concepts)]
        for pid, t in missing:
            print(f"  {pid}: {t}")
        print(f"  {len(missing)}개")

    if not args.schema_only:
        runner = Runner()
        try:
            for c in targets:
                print(f"== {c.get('slug')}  {c.get('title')}")
                check_examples(rep, runner, c)
        finally:
            runner.close()

    print()
    if rep.errors:
        print(f"실패: 오류 {len(rep.errors)}개, 경고 {len(rep.warnings)}개")
        return 1
    print(f"통과: 오류 0개, 경고 {len(rep.warnings)}개")
    return 0


if __name__ == "__main__":
    sys.exit(main())
