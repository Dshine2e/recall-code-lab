#!/usr/bin/env python3
"""recall 문제 데이터 검증 도구 (표준 라이브러리만 사용).

사용법:
  python3 tools/validate.py                         # 전체 스키마 검사 + 있는 정답 코드 실행
  python3 tools/validate.py --only ID [ID ...]      # 지정한 문제만 검사
  python3 tools/validate.py --require-solutions     # .solutions/<id>.py 와 .cpp 가 모두 있어야 통과
  python3 tools/validate.py --build-manifest        # problems/manifest.json 다시 만들기

--only 를 주면 문제 단위 검사(필드, 힌트, 정답 실행)는 그 문제들에만 한다.
파일 단위 검사(manifest, id 중복, 하루 3문제 규칙)는 항상 전체에 한다.

채점 규칙(사이트와 동일): 각 줄 오른쪽 공백을 지우고, 끝의 빈 줄을 무시한 뒤 비교한다.
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
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS = ROOT / "problems"
SOLUTIONS = ROOT / ".solutions"
MANIFEST = PROBLEMS / "manifest.json"

PY_TIME_LIMIT = 5.0
CPP_TIME_LIMIT = 2.0
GEN_TIME_LIMIT = 30.0
COMPILE_TIME_LIMIT = 120.0

REQUIRED = ["id", "title", "category", "topic", "syntax", "difficulty", "minutes",
            "addedOn", "description", "tests", "python", "cpp", "hints"]
DIFFICULTIES = ["입문", "기본", "도전"]
CATEGORIES = ["기초 문법", "알고리즘", "백준형", "기본기"]
CATEGORY_OF = {"입문": "기초 문법", "기본": "알고리즘", "도전": "백준형"}
BASE_IDS = ["bfs", "dfs", "hash", "heap", "deque", "sort", "string", "index"]
DATE_FILE = re.compile(r"^(\d{4}-\d{2}-\d{2})\.json$")
DAILY_ID = re.compile(r"^daily-(\d{4}-\d{2}-\d{2})-([1-3])$")
SEED_FILE = re.compile(r"^seed-(\d{2})\.json$")
SEED_ID = re.compile(r"^seed-(\d{3})$")
ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SEED_PER_FILE = (3, 8)

# 힌트: 정확히 3개, 각 600자 이하, 코드 흔적 금지
HINT_COUNT = 3
HINT_MAX = 600
HINT_MIN = 40
CODE_TRACES = [
    ("```", "코드 블록"), ("def ", "def "), ("#include", "#include"), ("for (", "for ("), ("for(", "for("),
    ("while (", "while ("), ("while(", "while("), ("if (", "if ("), ("cout <<", "cout <<"), ("cin >>", "cin >>"),
    ("import ", "import "), ("lambda ", "lambda "), ("in range(", "in range("), ("return ", "return "),
    ("int main", "int main"), ("std::", "std::"), ("print(", "print("), ("->", "->"),
]

# 이전 사이트에서 옮겨 온 문제. 옛 형식(라벨, 난이도 배치)을 그대로 두기 위해 엄격 규칙에서 뺀다.
LEGACY_IDS = set(BASE_IDS) | {
    "daily-2026-11-10-1", "daily-2026-11-10-2", "daily-2026-11-10-3",
    "daily-2026-11-11-1", "daily-2026-11-11-2", "daily-2026-11-11-3",
}

# 새 문제(엄격 규칙)용 기준
TEST_COUNT = {"입문": (4, 5), "기본": (4, 5), "도전": (5, 6)}
MINUTES = {"입문": (10, 15), "기본": (20, 30), "도전": (40, 60)}
LABEL_PREFIXES = ("기본:", "경계:", "반례:")
DESC_HEADERS = ["[유형]", "[알고리즘 주제]", "[핵심 문법]", "[난이도]", "[예상 풀이 시간]",
                "[제약]", "[입력 형식]", "[출력 형식]"]
PY_TEMPLATE = "# 표준 입력을 읽고 결과를 출력하세요.\n"
CPP_TEMPLATE = ("#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n"
                "    // 표준 입력을 읽고 결과를 출력하세요.\n    return 0;\n}\n")


def normalize(text: str) -> list[str]:
    """채점 규칙: 줄별 오른쪽 공백 제거 + 끝의 빈 줄 무시."""
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return lines


def same_output(expected: str, actual: str) -> bool:
    return normalize(expected) == normalize(actual)


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


# ---------------------------------------------------------------- 데이터 읽기

def problem_files() -> list[Path]:
    """manifest 순서: 날짜 파일(최신 먼저) → seed 파일(번호 순) → base.json"""
    dated = sorted((p for p in PROBLEMS.glob("*.json") if DATE_FILE.match(p.name)),
                   key=lambda p: p.name, reverse=True)
    seeds = sorted((p for p in PROBLEMS.glob("*.json") if SEED_FILE.match(p.name)), key=lambda p: p.name)
    base = PROBLEMS / "base.json"
    return dated + seeds + ([base] if base.exists() else [])


def build_manifest() -> list[str]:
    files = [p.name for p in problem_files()]
    MANIFEST.write_text(json.dumps({"files": files}, ensure_ascii=False, indent=2) + "\n",
                        encoding="utf-8", newline="\n")
    return files


def load_all(rep: Report) -> list[tuple[Path, dict]]:
    out: list[tuple[Path, dict]] = []
    for path in problem_files():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            rep.error(f"{path.name}: JSON을 읽을 수 없습니다 ({exc})")
            continue
        if not isinstance(data, list):
            rep.error(f"{path.name}: 최상위는 문제 배열이어야 합니다")
            continue
        for item in data:
            out.append((path, item))
    return out


# ---------------------------------------------------------------- 스키마 검사

def check_manifest(rep: Report) -> None:
    expected = [p.name for p in problem_files()]
    try:
        files = json.loads(MANIFEST.read_text(encoding="utf-8")).get("files")
    except FileNotFoundError:
        rep.error("problems/manifest.json 이 없습니다 (--build-manifest 로 만드세요)")
        return
    except Exception as exc:  # noqa: BLE001
        rep.error(f"manifest.json 을 읽을 수 없습니다 ({exc})")
        return
    if files != expected:
        rep.error(f"manifest.json 이 실제 파일과 다릅니다. 기대: {expected}, 실제: {files} "
                  "(--build-manifest 로 다시 만드세요)")


def check_file_level(rep: Report, items: list[tuple[Path, dict]]) -> None:
    by_file: dict[str, list[dict]] = {}
    for path, p in items:
        by_file.setdefault(path.name, []).append(p)
    for name, plist in by_file.items():
        sm = SEED_FILE.match(name)
        if sm:
            lo, hi = SEED_PER_FILE
            if not lo <= len(plist) <= hi:
                rep.error(f"{name}: seed 파일에는 문제 {lo}~{hi}개를 넣습니다 (현재 {len(plist)}개)")
            ranks = [DIFFICULTIES.index(p.get("difficulty")) if p.get("difficulty") in DIFFICULTIES else -1
                     for p in plist]
            if ranks != sorted(ranks):
                rep.error(f"{name}: 문제 순서는 입문→기본→도전 이어야 합니다")
            continue
        m = DATE_FILE.match(name)
        if not m:
            continue
        if len(plist) != 3:
            rep.error(f"{name}: 하루 문제는 3개여야 합니다 (현재 {len(plist)}개)")
        ranks = [DIFFICULTIES.index(p.get("difficulty")) if p.get("difficulty") in DIFFICULTIES else -1
                 for p in plist]
        if ranks != sorted(ranks):
            rep.error(f"{name}: 문제 순서는 입문→기본→도전 이어야 합니다")
        for i, p in enumerate(plist, 1):
            want = f"daily-{m.group(1)}-{i}"
            if p.get("id") != want:
                rep.error(f"{name}: {i}번째 문제 id는 {want} 이어야 합니다 (현재 {p.get('id')})")


def check_hints(rep: Report, where: str, hints) -> None:
    if not isinstance(hints, list) or len(hints) != HINT_COUNT:
        rep.error(f"{where}: hints 는 문자열 {HINT_COUNT}개 배열이어야 합니다")
        return
    for i, h in enumerate(hints, 1):
        if not isinstance(h, str) or not h.strip():
            rep.error(f"{where}: {i}번 힌트가 비어 있습니다")
            continue
        if len(h) > HINT_MAX:
            rep.error(f"{where}: {i}번 힌트가 {HINT_MAX}자를 넘습니다 ({len(h)}자)")
        if len(h.strip()) < HINT_MIN:
            rep.error(f"{where}: {i}번 힌트가 너무 짧습니다 ({len(h.strip())}자, {HINT_MIN}자 이상)")
        found = [label for token, label in CODE_TRACES if token in h]
        if found:
            rep.error(f"{where}: {i}번 힌트에 코드 흔적이 있습니다: {found}")


def check_problem(rep: Report, path: Path, p: dict) -> None:
    if not isinstance(p, dict):
        rep.error(f"{path.name}: 문제 항목이 객체가 아닙니다")
        return
    pid = p.get("id", "?")
    where = f"{pid} ({path.name})"
    for key in REQUIRED:
        if key not in p:
            rep.error(f"{where}: 필수 필드 '{key}' 가 없습니다")
    for key in ["id", "title", "category", "topic", "syntax", "difficulty", "description", "python", "cpp"]:
        if key in p and (not isinstance(p[key], str) or (key not in ("python", "cpp") and not p[key].strip())):
            rep.error(f"{where}: '{key}' 는 비어 있지 않은 문자열이어야 합니다")
    if p.get("difficulty") not in DIFFICULTIES:
        rep.error(f"{where}: difficulty 는 {DIFFICULTIES} 중 하나여야 합니다 (현재 {p.get('difficulty')!r})")
    if p.get("category") not in CATEGORIES:
        rep.error(f"{where}: category 는 {CATEGORIES} 중 하나여야 합니다 (현재 {p.get('category')!r})")
    if not isinstance(p.get("minutes"), int) or isinstance(p.get("minutes"), bool) or p.get("minutes", 0) <= 0:
        rep.error(f"{where}: minutes 는 양의 정수여야 합니다")

    check_hints(rep, where, p.get("hints"))

    tests = p.get("tests")
    if not isinstance(tests, list) or len(tests) < 3:
        rep.error(f"{where}: 테스트는 3개 이상이어야 합니다")
        tests = tests if isinstance(tests, list) else []
    for i, t in enumerate(tests, 1):
        if not isinstance(t, dict) or not all(isinstance(t.get(k), str) for k in ("label", "input", "output")):
            rep.error(f"{where}: {i}번 테스트는 label/input/output 문자열이 필요합니다")
        elif not t["label"].strip():
            rep.error(f"{where}: {i}번 테스트 label 이 비어 있습니다")

    if path.name == "base.json":
        if p.get("category") != "기본기":
            rep.error(f"{where}: 기본기 문제의 category 는 '기본기' 여야 합니다")
        if p.get("addedOn") is not None:
            rep.error(f"{where}: 기본기 문제의 addedOn 은 null 이어야 합니다")
        return

    if SEED_FILE.match(path.name):
        if not SEED_ID.match(str(pid)):
            rep.error(f"{where}: seed 문제 id 는 seed-NNN 형식이어야 합니다")
        if not (isinstance(p.get("addedOn"), str) and ISO_DATE.match(p["addedOn"])):
            rep.error(f"{where}: seed 문제 addedOn 은 YYYY-MM-DD 여야 합니다 (현재 {p.get('addedOn')!r})")
    else:
        m = DATE_FILE.match(path.name)
        date = m.group(1) if m else None
        idm = DAILY_ID.match(str(pid))
        if not idm:
            rep.error(f"{where}: 일일 문제 id 는 daily-YYYY-MM-DD-N 형식이어야 합니다")
        elif idm.group(1) != date:
            rep.error(f"{where}: id 날짜가 파일 날짜({date})와 다릅니다")
        if p.get("addedOn") != date:
            rep.error(f"{where}: addedOn 은 파일 날짜({date})와 같아야 합니다 (현재 {p.get('addedOn')!r})")
    if p.get("category") == "기본기":
        rep.error(f"{where}: 일일·seed 문제의 category 는 '기본기' 일 수 없습니다")

    if pid in LEGACY_IDS:
        return
    # ---- 새 일일 문제에만 적용하는 엄격 규칙
    diff = p.get("difficulty")
    if diff in CATEGORY_OF and p.get("category") != CATEGORY_OF[diff]:
        rep.error(f"{where}: 난이도 '{diff}' 의 category 는 '{CATEGORY_OF[diff]}' 여야 합니다")
    if diff in TEST_COUNT:
        lo, hi = TEST_COUNT[diff]
        if not lo <= len(tests) <= hi:
            rep.error(f"{where}: '{diff}' 문제의 테스트는 {lo}~{hi}개여야 합니다 (현재 {len(tests)}개)")
        lo, hi = MINUTES[diff]
        if isinstance(p.get("minutes"), int) and not lo <= p["minutes"] <= hi:
            rep.error(f"{where}: '{diff}' 문제의 minutes 는 {lo}~{hi} 사이여야 합니다")
    for i, t in enumerate(tests, 1):
        if isinstance(t, dict) and isinstance(t.get("label"), str) and not t["label"].startswith(LABEL_PREFIXES):
            rep.error(f"{where}: {i}번 테스트 label 은 {LABEL_PREFIXES} 중 하나로 시작해야 합니다")
    labels = [t.get("label", "") for t in tests if isinstance(t, dict)]
    if not any(str(lb).startswith(("경계:", "반례:")) for lb in labels):
        rep.error(f"{where}: '경계:' 또는 '반례:' 테스트가 하나 이상 있어야 합니다")
    inputs = [t.get("input") for t in tests if isinstance(t, dict)]
    if len(set(inputs)) != len(inputs):
        rep.error(f"{where}: 입력이 같은 테스트가 있습니다")
    desc = p.get("description", "")
    if isinstance(desc, str):
        pos = [desc.find(h) for h in DESC_HEADERS]
        missing = [h for h, i in zip(DESC_HEADERS, pos) if i < 0]
        if missing:
            rep.error(f"{where}: description 에 {missing} 섹션이 없습니다")
        elif pos != sorted(pos):
            rep.error(f"{where}: description 섹션 순서가 템플릿과 다릅니다")
        if f"[난이도] {diff}" not in desc:
            rep.error(f"{where}: description 의 [난이도] 가 difficulty 와 다릅니다")
        if f"[유형] {p.get('category')}" not in desc:
            rep.error(f"{where}: description 의 [유형] 이 category 와 다릅니다")
        if f"[예상 풀이 시간] {p.get('minutes')}분" not in desc:
            rep.error(f"{where}: description 의 [예상 풀이 시간] 이 minutes 와 다릅니다")
    if p.get("python") != PY_TEMPLATE:
        rep.error(f"{where}: python 시작 코드는 정해진 템플릿이어야 합니다")
    if p.get("cpp") != CPP_TEMPLATE:
        rep.error(f"{where}: cpp 시작 코드는 정해진 템플릿이어야 합니다")


# ---------------------------------------------------------------- 정답 실행

class Runner:
    def __init__(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="recall-validate-"))
        self.gxx = shutil.which("g++")
        self.env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")

    def close(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def compile(self, src: Path) -> tuple[Path | None, str]:
        if not self.gxx:
            return None, "g++ 를 찾을 수 없습니다"
        exe = self.tmp / (src.stem.replace(".", "_") + (".exe" if os.name == "nt" else ""))
        try:
            r = subprocess.run([self.gxx, "-O2", "-std=c++17", "-o", str(exe), str(src)],
                               capture_output=True, text=True, timeout=COMPILE_TIME_LIMIT)
        except subprocess.TimeoutExpired:
            return None, "컴파일 시간 초과"
        if r.returncode != 0:
            return None, r.stderr.strip()[:2000]
        return exe, ""

    def run(self, cmd: list[str], stdin: str, limit: float) -> tuple[str, str, float, str | None]:
        """(stdout, stderr, 초, 실패사유|None)"""
        start = time.perf_counter()
        try:
            r = subprocess.run(cmd, input=stdin.encode("utf-8"), capture_output=True,
                               timeout=limit, env=self.env)
        except subprocess.TimeoutExpired:
            return "", "", time.perf_counter() - start, f"시간 초과(>{limit:g}초)"
        elapsed = time.perf_counter() - start
        out = r.stdout.decode("utf-8", "replace")
        err = r.stderr.decode("utf-8", "replace")
        if r.returncode != 0:
            return out, err, elapsed, f"종료 코드 {r.returncode}"
        return out, err, elapsed, None


def python_cmd(src: Path) -> list[str]:
    # -I: 스크립트 폴더를 sys.path 에 넣지 않는다(.solutions/string.py 가 표준 모듈을 가리지 않게).
    return [sys.executable, "-I", "-X", "utf8", str(src)]


def short(text: str, n: int = 300) -> str:
    text = text if len(text) <= n else text[:n] + f"…(+{len(text) - n}자)"
    return text.replace("\n", "⏎")


def check_solutions(rep: Report, runner: Runner, p: dict, require: bool) -> None:
    pid = p.get("id", "?")
    tests = p.get("tests") if isinstance(p.get("tests"), list) else []
    py_src = SOLUTIONS / f"{pid}.py"
    cpp_src = SOLUTIONS / f"{pid}.cpp"
    gen_src = SOLUTIONS / f"{pid}.gen.py"
    cmds: dict[str, tuple[list[str], float]] = {}

    if py_src.exists():
        cmds["Python"] = (python_cmd(py_src), PY_TIME_LIMIT)
    elif require:
        rep.error(f"{pid}: 정답 코드 .solutions/{pid}.py 가 없습니다")
    if cpp_src.exists():
        exe, msg = runner.compile(cpp_src)
        if exe is None:
            rep.error(f"{pid}: C++ 정답 컴파일 실패: {msg}")
        else:
            cmds["C++"] = ([str(exe)], CPP_TIME_LIMIT)
    elif require:
        rep.error(f"{pid}: 정답 코드 .solutions/{pid}.cpp 가 없습니다")

    for lang, (cmd, limit) in cmds.items():
        passed = 0
        worst = 0.0
        for i, t in enumerate(tests, 1):
            if not isinstance(t, dict):
                continue
            out, err, sec, fail = runner.run(cmd, t.get("input", ""), limit)
            worst = max(worst, sec)
            if fail:
                rep.error(f"{pid} [{lang}] {i}번 '{t.get('label')}': {fail} {short(err)}")
            elif not same_output(t.get("output", ""), out):
                rep.error(f"{pid} [{lang}] {i}번 '{t.get('label')}': 출력이 다릅니다 "
                          f"기대={short(t.get('output', ''))} 실제={short(out)}")
            else:
                passed += 1
        print(f"  {lang:6} {passed}/{len(tests)} 통과 (최대 {worst:.2f}초)")

    if gen_src.exists():
        if not cmds:
            rep.error(f"{pid}: 생성기가 있지만 실행할 정답 코드가 없습니다")
            return
        big, err, sec, fail = runner.run(python_cmd(gen_src), "", GEN_TIME_LIMIT)
        if fail:
            rep.error(f"{pid}: 생성기 실행 실패: {fail} {short(err)}")
            return
        outputs: dict[str, str] = {}
        for lang, (cmd, limit) in cmds.items():
            out, err, sec, fail = runner.run(cmd, big, limit)
            if fail:
                rep.error(f"{pid} [{lang}] 최대 입력({len(big):,}바이트): {fail} {short(err)}")
            else:
                outputs[lang] = out
                print(f"  {lang:6} 최대 입력 {len(big):,}바이트 → {sec:.2f}초 (제한 {limit:g}초)")
        if len(outputs) == 2 and not same_output(outputs["Python"], outputs["C++"]):
            rep.error(f"{pid}: 최대 입력에서 Python 과 C++ 결과가 다릅니다 "
                      f"py={short(outputs['Python'], 120)} cpp={short(outputs['C++'], 120)}")
    elif require and p.get("difficulty") in ("기본", "도전") and pid not in LEGACY_IDS:
        rep.warn(f"{pid}: 최대 크기 입력 생성기 .solutions/{pid}.gen.py 가 없습니다")


# ---------------------------------------------------------------- main

def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="recall 문제 데이터 검증")
    ap.add_argument("--only", nargs="+", metavar="ID", help="이 id 들만 검사")
    ap.add_argument("--require-solutions", action="store_true", help="py/cpp 정답 코드 필수")
    ap.add_argument("--build-manifest", action="store_true", help="problems/manifest.json 다시 만들기")
    ap.add_argument("--schema-only", action="store_true", help="정답 코드는 실행하지 않음")
    args = ap.parse_args()

    rep = Report()
    if args.build_manifest:
        files = build_manifest()
        print(f"manifest.json 갱신: {files}")

    print("== 스키마 검사")
    items = load_all(rep)
    check_manifest(rep)
    check_file_level(rep, items)
    seen: dict[str, str] = {}
    for path, p in items:
        pid = p.get("id") if isinstance(p, dict) else None
        if pid in seen:
            rep.error(f"id 중복: {pid} ({seen[pid]}, {path.name})")
        elif pid:
            seen[pid] = path.name
        if not args.only or pid in args.only:
            check_problem(rep, path, p)
    base_ids = [p.get("id") for path, p in items if path.name == "base.json"]
    if sorted(base_ids) != sorted(BASE_IDS):
        rep.error(f"base.json 의 id 는 {BASE_IDS} 여야 합니다 (현재 {base_ids})")
    print(f"  문제 {len(items)}개, 파일 {len({pth for pth, _ in items})}개")

    targets = [p for _, p in items if isinstance(p, dict)]
    if args.only:
        unknown = [i for i in args.only if i not in seen]
        for i in unknown:
            rep.error(f"--only: '{i}' 문제를 찾을 수 없습니다")
        targets = [p for p in targets if p.get("id") in args.only]

    if not args.schema_only:
        runner = Runner()
        try:
            for p in targets:
                print(f"== {p.get('id')}  {p.get('title')}")
                check_solutions(rep, runner, p, args.require_solutions)
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
