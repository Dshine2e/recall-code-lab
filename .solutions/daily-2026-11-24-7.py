import sys
from itertools import accumulate

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    rects = [data[1 + 4 * i:5 + 4 * i] for i in range(n)]
    xs = sorted({r[0] for r in rects} | {r[2] for r in rects})
    ys = sorted({r[1] for r in rects} | {r[3] for r in rects})
    xi = {v: i for i, v in enumerate(xs)}
    yi = {v: i for i, v in enumerate(ys)}
    w, h = len(xs), len(ys)
    d = [[0] * h for _ in range(w)]
    for x1, y1, x2, y2 in rects:
        a, b, c, e = xi[x1], yi[y1], xi[x2], yi[y2]
        d[a][b] += 1
        d[c][b] -= 1
        d[a][e] -= 1
        d[c][e] += 1
    dy = [ys[j + 1] - ys[j] for j in range(h - 1)]
    union = once = 0
    prev = [0] * h
    for i in range(w - 1):
        row = [p + q for p, q in zip(prev, accumulate(d[i]))]
        prev = row
        dx = xs[i + 1] - xs[i]
        su = so = 0
        for c, l in zip(row, dy):
            if c:
                su += l
                if c == 1:
                    so += l
        union += su * dx
        once += so * dx
    print(union)
    print(once)

main()
