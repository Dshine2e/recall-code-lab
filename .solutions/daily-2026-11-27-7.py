import sys
from bisect import bisect_left


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    st = sorted(map(int, data[2:2 + n]))
    out = []
    for t in data[2 + n:2 + n + q]:
        p = int(t)
        k = bisect_left(st, p)
        best = None
        if k > 0:
            best = (p - st[k - 1], st[k - 1])
        if k < n:
            cand = (st[k] - p, st[k])
            if best is None or cand < best:
                best = cand
        out.append(f"{best[1]} {best[0]}")
    sys.stdout.write("\n".join(out) + "\n")


main()
