#!/usr/bin/env python3
"""문제 수 통계: 난이도별 개수·비율과 목표(기본 50개 = 입문 15 / 기본 25 / 도전 10) 대비 부족분.

사용법:
  python3 tools/stats.py                 # manifest 에 있는 문제 기준
  python3 tools/stats.py --target 15 25 10
  python3 tools/stats.py --topics        # 난이도별 topic 목록도 출력
  python3 tools/stats.py --json          # 기계가 읽을 형식
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS = ROOT / "problems"
DIFFICULTIES = ["입문", "기본", "도전"]


def load() -> list[dict]:
    files = json.loads((PROBLEMS / "manifest.json").read_text(encoding="utf-8")).get("files", [])
    out = []
    for name in files:
        for p in json.loads((PROBLEMS / name).read_text(encoding="utf-8")):
            out.append({**p, "_file": name})
    return out


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="recall 문제 통계")
    ap.add_argument("--target", nargs=3, type=int, metavar=("입문", "기본", "도전"), default=[15, 25, 10])
    ap.add_argument("--topics", action="store_true", help="난이도별 topic 목록 출력")
    ap.add_argument("--json", action="store_true", help="JSON 으로 출력")
    args = ap.parse_args()

    problems = load()
    by_diff = Counter(p.get("difficulty") for p in problems)
    by_source = Counter("기본기" if p["_file"] == "base.json" else "seed" if p["_file"].startswith("seed-")
                        else "일일" for p in problems)
    total = len(problems)
    target = dict(zip(DIFFICULTIES, args.target))
    need = {d: max(0, target[d] - by_diff.get(d, 0)) for d in DIFFICULTIES}

    if args.json:
        print(json.dumps({"total": total, "byDifficulty": {d: by_diff.get(d, 0) for d in DIFFICULTIES},
                          "bySource": dict(by_source), "target": target, "need": need}, ensure_ascii=False))
        return 0

    print(f"전체 {total}개 (일일 {by_source.get('일일', 0)} · seed {by_source.get('seed', 0)} · 기본기 {by_source.get('기본기', 0)})")
    for d in DIFFICULTIES:
        n = by_diff.get(d, 0)
        ratio = n / total * 100 if total else 0
        print(f"  {d}  {n:3d}개  {ratio:5.1f}%   목표 {target[d]:3d}  부족 {need[d]}")
    others = {k: v for k, v in by_diff.items() if k not in DIFFICULTIES}
    if others:
        print(f"  (알 수 없는 난이도: {others})")
    tsum = sum(args.target)
    print(f"비율 {':'.join(str(by_diff.get(d, 0)) for d in DIFFICULTIES)} "
          f"(목표 {':'.join(map(str, args.target))}, 합 {tsum}) · 더 만들 문제 {sum(need.values())}개")

    if args.topics:
        topics = defaultdict(list)
        for p in problems:
            topics[p.get("difficulty")].append(f"{p.get('id')}: {p.get('topic')}")
        for d in DIFFICULTIES:
            print(f"\n[{d}]")
            for line in topics.get(d, []):
                print(f"  {line}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
